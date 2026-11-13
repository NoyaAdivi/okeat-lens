"""Fine-tune MobileNetV3 on Food-101 (101 dishes, 101,000 photos).

Quick test run:   python train.py --epochs 1 --subset 0.05
Full run (GPU):   python train.py --epochs 8
The dataset (~5 GB) downloads to ./data on the first run.
"""
from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

import torch
from torch import nn
from torch.utils.data import DataLoader, Subset
from torchvision import datasets
from torchvision import transforms as T

from lens.diet import class_keys
from lens.predictor import IMAGE_SIZE, MEAN, STD, build_model, eval_transform


def parse_args():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--data", default="data")
    p.add_argument("--out", default="models/okeat-lens.pt")
    p.add_argument("--epochs", type=int, default=8)
    p.add_argument("--batch", type=int, default=64)
    p.add_argument("--lr", type=float, default=1e-3)
    p.add_argument("--warmup", type=int, default=1, help="epochs with a frozen backbone")
    p.add_argument("--subset", type=float, default=1.0, help="fraction of the data, for quick runs")
    p.add_argument("--workers", type=int, default=4)
    return p.parse_args()


def loaders(args):
    train_tf = T.Compose([
        T.RandomResizedCrop(IMAGE_SIZE, scale=(0.6, 1.0)),
        T.RandomHorizontalFlip(),
        T.ColorJitter(0.2, 0.2, 0.2),
        T.ToTensor(),
        T.Normalize(MEAN, STD),
    ])
    train = datasets.Food101(args.data, split="train", transform=train_tf, download=True)
    test = datasets.Food101(args.data, split="test", transform=eval_transform(), download=True)
    assert train.classes == class_keys(), "labels.json must follow the Food-101 class order"
    if args.subset < 1:
        g = torch.Generator().manual_seed(0)
        train = Subset(train, torch.randperm(len(train), generator=g)[: int(len(train) * args.subset)].tolist())
        test = Subset(test, torch.randperm(len(test), generator=g)[: int(len(test) * args.subset)].tolist())
    kw = dict(batch_size=args.batch, num_workers=args.workers, pin_memory=torch.cuda.is_available())
    return DataLoader(train, shuffle=True, **kw), DataLoader(test, **kw)


@torch.inference_mode()
def evaluate(model, loader, device):
    model.eval()
    top1 = top5 = n = 0
    for x, y in loader:
        x, y = x.to(device), y.to(device)
        pred = model(x).topk(5, dim=1).indices
        top1 += (pred[:, 0] == y).sum().item()
        top5 += (pred == y[:, None]).any(dim=1).sum().item()
        n += y.numel()
    return top1 / n, top5 / n


def main():
    args = parse_args()
    device = "cuda" if torch.cuda.is_available() else "cpu"
    train_dl, test_dl = loaders(args)
    model = build_model(len(class_keys())).to(device)
    loss_fn = nn.CrossEntropyLoss(label_smoothing=0.1)
    scaler = torch.amp.GradScaler(enabled=device == "cuda")
    best, history = 0.0, []
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)

    for epoch in range(1, args.epochs + 1):
        frozen = epoch <= args.warmup
        for p in model.features.parameters():
            p.requires_grad = not frozen
        if epoch == 1 or epoch == args.warmup + 1:
            opt = torch.optim.AdamW([p for p in model.parameters() if p.requires_grad],
                                    lr=args.lr if frozen else args.lr / 3, weight_decay=1e-4)
            sched = torch.optim.lr_scheduler.CosineAnnealingLR(opt, T_max=len(train_dl) * (args.epochs - epoch + 1))
        model.train()
        t0, running = time.time(), 0.0
        for i, (x, y) in enumerate(train_dl, 1):
            x, y = x.to(device), y.to(device)
            opt.zero_grad(set_to_none=True)
            with torch.autocast(device_type=device, enabled=device == "cuda"):
                loss = loss_fn(model(x), y)
            scaler.scale(loss).backward()
            scaler.step(opt)
            scaler.update()
            sched.step()
            running += loss.item()
            if i % 100 == 0:
                print(f"  epoch {epoch} step {i}/{len(train_dl)} loss {running / i:.3f}")
        acc1, acc5 = evaluate(model, test_dl, device)
        history.append({"epoch": epoch, "loss": running / len(train_dl), "top1": acc1, "top5": acc5})
        print(f"epoch {epoch}: top-1 {acc1:.1%}  top-5 {acc5:.1%}  ({time.time() - t0:.0f}s)")
        if acc1 > best:
            best = acc1
            torch.save({"model": model.state_dict(), "classes": class_keys(), "top1": acc1, "top5": acc5}, args.out)
            print(f"  saved {args.out}")

    Path("models/metrics.json").write_text(json.dumps({"best_top1": best, "history": history}, indent=2))
    print(f"done. best top-1 accuracy: {best:.1%}")


if __name__ == "__main__":
    main()
