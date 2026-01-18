import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, MapPin, Calendar, Clock, Users, Leaf, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { confirmRide } from "@/api/trips";

const Confirm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isConfirming, setIsConfirming] = useState(false);

  // TODO: Get actual trip data from context or route state
  const tripSummary = {
    from: "San Francisco",
    to: "Los Angeles",
    date: "January 20, 2025",
    time: "08:00 AM",
    seats: 1,
    driverName: "Sarah Chen",
    carModel: "Tesla Model 3",
    price: 45,
  };

  const co2Saved = 12.5; // Static CO2 value in kg

  const handleConfirm = async () => {
    setIsConfirming(true);

    try {
      const result = await confirmRide("trip-123");
      
      if (result.success) {
        toast({
          title: "Ride Confirmed!",
          description: "Your carpool ride has been booked successfully.",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to confirm ride:", error);
      toast({
        title: "Error",
        description: "Failed to confirm ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Confirm Your Ride
            </h1>
            <p className="text-muted-foreground">
              Review your trip details before confirming
            </p>
          </div>

          {/* Trip Summary Card */}
          <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden mb-6">
            <div className="p-6 space-y-4">
              <h2 className="font-semibold text-lg text-foreground">Trip Summary</h2>
              
              {/* Route */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-medium text-foreground">{tripSummary.from}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">To</p>
                    <p className="font-medium text-foreground">{tripSummary.to}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{tripSummary.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{tripSummary.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{tripSummary.seats} seat(s)</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">Driver</p>
                <p className="font-medium text-foreground">{tripSummary.driverName}</p>
                <p className="text-sm text-muted-foreground">{tripSummary.carModel}</p>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-primary/5 p-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">Total Price</span>
                </div>
                <span className="text-2xl font-bold text-primary">${tripSummary.price}</span>
              </div>
            </div>
          </div>

          {/* CO2 Saved Card */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 rounded-xl p-6 mb-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-green-700 dark:text-green-300">CO₂ Saved</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {co2Saved} kg
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  By carpooling instead of driving alone
                </p>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <Button
            size="xl"
            className="w-full"
            onClick={handleConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? "Confirming..." : "Confirm Ride"}
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            By confirming, you agree to our terms and cancellation policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
