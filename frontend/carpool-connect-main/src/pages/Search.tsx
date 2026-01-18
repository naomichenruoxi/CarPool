import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import SearchForm from "@/components/rides/SearchForm";
import RideCard from "@/components/rides/RideCard";
import { getTrips } from "@/api/trips";
import { type Ride } from "@/lib/mockData";
import { Loader2, SearchX, Car } from "lucide-react";

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/login");
    }
  }, [user, userLoading, navigate]);

  if (userLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";

  const handleSearch = async (searchFrom: string, searchTo: string, searchDate: string) => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const results = await getTrips({ from: searchFrom, to: searchTo, date: searchDate });

      // Adapt API data to Ride interface
      const adaptedRides: Ride[] = results.map((t: any) => ({
        id: t.id.toString(),
        from: t.origin,
        to: t.destination,
        date: new Date(t.departureTime).toISOString().split('T')[0],
        time: new Date(t.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: t.pricePerSeat,
        availableSeats: t.availableSeats,
        seats: t.availableSeats, // Keep both for now to satisfy component and data expectations
        driver: {
          id: t.driver?.id, // Pass ID for linking
          name: t.driver?.name || "Driver",
          rating: 5.0,
          trips: 0,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.driver?.name || 'driver'}`
        },
        amenities: [],
        car: "Standard Car"
      }));

      setRides(adaptedRides);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleSearch(from, to, date);
  }, [from, to, date]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Blobs for specific page depth */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Styled Search Header */}
      <div className="relative border-b border-border/40 pb-12 pt-16 overflow-hidden">
        {/* Header Background */}
        <div className="absolute inset-0 bg-hero-gradient opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px] pointer-events-none" />

        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center mb-8">
            <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent md:text-5xl drop-shadow-sm">
              Find Your <span className="text-primary-foreground">Perfect Ride</span>
            </h1>
            <p className="mt-4 text-primary-foreground/80 text-lg">
              Search available rides and travel sustainably.
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl p-1 bg-white/10 backdrop-blur-md shadow-2xl ring-1 ring-white/20">
              <div className="bg-card/90 dark:bg-black/40 rounded-xl p-6 backdrop-blur-xl border border-white/5 shadow-inner">
                <SearchForm
                  initialFrom={from}
                  initialTo={to}
                  initialDate={date}
                  onSearch={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container py-12 relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Car className="h-6 w-6 text-primary animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-muted-foreground font-medium animate-pulse">Searching for rides...</p>
          </div>
        ) : rides.length > 0 ? (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Available Rides</h2>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                {rides.length} ride{rides.length !== 1 ? "s" : ""} found
              </span>
            </div>
            <div className="grid gap-6">
              {rides.map((ride, index) => (
                <div
                  key={ride.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <RideCard ride={ride} />
                </div>
              ))}
            </div>
          </div>
        ) : hasSearched ? (
          <div className="flex flex-col items-center justify-center py-20 max-w-md mx-auto text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50 shadow-inner p-6">
              <SearchX className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              No rides found
            </h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              We couldn't find any rides matching your criteria. Try changing your dates or nearby locations.
            </p>
          </div>
        ) : (
          <div className="text-center py-20 opacity-50">
            <p className="text-lg">Enter details above to start searching</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
