import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { submitTrip } from "@/api/trips";
import { Calendar, Car, Check, Clock, DollarSign, Loader2, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";

const amenityOptions = [
  "AC",
  "Music",
  "Pet Friendly",
  "No Smoking",
  "Quiet Ride",
  "Luggage Space",
];

const OfferRide = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    price: "",
    seats: "4",
    car: "",
    amenities: [] as string[],
  });

  useEffect(() => {
    /*     if (!loading && !user) {
          toast.error("Please log in to offer a ride");
          navigate("/login");
        } */
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => {
      const current = prev.amenities || [];
      return {
        ...prev,
        amenities: current.includes(amenity)
          ? current.filter((a) => a !== amenity)
          : [...current, amenity],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Replace with actual API call to create ride
    const result = await submitTrip({
      startLocation: formData.from,
      destination: formData.to,
      date: formData.date as any, // Simple cast for now
      time: formData.time,
      price: parseFloat(formData.price),
      seats: parseInt(formData.seats),
      car: formData.car,
      amenities: formData.amenities,
      role: 'driver'
    });

    if (result.success) {
      toast.success("Ride created successfully!");
      navigate("/search"); // Redirect to search or dashboard
    } else {
      toast.error("Failed to create ride. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-12 md:py-20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] pointer-events-none" />

      <div className="container max-w-2xl relative z-10">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 shadow-lg shadow-primary/5">
            <Car className="h-8 w-8" />
          </div>
          <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent md:text-5xl drop-shadow-sm">
            Offer a Ride
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Turn your empty seats into savings. Share your journey and connect with great people.
          </p>
        </div>

        <div className="relative group">
          {/* Card Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-emerald-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

          <Card className="relative border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-1 pb-6 border-b border-border/50">
              <CardTitle className="font-display text-2xl">Trip Details</CardTitle>
              <CardDescription className="text-base">
                Fill in your route and schedule to publish your ride.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Route */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2.5">
                    <Label htmlFor="from" className="text-sm font-medium">From</Label>
                    <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary z-10" />
                      <AddressAutocomplete
                        value={formData.from}
                        onChange={(val) => setFormData(prev => ({ ...prev, from: val }))}
                        placeholder="Departure city"
                        className="pl-10 bg-background/50 border-input/50 focus:border-primary/50 focus:ring-primary/20 h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="to" className="text-sm font-medium">To</Label>
                    <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500 z-10" />
                      <AddressAutocomplete
                        value={formData.to}
                        onChange={(val) => setFormData(prev => ({ ...prev, to: val }))}
                        placeholder="Destination city"
                        className="pl-10 bg-background/50 border-input/50 focus:border-primary/50 focus:ring-primary/20 h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2.5">
                    <Label htmlFor="date">Date</Label>
                    <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="pl-10 bg-background/50 border-input/50 focus:border-primary/50 focus:ring-primary/20 h-11"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="time">Departure Time</Label>
                    <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="pl-10 bg-background/50 border-input/50 focus:border-primary/50 focus:ring-primary/20 h-11"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Price & Seats */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2.5">
                    <Label htmlFor="price">Price per Seat ($)</Label>
                    <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        min="1"
                        placeholder="25"
                        value={formData.price}
                        onChange={handleChange}
                        className="pl-10 bg-background/50 border-input/50 focus:border-primary/50 focus:ring-primary/20 h-11"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="seats">Available Seats</Label>
                    <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                      <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="seats"
                        name="seats"
                        type="number"
                        min="1"
                        max="7"
                        value={formData.seats}
                        onChange={handleChange}
                        className="pl-10 bg-background/50 border-input/50 focus:border-primary/50 focus:ring-primary/20 h-11"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Car */}
                <div className="space-y-2.5">
                  <Label htmlFor="car">Car Model</Label>
                  <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                    <Car className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
                    <Input
                      id="car"
                      name="car"
                      placeholder="e.g., Toyota Camry 2022"
                      value={formData.car}
                      onChange={handleChange}
                      className="pl-10 bg-background/50 border-input/50 focus:border-primary/50 focus:ring-primary/20 h-11"
                      required
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Amenities</Label>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {amenityOptions.map((amenity) => {
                      const isSelected = (formData.amenities || []).includes(amenity);
                      return (
                        <div
                          key={amenity}
                          className={`flex items-center space-x-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none ${isSelected
                            ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                            : "border-border/50 bg-background/30 hover:bg-primary/5"
                            }`}
                          onClick={() => handleAmenityToggle(amenity)}
                        >
                          <div
                            className={`h-4 w-4 shrink-0 rounded-sm border flex items-center justify-center transition-colors ${isSelected
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-primary/50"
                              }`}
                          >
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                          <span className="text-sm font-medium flex-1">
                            {amenity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg h-12 bg-gradient-to-r from-primary to-emerald-600 hover:to-emerald-500 shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Publishing Ride...
                    </>
                  ) : (
                    "Publish Ride"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OfferRide;
