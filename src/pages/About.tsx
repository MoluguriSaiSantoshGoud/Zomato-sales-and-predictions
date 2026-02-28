import Layout from "@/components/Layout";
import { Code2, Database, Brain, BarChart3, Layout as LayoutIcon, Server } from "lucide-react";

const techs = [
  { icon: Code2, name: "Python", desc: "Core programming language" },
  { icon: Server, name: "Flask", desc: "Backend API framework" },
  { icon: Brain, name: "Scikit-learn", desc: "ML model training & prediction" },
  { icon: Database, name: "Pandas", desc: "Data manipulation & analysis" },
  { icon: LayoutIcon, name: "HTML/CSS/Bootstrap", desc: "Frontend interface" },
  { icon: BarChart3, name: "Chart.js / Recharts", desc: "Data visualization" },
];

const About = () => (
  <Layout>
    <div className="container py-12 max-w-3xl">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">About This Project</h1>

      <div className="rounded-xl border border-border bg-card p-8 shadow-card mb-8">
        <h2 className="font-display text-xl font-semibold mb-3">Project Objective</h2>
        <p className="text-muted-foreground leading-relaxed">
          This project analyzes Zomato restaurant data to uncover patterns and trends in the food
          industry. Using Machine Learning algorithms, it predicts restaurant ratings and classifies
          restaurants into performance categories (High, Medium, Low) based on features like cost,
          location, online delivery availability, and table booking options.
        </p>
      </div>

      <h2 className="font-display text-xl font-semibold mb-4">Technologies Used</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {techs.map((t) => (
          <div key={t.name} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary shrink-0">
              <t.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{t.name}</h3>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Layout>
);

export default About;
