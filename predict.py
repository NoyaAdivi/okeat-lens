"""Recognize the dish in a photo from the command line.

python predict.py path/to/photo.jpg
"""
import argparse
import json

from PIL import Image

from lens.diet import build_result
from lens.predictor import DEFAULT_WEIGHTS, FoodPredictor

p = argparse.ArgumentParser(description="Okeat Lens: what's on the plate?")
p.add_argument("image")
p.add_argument("--weights", default=DEFAULT_WEIGHTS)
p.add_argument("--json", action="store_true", help="print the full JSON result")
args = p.parse_args()

result = build_result(FoodPredictor(args.weights).predict(Image.open(args.image)))
if args.json:
    print(json.dumps(result, ensure_ascii=False, indent=2))
else:
    for d in result["top"]:
        bar = "█" * round(d["confidence"] * 30)
        print(f"{d['en']:<26} {d['he']:<20} {d['confidence']:6.1%} {bar}")
    if result["dish"]:
        print("\nhints:", ", ".join(result["hints"]["tags"]) or "none", "| kosher:", result["hints"]["kosher"])
