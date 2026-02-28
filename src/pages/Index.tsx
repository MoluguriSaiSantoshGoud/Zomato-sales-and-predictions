import { Link } from "react-router-dom";
import { BarChart3, Brain, LineChart } from "lucide-react";
import heroImg from "@/assets/hero-food.jpg";
import Layout from "@/components/Layout";

const features = [
  {
    icon: BarChart3,
    title: "Data Analytics",
    desc: "Explore restaurant trends across cities, cuisines, and price ranges with interactive visualizations.",
    link: "/analytics",
  },
  {
    icon: Brain,
    title: "Rating Prediction",
    desc: "Predict restaurant ratings and performance categories using trained ML models.",
    link: "/prediction",
  },
  {
    icon: LineChart,
    title: "Actionable Insights",
    desc: "Understand what drives restaurant success — delivery options, pricing, and location.",
    link: "/analytics",
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Restaurant food spread" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
        </div>
        <div className="container relative z-10 py-24 md:py-36">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm mb-6">
              Machine Learning Project
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-card mb-6">
              Zomato Restaurant Analytics & Rating Prediction
            </h1>
            <p className="text-lg text-card/80 mb-8 max-w-xl">
              Analyze Zomato restaurant data and predict ratings using Machine Learning — explore trends, patterns, and actionable insights.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/analytics"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105 shadow-elevated"
              >
                <BarChart3 className="h-5 w-5" /> View Analytics
              </Link>
              <Link
                to="/prediction"
                className="inline-flex items-center gap-2 rounded-lg bg-card px-6 py-3 font-semibold text-foreground transition-transform hover:scale-105 shadow-elevated"
              >
                <Brain className="h-5 w-5" /> Try Prediction
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <h2 className="font-display text-3xl font-bold text-center mb-12">What This System Does</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.link}
              className="group rounded-xl border border-border bg-card p-8 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
