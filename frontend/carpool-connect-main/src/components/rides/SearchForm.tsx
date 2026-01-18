import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Search } from "lucide-react";

interface SearchFormProps {
  variant?: "hero" | "inline";
  initialFrom?: string;
  initialTo?: string;
  initialDate?: string;
  onSearch?: (from: string, to: string, date: string) => void;
}

const SearchForm = ({
  variant = "inline",
  initialFrom = "",
  initialTo = "",
  initialDate = "",
  onSearch,
}: SearchFormProps) => {
  const navigate = useNavigate();
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState(initialDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch(from, to, date);
    } else {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      if (date) params.set("date", date);
      navigate(`/search?${params.toString()}`);
    }
  };

  const isHero = variant === "hero";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`grid gap-4 ${
          isHero
            ? "grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto]"
            : "grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto]"
        }`}
      >
        <div className="space-y-2">
          <Label htmlFor="from" className={isHero ? "text-primary-foreground/80" : ""}>
            From
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="from"
              placeholder="Departure city"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={`pl-10 ${isHero ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60" : ""}`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="to" className={isHero ? "text-primary-foreground/80" : ""}>
            To
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="to"
              placeholder="Destination city"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={`pl-10 ${isHero ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60" : ""}`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className={isHero ? "text-primary-foreground/80" : ""}>
            Date
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`pl-10 ${isHero ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground" : ""}`}
            />
          </div>
        </div>

        <div className="flex items-end">
          <Button
            type="submit"
            variant={isHero ? "heroOutline" : "default"}
            size="lg"
            className="w-full"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
