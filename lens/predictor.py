"""Loads the trained model and predicts a dish from an image.

PyTorch is imported only when a predictor is created, so the API and the
tests can load without it.
"""
from __future__ import annotations

from pathlib import Path

from .diet import class_keys

DEFAULT_WEIGHTS = Path(__file__).resolve().parent.parent / "models" / "okeat-lens.pt"
IMAGE_SIZE = 224
MEAN = (0.485, 0.456, 0.406)
STD = (0.229, 0.224, 0.225)


def build_model(num_classes: int, pretrained: bool = True):
    import torch.nn as nn
    from torchvision.models import MobileNet_V3_Large_Weights, mobilenet_v3_large

    weights = MobileNet_V3_Large_Weights.IMAGENET1K_V2 if pretrained else None
    model = mobilenet_v3_large(weights=weights)
    in_features = model.classifier[-1].in_features
    model.classifier[-1] = nn.Linear(in_features, num_classes)
    return model


def eval_transform():
    from torchvision import transforms as T

    return T.Compose([
        T.Resize(256),
        T.CenterCrop(IMAGE_SIZE),
        T.ToTensor(),
        T.Normalize(MEAN, STD),
    ])


class FoodPredictor:
    def __init__(self, weights: str | Path = DEFAULT_WEIGHTS, device: str | None = None):
        import torch

        self.torch = torch
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.keys = class_keys()
        self.model = build_model(len(self.keys), pretrained=False)
        state = torch.load(weights, map_location=self.device)
        self.model.load_state_dict(state["model"] if "model" in state else state)
        self.model.to(self.device).eval()
        self.transform = eval_transform()

    def predict(self, image, k: int = 5) -> list[tuple[str, float]]:
        """image: a PIL image. Returns the k best (dish key, probability) pairs."""
        x = self.transform(image.convert("RGB")).unsqueeze(0).to(self.device)
        with self.torch.inference_mode():
            probs = self.model(x).softmax(dim=1)[0]
        values, idx = probs.topk(k)
        return [(self.keys[i], float(v)) for v, i in zip(values.tolist(), idx.tolist())]
