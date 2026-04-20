# Zomato Insights

A full-stack restaurant analytics and prediction project built with React + TypeScript on the frontend and FastAPI + scikit-learn/XGBoost on the backend.

## Features

- CSV-based analytics dashboard
- Dynamic city extraction from uploaded dataset
- Rating prediction form connected to backend API
- ML training pipeline with model comparison:
	- Linear Regression
	- Random Forest
	- XGBoost
- Best model artifact saved as `.pkl`

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn-ui
- FastAPI
- scikit-learn
- XGBoost

## Project Structure

```text
.
|-- src/                 # Frontend app (React + TypeScript)
|-- backend/
|   |-- app/main.py      # FastAPI application
|   |-- train_model.py   # ML training pipeline
|   |-- requirements.txt # Python dependencies
|   `-- models/          # Saved model artifacts (.pkl)
`-- public/              # Static assets and dataset files
```

## Frontend Setup

```sh
npm install
npm run dev
```

Frontend runs by default at:

```text
http://localhost:5173
```

## Backend Setup (FastAPI)

From project root:

```sh
cd backend
python -m venv .venv
```

Activate virtual environment on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```sh
pip install -r requirements.txt
```

## Train the Model

```sh
python train_model.py
```

This will:

- Load the dataset CSV
- Train Linear Regression, Random Forest, and XGBoost (if available)
- Compare metrics (RMSE, MAE, R2)
- Save best model to:

```text
backend/models/restaurant_rating_model.pkl
```

## Run Backend API

```sh
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend base URL:

```text
http://127.0.0.1:8000
```

## API Endpoints

- `GET /health`
- `GET /model-info`
- `POST /predict`

Example prediction payload:

```json
{
	"city": "Bangalore",
	"average_cost_for_two": 700,
	"price_range": 2,
	"has_online_delivery": true,
	"has_table_booking": false
}
```

## Optional Frontend API URL Override

If needed, create a `.env` file at project root:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Testing

```sh
npm run test
```
