import Layout from "@/components/Layout";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";

const cityData = [
  { city: "New Delhi", rating: 4.2 },
  { city: "Bangalore", rating: 4.1 },
  { city: "Mumbai", rating: 3.9 },
  { city: "Pune", rating: 3.8 },
  { city: "Chennai", rating: 3.7 },
  { city: "Kolkata", rating: 3.6 },
  { city: "Hyderabad", rating: 4.0 },
  { city: "Jaipur", rating: 3.5 },
];

const priceRatingData = [
  { range: "₹1 (Budget)", rating: 3.2 },
  { range: "₹2 (Mid)", rating: 3.6 },
  { range: "₹3 (High)", rating: 4.0 },
  { range: "₹4 (Premium)", rating: 4.4 },
];

const deliveryData = [
  { name: "With Delivery", value: 62 },
  { name: "No Delivery", value: 38 },
];

const cuisineData = [
  { cuisine: "North Indian", count: 3200 },
  { cuisine: "Chinese", count: 2800 },
  { cuisine: "Fast Food", count: 2400 },
  { cuisine: "South Indian", count: 2100 },
  { cuisine: "Biryani", count: 1900 },
  { cuisine: "Mughlai", count: 1600 },
  { cuisine: "Desserts", count: 1500 },
  { cuisine: "Street Food", count: 1400 },
  { cuisine: "Italian", count: 1200 },
  { cuisine: "Continental", count: 1000 },
];

const PIE_COLORS = ["hsl(8, 75%, 52%)", "hsl(35, 90%, 55%)"];

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card p-6 shadow-card">
    <h3 className="font-display text-lg font-semibold mb-4">{title}</h3>
    <div className="h-72">{children}</div>
  </div>
);

const Analytics = () => (
  <Layout>
    <div className="container py-12">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Analytics Dashboard</h1>
      <p className="text-muted-foreground mb-10">Explore restaurant data trends from Zomato dataset</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Top Cities by Average Rating">
          <ResponsiveContainer>
            <BarChart data={cityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
              <XAxis type="number" domain={[3, 4.5]} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="city" width={80} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="rating" fill="hsl(8, 75%, 52%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Price Range vs Average Rating">
          <ResponsiveContainer>
            <LineChart data={priceRatingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis domain={[3, 4.6]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="rating" stroke="hsl(35, 90%, 55%)" strokeWidth={3} dot={{ r: 5, fill: "hsl(35, 90%, 55%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Online Delivery Impact on Rating">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={deliveryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} label>
                {deliveryData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 10 Cuisines">
          <ResponsiveContainer>
            <BarChart data={cuisineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
              <XAxis dataKey="cuisine" angle={-35} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(160, 45%, 45%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  </Layout>
);

export default Analytics;
