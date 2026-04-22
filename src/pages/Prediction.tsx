import { ChangeEvent, useState } from "react";
import Layout from "@/components/Layout";
import { Brain, Star, TrendingUp } from "lucide-react";
import Papa from "papaparse";

interface PredictionResult {
  rating: number;
  category: "High" | "Medium" | "Low";
  model?: string;
}

type CsvRow = Record<string, string>;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

const Prediction = () => {
  const [cost, setCost] = useState("");
  const [priceRange, setPriceRange] = useState("2");
  const [delivery, setDelivery] = useState("Yes");
  const [booking, setBooking] = useState("No");
  const [cities, setCities] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedCities = Array.from(
          new Set(
            (results.data as CsvRow[])
              .map((row) => row["City"] || row["city"] || "")
              .map((name) => name.trim())
              .filter(Boolean)
          )
        ).sort((a, b) => a.localeCompare(b));

        setCities(parsedCities);
        setCity(parsedCities[0] ?? "");
      },
    });
  };

  const handlePredict = async () => {
    setLoading(true);
    setError("");

    const parsedCost = Number(cost);

    const requestBody = {
      city,
      average_cost_for_two: Number.isFinite(parsedCost) ? parsedCost : 0,
      price_range: Number(priceRange),
      has_online_delivery: delivery === "Yes",
      has_table_booking: booking === "Yes",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseBody = (await response.json().catch(() => null)) as
        | PredictionResult
        | { detail?: string }
        | null;

      if (!response.ok) {
        const backendDetail =
          responseBody && "detail" in responseBody && typeof responseBody.detail === "string"
            ? responseBody.detail
            : null;

        throw new Error(backendDetail ?? `Prediction request failed (HTTP ${response.status})`);
      }

      const prediction = responseBody as PredictionResult;
      setResult(prediction);
    } catch (err) {
      setResult(null);

      if (err instanceof TypeError) {
        setError(`Prediction service is unavailable at ${API_BASE_URL}. Start the backend to use the ML model.`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Prediction request failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const categoryColor = result?.category === "High" ? "text-accent" : result?.category === "Medium" ? "text-secondary" : "text-destructive";

  return (
    <Layout>
      <div className="container py-12 max-w-2xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Rating Prediction</h1>
        <p className="text-muted-foreground mb-10">Enter restaurant details to predict its rating</p>

        <div className="rounded-xl border border-border bg-card p-8 shadow-card space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Upload CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {fileName ? `Loaded: ${fileName}` : "Upload a CSV to load city options"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Average Cost for Two (₹)</label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Enter cost"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Price Range</label>
              <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="1">1 — Budget</option>
                <option value="2">2 — Mid Range</option>
                <option value="3">3 — High End</option>
                <option value="4">4 — Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">City</label>
              <select value={city} onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={cities.length === 0}
              >
                {cities.length === 0 ? (
                  <option value="">Upload CSV first</option>
                ) : (
                  cities.map((c) => <option key={c} value={c}>{c}</option>)
                )}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Has Online Delivery</label>
              <select value={delivery} onChange={(e) => setDelivery(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Has Table Booking</label>
              <select value={booking} onChange={(e) => setBooking(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading || cities.length === 0 || !city}
            className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 shadow-card"
          >
            <Brain className="h-5 w-5" />
            {loading ? "Predicting..." : "Predict Rating"}
          </button>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        {result && (
          <div className="mt-8 rounded-xl border border-border bg-card p-8 shadow-elevated animate-fade-in">
            <h3 className="font-display text-xl font-semibold mb-6 text-center">Prediction Result</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex flex-col items-center gap-2 rounded-lg bg-muted p-6">
                <Star className="h-8 w-8 text-secondary" />
                <span className="text-3xl font-bold font-display">{result.rating}</span>
                <span className="text-sm text-muted-foreground">Predicted Rating</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg bg-muted p-6">
                <TrendingUp className={`h-8 w-8 ${categoryColor}`} />
                <span className={`text-3xl font-bold font-display ${categoryColor}`}>{result.category}</span>
                <span className="text-sm text-muted-foreground">Performance Category</span>
              </div>
            </div>
            {result.model && (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Model used: {result.model}
              </p>
            )}
          </div>
        )}

      </div>
    </Layout>
  );
};

export default Prediction;
