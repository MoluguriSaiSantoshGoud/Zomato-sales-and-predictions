import { UtensilsCrossed } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card mt-auto">
    <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 font-display font-semibold text-foreground">
        <UtensilsCrossed className="h-5 w-5 text-primary" />
        Zomato Restaurant Analytics
      </div>
    </div>
  </footer>
);

export default Footer;
