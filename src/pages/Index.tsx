import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const stats = [
    { label: "Restaurants Analyzed", value: "9K+" },
    { label: "Cities Covered", value: "15+" },
    { label: "Data Points", value: "100K+" },
    { label: "Prediction Accuracy", value: "94%" },
  ];

  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_10%,rgba(239,68,68,0.2),transparent_40%),radial-gradient(circle_at_82%_0%,rgba(251,146,60,0.22),transparent_42%),linear-gradient(180deg,#fff9f6_0%,#fffdfb_45%,#ffffff_100%)]" />
        <div className="absolute -left-32 top-16 -z-10 h-72 w-72 rounded-full bg-red-300/20 blur-3xl" />
        <div className="absolute -right-24 top-40 -z-10 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl" />

        <div className="container px-4 pb-16 pt-14 sm:px-6 lg:pb-24 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/90 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Restaurant Intelligence Platform
              </div>

              <h1 className="font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Zomato OrderScope for
                <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent"> smarter restaurant decisions</span>
              </h1>

              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Analyze city-level restaurant behavior, visualize performance patterns, and predict outcomes from one focused, beautifully structured dashboard.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="group bg-red-500 px-7 text-base hover:bg-red-600">
                  <Link to="/analytics">
                    Start Analytics
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-slate-300 bg-white/80 px-7 text-base hover:bg-white">
                  <Link to="/prediction">Try Prediction</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-7">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Live Snapshot</p>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
                    <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                    <p className="mt-1 font-display text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 pb-16 sm:px-6 lg:pb-24">
        <div className="rounded-[2rem] bg-slate-950 px-6 py-9 text-white sm:px-8 lg:px-12 lg:py-12">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">Ready to explore?</p>
              <h2 className="mt-2 font-display text-3xl font-bold">Move from guesswork to data-backed choices</h2>
            </div>
            <Button asChild size="lg" className="bg-white px-7 text-slate-900 hover:bg-slate-100">
              <Link to="/analytics">Open Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
