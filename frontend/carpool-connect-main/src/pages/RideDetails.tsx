import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getRideById, createBookingRequest } from "@/api/trips";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Car,
  Clock,
  Loader2,
  MapPin,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Define locally if not exporting from elsewhere, or match API
interface Ride {
  id: string;
  driver: {
    name: string;
    avatar: string;
    rating: number;
    trips: number;
  };
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  seats: number;
  availableSeats: number;
  car: string;
  amenities: string[];
}

const RideDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [ride, setRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchRide = async () => {
      if (!id) return;

      const result = await getRideById(id);

      if (result) {
        // Map Backend -> Frontend
        const dateObj = new Date(result.departureTime);
        const mapped: Ride = {
          id: String(result.id),
          driver: {
            name: result.driver?.name || "Driver",
            avatar: result.driver?.avatar || "",
            rating: 5.0, // Mock
            trips: 10 // Mock
          },
          from: result.origin,
          to: result.destination,
          date: dateObj.toISOString(),
          time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: result.pricePerSeat,
          seats: 4, // Default if missing
          availableSeats: result.availableSeats,
          car: "Sedan", // Default
          amenities: ["AC", "Music"] // Default
        };
        setRide(mapped);
      } else {
        setRide(null);
      }
      setIsLoading(false);
    };

    fetchRide();
  }, [id]);

  const handleRequest = async () => {
    if (!ride) return;

    setIsRequesting(true);

    const result = await createBookingRequest(Number(ride.id), requestMessage);

    if (result.success) {
      toast.success("Request sent! The driver has been notified.");
      setIsDialogOpen(false);
    } else {
      toast.error(result.error);
    }

    setIsRequesting(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">Ride not found</h1>
        <p className="mt-2 text-muted-foreground">
          This ride may no longer be available.
        </p>
        <Link to="/search" className="mt-4 inline-block">
          <Button>Back to Search</Button>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(ride.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-4">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Route Card */}
            <Card className="card-shadow animate-fade-in">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-2xl font-bold text-foreground">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{ride.from}</span>
                      <ArrowRight className="h-5 w-5 text-primary" />
                      <span>{ride.to}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{ride.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver Card */}
            <Card className="card-shadow animate-fade-in [animation-delay:100ms]">
              <CardHeader>
                <CardTitle className="font-display">Driver</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarImage src={ride.driver.avatar} alt={ride.driver.name} />
                    <AvatarFallback className="text-lg">{ride.driver.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{ride.driver.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span>{ride.driver.rating.toFixed(1)} rating</span>
                      <span>·</span>
                      <span>{ride.driver.trips} trips</span>
                    </div>
                  </div>
                  <Button variant="outline" className="ml-auto" size="sm">
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trip Details */}
            <Card className="card-shadow animate-fade-in [animation-delay:200ms]">
              <CardHeader>
                <CardTitle className="font-display">Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  <span className="text-foreground">{ride.car}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-foreground">
                    {ride.availableSeats} of {ride.seats} seats available
                  </span>
                </div>
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {ride.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="card-shadow sticky top-24 animate-fade-in [animation-delay:300ms]">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">${ride.price}</p>
                  <p className="text-sm text-muted-foreground">per seat</p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">1 seat</span>
                      <span className="font-medium text-foreground">${ride.price}</span>
                    </div>
                  </div>

                  {/* Request Modal */}
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="lg">
                        Request to Join
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request to Join Ride</DialogTitle>
                        <DialogDescription>
                          Send a message to <strong>{ride.driver.name}</strong> to introduce yourself and coordinate pickup.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Textarea
                          placeholder="Hi! I'd make a great passenger because..."
                          value={requestMessage}
                          onChange={(e) => setRequestMessage(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                      <DialogFooter>
                        <Button onClick={handleRequest} disabled={isRequesting}>
                          {isRequesting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send Request"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <p className="text-center text-xs text-muted-foreground">
                    You'll be notified when the driver approves your request.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDetails;
