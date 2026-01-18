import { Car, Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Footer = () => {
  return (
    <footer className="relative border-t border-border/40 bg-background/50 backdrop-blur-xl pt-16 pb-8 overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 shadow-lg shadow-primary/20 transition-all group-hover:scale-110 group-hover:rotate-3">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="font-display text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:from-primary group-hover:to-emerald-500 transition-all duration-300">
                Pathr
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              Reimagining daily commute.
              Join the green revolution and connect with verified professionals in your city.
            </p>
            <div className="flex gap-4 pt-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-secondary hover:bg-gradient-to-br hover:from-primary hover:to-emerald-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-lg hover:shadow-primary/30"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-display font-semibold text-foreground text-lg mb-6">Discover</h4>
            <ul className="space-y-3 text-muted-foreground">
              {['Find a Ride', 'Offer a Ride', 'How it Works', 'Safety Trust'].map((item) => (
                <li key={item}>
                  <Link to="/search" className="hover:text-primary transition-all duration-300 flex items-center gap-2 hover:translate-x-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-display font-semibold text-foreground text-lg mb-6">Company</h4>
            <ul className="space-y-3 text-muted-foreground">
              {['About Us', 'Careers', 'Press', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary transition-all duration-300 flex items-center gap-2 hover:translate-x-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold text-foreground text-lg mb-6">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get travel tips and exclusive offers directly to your inbox.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Email address"
                className="bg-secondary/30 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all text-sm"
              />
              <Button size="icon" className="bg-gradient-to-r from-primary to-emerald-600 hover:to-emerald-500 text-white shrink-0 shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="flex items-center gap-1">
            &copy; {new Date().getFullYear()} Pathr Inc. Made with <span className="text-red-500 animate-pulse">❤</span> at UBC Vancouver.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
