from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

MODEL_PATH = Path(__file__).resolve().parents[1] / "models" / "restaurant_rating_model.pkl"


class PredictionRequest(BaseModel):
    city: str = Field(min_length=1)
    average_cost_for_two: float = Field(ge=0)
    price_range: int = Field(ge=1, le=4)
    has_online_delivery: bool
    has_table_booking: bool


class PredictionResponse(BaseModel):
    rating: float
    category: str
    model: str


def to_category(rating: float) -> str:
    if rating >= 4.0:
        return "High"
    if rating >= 3.0:
        return "Medium"
    return "Low"


def load_artifact() -> dict[str, Any]:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model not found at {MODEL_PATH}. Run backend/train_model.py first."
        )
    return joblib.load(MODEL_PATH)


app = FastAPI(title="Zomato Insights API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/model-info")
def model_info() -> dict[str, Any]:
    artifact = load_artifact()
    return {
        "best_model": artifact.get("best_model"),
        "metrics": artifact.get("metrics"),
        "city_count": len(artifact.get("unique_cities", [])),
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest) -> PredictionResponse:
    try:
        artifact = load_artifact()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    model = artifact["model"]

    frame = pd.DataFrame(
        [
            {
                "city": payload.city,
                "average_cost_for_two": payload.average_cost_for_two,
                "price_range": payload.price_range,
                "has_online_delivery": int(payload.has_online_delivery),
                "has_table_booking": int(payload.has_table_booking),
            }
        ]
    )

    prediction = float(model.predict(frame)[0])
    rating = max(1.0, min(5.0, round(prediction, 1)))

    return PredictionResponse(
        rating=rating,
        category=to_category(rating),
        model=artifact.get("best_model", "unknown"),
    )
