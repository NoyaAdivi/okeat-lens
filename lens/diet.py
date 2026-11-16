"""Dish labels (English and Hebrew) and the diet hints that come with them.

Everything here is pure Python, so it runs and tests without PyTorch.
"""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

LABELS_PATH = Path(__file__).resolve().parent.parent / "labels.json"
OKEAT_MAP_URL = "https://okeat.vercel.app/map"
DIET_TAGS = ("vegan", "vegetarian", "gluten_free")
KOSHER_TYPES = ("meat", "dairy", "parve", "not_kosher")
FOOD_GROUPS = ("grains", "vegetables", "fruit", "protein", "dairy", "treats")
ALLERGENS = ("gluten", "milk", "eggs", "nuts", "peanuts", "fish", "shellfish", "soy", "sesame")
MACROS = ("protein", "carbs", "fat", "fiber", "sugar")
# The six "food fathers" (nutrient families) taught in Israeli schools.
NUTRIENT_FAMILIES = ("carbs", "protein", "fat", "vitamins", "minerals", "water")


@lru_cache(maxsize=1)
def load_labels(path: str | None = None) -> dict:
    with open(path or LABELS_PATH, encoding="utf-8") as f:
        return json.load(f)


def classes() -> list[dict]:
    """All dishes in Food-101 order (the order the model's outputs use)."""
    return load_labels()["classes"]


def class_keys() -> list[str]:
    return [c["key"] for c in classes()]


@lru_cache(maxsize=1)
def _by_key() -> dict[str, dict]:
    return {c["key"]: c for c in classes()}


def dish(key: str) -> dict:
    """Names, diet tags, kosher type, allergens, food groups and nutrition of one dish."""
    try:
        return _by_key()[key]
    except KeyError as e:
        raise KeyError(f"unknown dish: {key}") from e


def daily_reference() -> dict:
    """Reference intakes for an average adult (2000 kcal), used for the % bars."""
    return load_labels()["daily_reference"]


def scale_nutrition(n: dict, portions: float = 1.0) -> dict:
    """Nutrition of `portions` servings. Grams round to 0.1, kcal and mg to whole numbers."""
    if portions <= 0:
        raise ValueError("portions must be positive")
    out = dict(n)
    out["serving_g"] = round(n["serving_g"] * portions)
    out["kcal"] = round(n["kcal"] * portions)
    out["sodium_mg"] = round(n["sodium_mg"] * portions)
    for k in MACROS:
        out[k] = round(n[k] * portions, 1)
    return out


def calorie_split(n: dict) -> dict:
    """Share of the calories that comes from protein, carbs and fat (adds up to 100)."""
    kc = {"protein": 4 * n["protein"], "carbs": 4 * n["carbs"], "fat": 9 * n["fat"]}
    total = sum(kc.values())
    if not total:
        return {k: 0 for k in kc}
    pct = {k: round(100 * v / total) for k, v in kc.items()}
    biggest = max(pct, key=pct.get)
    pct[biggest] += 100 - sum(pct.values())
    return pct


def nutrient_families(n: dict) -> dict:
    """How strongly each of the six nutrient families shows up in a dish, 0 to 3."""
    g = max(n["serving_g"], 1)

    def level(grams, high):
        share = grams / g
        return 3 if share >= high else 2 if share >= high / 2 else 1 if grams >= 1 else 0

    return {
        "carbs": level(n["carbs"], 0.30),
        "protein": level(n["protein"], 0.15),
        "fat": level(n["fat"], 0.15),
        "vitamins": min(3, len(n["vitamins"])),
        "minerals": min(3, len(n["minerals"])),
        "water": 3 if n["water_pct"] >= 75 else 2 if n["water_pct"] >= 50 else 1 if n["water_pct"] >= 20 else 0,
    }


def meal_totals(items: list[tuple[str, float]]) -> dict:
    """Add up a meal: (dish key, portions) pairs."""
    if not items:
        raise ValueError("empty meal")
    total = {"kcal": 0, "sodium_mg": 0, "serving_g": 0, **{k: 0.0 for k in MACROS}}
    for key, portions in items:
        n = scale_nutrition(dish(key)["nutrition"], portions)
        for k in total:
            total[k] += n[k]
    for k in MACROS:
        total[k] = round(total[k], 1)
    ref = daily_reference()
    total["daily_pct"] = {k: round(100 * total[k] / ref[k]) for k in ref}
    total["calorie_split"] = calorie_split(total)
    return total


def build_result(scores: list[tuple[str, float]], min_confidence: float = 0.15) -> dict:
    """Turn model scores into the JSON Okeat reads.

    scores: (dish key, probability) pairs, best first.
    Diet hints come only from the best guess, and only when the model is sure enough.
    """
    if not scores:
        raise ValueError("no scores")
    top = []
    for key, p in scores:
        d = dish(key)
        top.append({**d, "confidence": round(float(p), 4)})
    best = top[0]
    sure = best["confidence"] >= min_confidence
    n = best["nutrition"]
    return {
        "dish": best if sure else None,
        "nutrition": {**n, "calorie_split": calorie_split(n), "families": nutrient_families(n),
                      "estimate": True} if sure else None,
        "top": top,
        "confident": sure,
        "hints": {
            "tags": best["tags"] if sure else [],
            "kosher": best["kosher"] if sure else None,
            "verified": False,
        },
        "okeat_url": OKEAT_MAP_URL,
    }
