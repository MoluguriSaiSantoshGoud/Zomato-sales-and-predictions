import { useState } from "react";
import Layout from "@/components/Layout";
import { Brain, Star, TrendingUp } from "lucide-react";

const cities = ["New Delhi", "Bangalore", "Mumbai", "Pune", "Chennai", "Kolkata", "Hyderabad", "Jaipur", "Lucknow", "Ahmedabad"];

interface PredictionResult {
  rating: number;
  category: "High" | "Medium" | "Low";
}

const simulatePrediction = (cost: number, priceRange: number, delivery: boolean, booking: boolean): PredictionResult => {
  let score = 3.0;
  score += priceRange * 0.2;
  if (delivery) score += 0.3;
  if (booking) score += 0.2;
  if (cost > 500) score += 0.2;
  if (cost > 1000) score += 0.1;
  const rating = Math.min(5, Math.max(1, parseFloat((score + (Math.random() * 0.3 - 0.15)).toFixed(1))));
  const category = rating >= 4.0 ? "High" : rating >= 3.0 ? "Medium" : "Low";
  return { rating, category };
};

const Prediction = () => {
  const [cost, setCost] = useState(500);
  const [priceRange, setPriceRange] = useState("2");
  const [delivery, setDelivery] = useState("Yes");
  const [booking, setBooking] = useState("No");
  const [city, setCity] = useState(cities[0]);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = () => {
    setLoading(true);
    setTimeout(() => {
      const pred = simulatePrediction(cost, parseInt(priceRange), delivery === "Yes", booking === "Yes");
      setResult(pred);
      setLoading(false);
    }, 800);
  };

  const categoryColor = result?.category === "High" ? "text-accent" : result?.category === "Medium" ? "text-secondary" : "text-destructive";

  return (
    <Layout>
      <div className="container py-12 max-w-2xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Rating Prediction</h1>
        <p className="text-muted-foreground mb-10">Enter restaurant details to predict its rating</p>

        <div className="rounded-xl border border-border bg-card p-8 shadow-card space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Average Cost for Two (₹)</label>
            <input
              type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))}
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
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
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
            disabled={loading}
            className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 shadow-card"
          >
            <Brain className="h-5 w-5" />
            {loading ? "Predicting..." : "Predict Rating"}
          </button>
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
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-6">
          * Currently using simulated predictions. Connect a Flask backend API for real ML predictions.
        </p>
      </div>
    </Layout>
  );
};

export default Prediction;
