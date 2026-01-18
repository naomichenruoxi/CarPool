import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Search } from "lucide-react";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";

interface SearchFormProps {
  variant?: "hero" | "inline";
  initialFrom?: string;
  initialTo?: string;
  initialDate?: string;
  onSearch?: (from: string, to: string, date: string, fromLat?: number, fromLng?: number, toLat?: number, toLng?: number) => void;
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

  const [fromCoords, setFromCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [toCoords, setToCoords] = useState<{ lat: number, lng: number } | null>(null);

  // Address validation states (optional for search, but provides visual feedback)
  const [fromValidated, setFromValidated] = useState(false);
  const [toValidated, setToValidated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSearch) {
      onSearch(
        from,
        to,
        date,
        fromCoords?.lat,
        fromCoords?.lng,
        toCoords?.lat,
        toCoords?.lng
      );
    } else {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      if (date) params.set("date", date);
      // Assuming URL navigation doesn't support hidden coords easily without state,
      // but typically Search is used with onSearch handler in this app.
      navigate(`/search?${params.toString()}`);
    }
  };

  const isHero = variant === "hero";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`grid gap-5 ${isHero
          ? "grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto]"
          : "grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto]"
          }`}
      >

        <div className="space-y-1.5 group">
          <Label htmlFor="from" className={isHero ? "text-xs uppercase tracking-wider font-semibold text-white/80 ml-1" : ""}>
            From
          </Label>
          <div className="relative transition-transform duration-200 group-hover:-translate-y-0.5 group-focus-within:-translate-y-0.5">
            <MapPin className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors z-10 ${isHero ? "text-emerald-400" : "text-primary/70 group-focus-within:text-primary"}`} />
            <AddressAutocomplete
              value={from}
              onChange={(val, lat, lng) => {
                setFrom(val);
                if (lat && lng) setFromCoords({ lat, lng });
              }}
              onValidationChange={setFromValidated}
              isValid={fromValidated}
              placeholder="Departure city"
              className={`pl-10 h-12 transition-all duration-300 ${isHero
                ? "bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm shadow-sm focus:bg-white/20 focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50"
                : ""
                }`}
            />
          </div>
        </div>

        <div className="space-y-1.5 group">
          <Label htmlFor="to" className={isHero ? "text-xs uppercase tracking-wider font-semibold text-white/80 ml-1" : ""}>
            To
          </Label>
          <div className="relative transition-transform duration-200 group-hover:-translate-y-0.5 group-focus-within:-translate-y-0.5">
            <MapPin className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors z-10 ${isHero ? "text-emerald-400" : "text-primary/70 group-focus-within:text-primary"}`} />
            <AddressAutocomplete
              value={to}
              onChange={(val, lat, lng) => {
                setTo(val);
                if (lat && lng) setToCoords({ lat, lng });
              }}
              onValidationChange={setToValidated}
              isValid={toValidated}
              placeholder="Destination city"
              className={`pl-10 h-12 transition-all duration-300 ${isHero
                ? "bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm shadow-sm focus:bg-white/20 focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50"
                : ""
                }`}
            />
          </div>
        </div>

        <div className="space-y-1.5 group">
          <Label htmlFor="date" className={isHero ? "text-xs uppercase tracking-wider font-semibold text-white/80 ml-1" : ""}>
            Date
          </Label>
          <div className="relative transition-transform duration-200 group-hover:-translate-y-0.5 group-focus-within:-translate-y-0.5">
            <Calendar className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${isHero ? "text-emerald-400" : "text-primary/70 group-focus-within:text-primary"}`} />
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`pl-10 h-12 transition-all duration-300 ${isHero
                ? "bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm shadow-sm focus:bg-white/20 focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50"
                : ""
                }`}
            />
          </div>
        </div>

        <div className="flex items-end pb-[1px]">
          <Button
            type="submit"
            size="lg"
            className={`w-full h-12 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${isHero
              ? "bg-gradient-to-r from-primary to-emerald-600 hover:to-emerald-500 text-white border-0"
              : ""
              }`}
          >
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
