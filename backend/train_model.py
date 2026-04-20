from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [
        str(col).strip().lower().replace(" ", "_").replace("-", "_")
        for col in df.columns
    ]
    return df


def read_dataset(path: Path) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(f"Dataset not found: {path}")

    # Auto-detect delimiter for both comma-separated and tab-separated CSV files.
    data = pd.read_csv(path, sep=None, engine="python")
    return normalize_columns(data)


def to_binary(series: pd.Series) -> pd.Series:
    mapped = series.astype(str).str.strip().str.lower().map({"yes": 1, "no": 0})
    return pd.to_numeric(mapped, errors="coerce")


def prepare_features(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series, list[str]]:
    required = [
        "city",
        "average_cost_for_two",
        "price_range",
        "has_online_delivery",
        "has_table_booking",
        "aggregate_rating",
    ]

    missing = [col for col in required if col not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {missing}")

    work = df[required].copy()

    work["city"] = work["city"].astype(str).str.strip().replace("", "Unknown")
    work["average_cost_for_two"] = pd.to_numeric(work["average_cost_for_two"], errors="coerce")
    work["price_range"] = pd.to_numeric(work["price_range"], errors="coerce")
    work["has_online_delivery"] = to_binary(work["has_online_delivery"])
    work["has_table_booking"] = to_binary(work["has_table_booking"])
    work["aggregate_rating"] = pd.to_numeric(work["aggregate_rating"], errors="coerce")

    work = work.dropna(subset=["aggregate_rating"])

    for col in ["average_cost_for_two", "price_range", "has_online_delivery", "has_table_booking"]:
        work[col] = work[col].fillna(work[col].median())

    x = work.drop(columns=["aggregate_rating"])
    y = work["aggregate_rating"]
    unique_cities = sorted([city for city in x["city"].unique() if city and city != "Unknown"])

    return x, y, unique_cities


def evaluate_model(y_true: pd.Series, y_pred: np.ndarray) -> dict[str, float]:
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    mae = float(mean_absolute_error(y_true, y_pred))
    r2 = float(r2_score(y_true, y_pred))
    return {"rmse": rmse, "mae": mae, "r2": r2}


def build_models() -> dict[str, Any]:
    models: dict[str, Any] = {
        "linear_regression": LinearRegression(),
        "random_forest": RandomForestRegressor(
            n_estimators=300,
            random_state=42,
            n_jobs=-1,
        ),
    }

    try:
        from xgboost import XGBRegressor

        models["xgboost"] = XGBRegressor(
            objective="reg:squarederror",
            random_state=42,
            n_estimators=400,
            learning_rate=0.05,
            max_depth=6,
            subsample=0.9,
            colsample_bytree=0.9,
        )
    except Exception:
        # Keep training usable even if xgboost is unavailable in the environment.
        pass

    return models


def train(data_path: Path, model_path: Path) -> None:
    raw = read_dataset(data_path)
    x, y, unique_cities = prepare_features(raw)

    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=42,
    )

    categorical_features = ["city"]
    numeric_features = [
        "average_cost_for_two",
        "price_range",
        "has_online_delivery",
        "has_table_booking",
    ]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
            ("num", "passthrough", numeric_features),
        ]
    )

    models = build_models()
    results: dict[str, dict[str, float]] = {}
    trained_pipelines: dict[str, Pipeline] = {}

    for model_name, estimator in models.items():
        pipeline = Pipeline(
            steps=[
                ("preprocessor", preprocessor),
                ("model", estimator),
            ]
        )

        pipeline.fit(x_train, y_train)
        predictions = pipeline.predict(x_test)
        metrics = evaluate_model(y_test, predictions)

        results[model_name] = metrics
        trained_pipelines[model_name] = pipeline

    best_model_name = max(results, key=lambda name: results[name]["r2"])
    best_pipeline = trained_pipelines[best_model_name]

    model_path.parent.mkdir(parents=True, exist_ok=True)

    artifact = {
        "model": best_pipeline,
        "best_model": best_model_name,
        "metrics": results,
        "feature_columns": [
            "city",
            "average_cost_for_two",
            "price_range",
            "has_online_delivery",
            "has_table_booking",
        ],
        "unique_cities": unique_cities,
    }

    joblib.dump(artifact, model_path)

    metrics_path = model_path.with_suffix(".metrics.json")
    with metrics_path.open("w", encoding="utf-8") as file:
        json.dump(
            {
                "best_model": best_model_name,
                "metrics": results,
                "train_rows": int(len(x_train)),
                "test_rows": int(len(x_test)),
                "city_count": len(unique_cities),
            },
            file,
            indent=2,
        )

    print(f"Saved model: {model_path}")
    print(f"Best model: {best_model_name}")
    print(f"Metrics file: {metrics_path}")


def parse_args() -> argparse.Namespace:
    default_dataset = Path(__file__).resolve().parents[1] / "src" / "pages" / "zomato sales.csv"
    default_model_path = Path(__file__).resolve().parent / "models" / "restaurant_rating_model.pkl"

    parser = argparse.ArgumentParser(description="Train restaurant rating model.")
    parser.add_argument("--data-path", type=Path, default=default_dataset)
    parser.add_argument("--model-path", type=Path, default=default_model_path)
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    train(data_path=args.data_path, model_path=args.model_path)
