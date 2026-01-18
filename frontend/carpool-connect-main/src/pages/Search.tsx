import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchForm from "@/components/rides/SearchForm";
import RideCard from "@/components/rides/RideCard";
import { getTrips } from "@/api/trips";
import { type Ride } from "@/lib/mockData"; // Keep type for now or redefine
import { Loader2, SearchX } from "lucide-react";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

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
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="border-b border-border bg-card py-8">
        <div className="container">
          <h1 className="mb-6 font-display text-2xl font-bold text-foreground md:text-3xl">
            Find Your Ride
          </h1>
          <SearchForm
            initialFrom={from}
            initialTo={to}
            initialDate={date}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* Results */}
      <div className="container py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Searching for rides...</p>
          </div>
        ) : rides.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {rides.length} ride{rides.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid gap-4">
              {rides.map((ride, index) => (
                <div
                  key={ride.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <RideCard ride={ride} />
                </div>
              ))}
            </div>
          </div>
        ) : hasSearched ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <SearchX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
              No rides found
            </h2>
            <p className="mt-2 text-center text-muted-foreground">
              Try adjusting your search criteria or check back later.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Search;
