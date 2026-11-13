"""Export the trained model to ONNX, so it can run anywhere (even in a browser).

python export_onnx.py  ->  models/okeat-lens.onnx
"""
import torch

from lens.diet import class_keys
from lens.predictor import DEFAULT_WEIGHTS, IMAGE_SIZE, build_model

model = build_model(len(class_keys()), pretrained=False)
state = torch.load(DEFAULT_WEIGHTS, map_location="cpu")
model.load_state_dict(state["model"])
model.eval()
dummy = torch.randn(1, 3, IMAGE_SIZE, IMAGE_SIZE)
torch.onnx.export(model, dummy, "models/okeat-lens.onnx", input_names=["image"], output_names=["logits"],
                  dynamic_axes={"image": {0: "batch"}, "logits": {0: "batch"}}, opset_version=17)
print("saved models/okeat-lens.onnx")
