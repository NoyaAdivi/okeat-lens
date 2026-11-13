"""REST API: send a photo, get the dish and its diet hints back.

Run:  uvicorn lens.api:app --reload
"""
from __future__ import annotations

import io
import os

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from . import __version__
from .diet import build_result, classes

MAX_BYTES = 8 * 1024 * 1024


def create_app(predictor=None) -> FastAPI:
    app = FastAPI(title="Okeat Lens", version=__version__,
                  description="Recognize a dish from a photo and get Okeat diet hints.")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=os.getenv("LENS_ORIGINS", "*").split(","),
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )
    state = {"predictor": predictor}

    def get_predictor():
        if state["predictor"] is None:
            from .predictor import DEFAULT_WEIGHTS, FoodPredictor
            try:
                state["predictor"] = FoodPredictor(os.getenv("LENS_WEIGHTS") or DEFAULT_WEIGHTS)
            except FileNotFoundError:
                raise HTTPException(503, "Model not trained yet. Run: python train.py")
        return state["predictor"]

    @app.get("/health")
    def health():
        return {"status": "ok", "version": __version__}

    @app.get("/labels")
    def labels():
        return {"count": len(classes()), "classes": classes()}

    @app.post("/predict")
    async def predict(file: UploadFile = File(...), k: int = 5):
        if not 1 <= k <= 10:
            raise HTTPException(422, "k must be between 1 and 10")
        data = await file.read()
        if len(data) > MAX_BYTES:
            raise HTTPException(413, "Image is larger than 8 MB")
        try:
            image = Image.open(io.BytesIO(data))
            image.load()
        except (UnidentifiedImageError, OSError):
            raise HTTPException(415, "This file is not an image")
        return build_result(get_predictor().predict(image, k=k))

    return app


app = create_app()
