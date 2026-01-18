import { Car } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-hero-gradient">
                <Car className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">CarPool</span>
            </Link>
            <p className="mt-4 max-w-md text-muted-foreground">
              Share rides, save money, and reduce your carbon footprint. Join thousands of commuters making travel smarter and greener.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>
                <Link to="/search" className="transition-colors hover:text-primary">
                  Find a Ride
                </Link>
              </li>
              <li>
                <Link to="/offer" className="transition-colors hover:text-primary">
                  Offer a Ride
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground">Support</h4>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Safety
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CarPool. Built for Hackathon.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
