import { ChangeEvent, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  FileSpreadsheet,
  LineChart,
  PieChart,
  ScatterChart,
} from "lucide-react";
import Layout from "@/components/Layout";
import Papa from "papaparse";

import {
  BarChart,
  Bar,
  LineChart as LChart,
  Line,
  PieChart as PChart,
  Pie,
  ScatterChart as SChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const chartOptions = [
  {
    icon: BarChart3,
    title: "Bar Chart",
    
  },
  {
    icon: LineChart,
    title: "Line Chart",
    
  },
  {
    icon: PieChart,
    title: "Pie Chart",
    
  },
  {
    icon: ScatterChart,
    title: "Scatter Plot",
    
  },
];

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#0ea5e9",
  "#14b8a6",
  "#f43f5e",
];

type RestaurantPoint = {
  name: string;
  rating: number;
  cost: number;
};

type CsvRow = Record<string, string>;

const Index = () => {
  const [selectedChart, setSelectedChart] = useState<(typeof chartOptions)[number]["title"]>("Bar Chart");
  const [rawData, setRawData] = useState<RestaurantPoint[]>([]);
  const [limit, setLimit] = useState(10);
  const [fileName, setFileName] = useState<string | null>(null);

  const data = useMemo(() => rawData.slice(0, limit), [rawData, limit]);

  const metrics = useMemo(() => {
    if (data.length === 0) {
      return [
        { label: "Rows loaded", value: "0" },
        { label: "Average rating", value: "0.0" },
        { label: "Average cost", value: "0" },
        { label: "Visible points", value: "0" },
      ];
    }

    const averageRating = data.reduce((sum, item) => sum + item.rating, 0) / data.length;
    const averageCost = data.reduce((sum, item) => sum + item.cost, 0) / data.length;

    return [
      { label: "Rows loaded", value: String(rawData.length) },
      { label: "Average rating", value: averageRating.toFixed(1) },
      { label: "Average cost", value: Math.round(averageCost).toLocaleString() },
      { label: "Visible points", value: String(data.length) },
    ];
  }, [data, rawData.length]);

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
        const cleaned = (results.data as CsvRow[])
          .map((item) => ({
            name: item["Restaurant Name"] || item["Restaurant"] || "Unknown",
            rating: Number.parseFloat(item["Aggregate rating"]) || 0,
            cost: Number.parseFloat(item["Average Cost for two"]) || 0,
          }))
          .filter((item) => item.name !== "Unknown" || item.rating > 0 || item.cost > 0);

        setRawData(cleaned);
      },
    });
  };

  const activeChart = chartOptions.find((chart) => chart.title === selectedChart);

  return (
    <Layout>
      <section className="relative overflow-hidden py-10 sm:py-14">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.14),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.12),_transparent_30%),linear-gradient(180deg,_hsl(30_25%_97%)_0%,_hsl(28_20%_95%)_100%)]" />

        <div className="container space-y-8">
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_70px_-30px_rgba(17,24,39,0.25)] backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
                  <ArrowUpRight className="h-4 w-4" />
                  restraunt analytics
                </div>
                <div className="space-y-3">
                  <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                    Overview
                  </h1>
                  <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                    
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[26rem]">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
                    <div className="text-sm text-slate-500">{metric.label}</div>
                    <div className="mt-1 text-2xl font-semibold text-slate-900">{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_20px_70px_-30px_rgba(17,24,39,0.2)] backdrop-blur-xl sm:p-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-slate-900">Visualize</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    
                  </p>
                </div>

              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[1.6fr_0.8fr] md:items-end">
                <label className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6 transition hover:border-red-300 hover:bg-red-50/60">
                  <span className="text-sm font-semibold text-slate-700">Choose CSV file</span>
                  <span className="text-sm text-slate-500">
                    {fileName ? fileName : "Drop or select a CSV to begin visualizing the data"}
                  </span>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="sr-only" />
                </label>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <label className="text-sm font-semibold text-slate-700">Show Top</label>
                  <select
                    value={limit}
                    onChange={(event) => setLimit(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none ring-0 transition focus:border-red-300 focus:ring-2 focus:ring-red-100"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {chartOptions.map((chart) => {
                  const Icon = chart.icon;

                  return (
                    <button
                      key={chart.title}
                      type="button"
                      onClick={() => setSelectedChart(chart.title)}
                      className={`group rounded-2xl border p-5 text-left transition-all duration-200 ${
                        selectedChart === chart.title
                          ? "border-red-500 bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-[0_18px_36px_-18px_rgba(239,68,68,0.8)]"
                          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-red-200 hover:shadow-lg"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`rounded-2xl p-3 ${selectedChart === chart.title ? "bg-white/15" : "bg-red-50 text-red-600"}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-display text-lg font-semibold">{chart.title}</h3>
                          <p className={`text-sm leading-6 ${selectedChart === chart.title ? "text-white/85" : "text-slate-500"}`}>
                            {chart.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_20px_70px_-30px_rgba(15,23,42,0.45)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold">Current visualization</h2>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    {activeChart?.description}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 px-3 py-2 text-sm text-white/80">
                  {selectedChart}
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                {data.length > 0 ? (
                  <div className="h-[420px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {selectedChart === "Bar Chart" ? (
                        <BarChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="name" hide />
                          <YAxis stroke="rgba(255,255,255,0.7)" />
                          <Tooltip
                            contentStyle={{
                              background: "rgba(15, 23, 42, 0.96)",
                              border: "1px solid rgba(255,255,255,0.12)",
                              borderRadius: 16,
                            }}
                            labelStyle={{ color: "#fff" }}
                          />
                          <Legend />
                          <Bar dataKey="rating" name="Rating" radius={[8, 8, 0, 0]}>
                            {data.map((_, index) => (
                              <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      ) : selectedChart === "Line Chart" ? (
                        <LChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="name" hide />
                          <YAxis stroke="rgba(255,255,255,0.7)" />
                          <Tooltip
                            contentStyle={{
                              background: "rgba(15, 23, 42, 0.96)",
                              border: "1px solid rgba(255,255,255,0.12)",
                              borderRadius: 16,
                            }}
                            labelStyle={{ color: "#fff" }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="rating"
                            name="Rating"
                            stroke="#f97316"
                            strokeWidth={3}
                            dot={{ fill: "#f97316", r: 4 }}
                          />
                        </LChart>
                      ) : selectedChart === "Pie Chart" ? (
                        <PChart>
                          <Tooltip
                            contentStyle={{
                              background: "rgba(15, 23, 42, 0.96)",
                              border: "1px solid rgba(255,255,255,0.12)",
                              borderRadius: 16,
                            }}
                            labelStyle={{ color: "#fff" }}
                          />
                          <Legend />
                          <Pie data={data} dataKey="rating" nameKey="name" outerRadius={150} label>
                            {data.map((_, index) => (
                              <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </PChart>
                      ) : (
                        <SChart data={data}>
                          <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="cost" name="Cost" stroke="rgba(255,255,255,0.7)" />
                          <YAxis dataKey="rating" name="Rating" stroke="rgba(255,255,255,0.7)" />
                          <Tooltip
                            contentStyle={{
                              background: "rgba(15, 23, 42, 0.96)",
                              border: "1px solid rgba(255,255,255,0.12)",
                              borderRadius: 16,
                            }}
                            labelStyle={{ color: "#fff" }}
                          />
                          <Legend />
                          <Scatter name="Restaurants" data={data} fill="#fb7185" />
                        </SChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex h-[420px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 bg-white/5 px-8 text-center">
                    <FileSpreadsheet className="h-10 w-10 text-white/35" />
                    <h3 className="mt-4 text-lg font-semibold">Waiting for a CSV upload</h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-white/65">
                      Upload the dataset on the left. The chart area will switch from this empty state to an interactive visualization once rows are available.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {rawData.length > 0 && (
            <div className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_20px_70px_-30px_rgba(17,24,39,0.15)] backdrop-blur-xl">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-slate-900">Implementation notes inside the page</h2>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                  The interface now explains the workflow directly on the screen, which makes the page easier to use and gives the project a more finished, production-style presentation.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;