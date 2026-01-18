import { Link, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Car, Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const Header = () => {
  const { user, signOut } = useUser();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = [
    { href: "/search", label: "Find a Ride" },
    { href: "/offer", label: "Offer a Ride" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60 shadow-sm transition-all duration-300">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105 duration-300 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-emerald-400 shadow-md group-hover:shadow-lg transition-all">
            <Car className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">CarPool</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <Button
                variant={isActive(link.href) ? "secondary" : "ghost"}
                className={`text-base font-medium transition-all duration-200 ${isActive(link.href)
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-muted-foreground hover:text-primary hover:bg-transparent"
                  }`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="mr-2 rounded-full hover:bg-secondary/80 transition-colors"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile/me">
                <Button variant="ghost" className="font-medium text-foreground hover:bg-secondary/50">
                  Hi, {user.email?.split('@')[0]}
                </Button>
              </Link>
              <Button variant="ghost" onClick={signOut} className="text-muted-foreground hover:text-destructive">Log out</Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="font-medium text-muted-foreground hover:text-primary">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-primary to-emerald-600 hover:to-emerald-500 hover:scale-105 shadow-md border-0 text-white font-semibold transition-all duration-300">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="animate-in slide-in-from-top-5 fade-in duration-200 border-t border-border bg-background/95 backdrop-blur-md p-4 md:hidden shadow-xl">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActive(link.href) ? "secondary" : "ghost"}
                  className="w-full justify-start text-lg h-12"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <hr className="my-2 border-border/50" />
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 h-12 text-lg"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-orange-500" /> : <Moon className="h-5 w-5 text-blue-400" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
            <div className="flex flex-col gap-2 mt-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full h-12 text-lg">
                  Log in
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full h-12 text-lg bg-gradient-to-r from-primary to-emerald-600 border-0 text-white">
                  Sign up
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
