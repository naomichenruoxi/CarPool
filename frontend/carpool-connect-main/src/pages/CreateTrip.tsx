import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { submitTrip } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const CreateTrip = () => {
  const navigate = useNavigate();
  const { role } = useUser();
  
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeOptions = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startLocation || !destination || !date || !time) {
      return;
    }

    setIsSubmitting(true);

    try {
      const tripData = {
        startLocation,
        destination,
        date,
        time,
        seats: role === "driver" ? parseInt(seats) : undefined,
        role: role as "driver" | "carpooler",
      };

      await submitTrip(tripData);
      navigate("/matches");
    } catch (error) {
      console.error("Failed to submit trip:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = startLocation && destination && date && time;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {role === "driver" ? "Offer a Ride" : "Find a Ride"}
            </h1>
            <p className="text-muted-foreground">
              {role === "driver" 
                ? "Share your journey and help others travel" 
                : "Find the perfect ride for your trip"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl shadow-lg border border-border">
            {/* Start Location */}
            <div className="space-y-2">
              <Label htmlFor="startLocation" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Start Location
              </Label>
              <Input
                id="startLocation"
                type="text"
                placeholder="Enter pickup location"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <Label htmlFor="destination" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                Destination
              </Label>
              <Input
                id="destination"
                type="text"
                placeholder="Enter destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Picker */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Time
              </Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Number of Seats - Only visible for drivers */}
            {role === "driver" && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Available Seats
                </Label>
                <Select value={seats} onValueChange={setSeats}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select seats" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "seat" : "seats"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                "Finding matches..."
              ) : (
                <>
                  Find Matches
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
