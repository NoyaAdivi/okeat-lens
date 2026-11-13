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
    """English name, Hebrew name, diet tags and kosher type of one dish."""
    try:
        return _by_key()[key]
    except KeyError as e:
        raise KeyError(f"unknown dish: {key}") from e


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
    return {
        "dish": best if sure else None,
        "top": top,
        "confident": sure,
        "hints": {
            "tags": best["tags"] if sure else [],
            "kosher": best["kosher"] if sure else None,
            "verified": False,
        },
        "okeat_url": OKEAT_MAP_URL,
    }
