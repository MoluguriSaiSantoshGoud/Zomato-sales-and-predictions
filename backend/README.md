# Backend ML API

This backend trains and serves a restaurant rating model from CSV data.

## 1) Create and activate a virtual environment

Windows PowerShell:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

## 2) Install Python dependencies

```powershell
pip install -r requirements.txt
```

## 3) Train models and save the best one

```powershell
python train_model.py
```

What this does:
- Loads CSV dataset (default: ../src/pages/zomato sales.csv)
- Trains Linear Regression, Random Forest, and XGBoost (if available)
- Compares model metrics (RMSE, MAE, R2)
- Saves best model to models/restaurant_rating_model.pkl

## 4) Run FastAPI backend

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## API Endpoints

- `GET /health`
- `GET /model-info`
- `POST /predict`

### POST /predict payload

```json
{
  "city": "Bangalore",
  "average_cost_for_two": 700,
  "price_range": 2,
  "has_online_delivery": true,
  "has_table_booking": false
}
```
