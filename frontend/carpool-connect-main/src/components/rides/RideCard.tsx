import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Calendar, Clock, Star, Users } from "lucide-react";
import type { Ride } from "@/lib/mockData";

interface RideCardProps {
  ride: Ride;
}

const RideCard = ({ ride }: RideCardProps) => {
  const formattedDate = new Date(ride.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="group relative overflow-hidden glass-card hover:-translate-y-1 hover:shadow-xl border-border/60">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Route Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 text-lg font-semibold text-foreground">
              <span>{ride.from}</span>
              <ArrowRight className="h-4 w-4 text-primary" />
              <span>{ride.to}</span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{ride.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>{ride.availableSeats} seats left</span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {ride.amenities.slice(0, 3).map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          {/* Driver & Price */}
          <div className="flex items-center gap-4 sm:flex-col sm:items-end">
            <div className="flex items-center gap-2">
              <Link to={ride.driver.id ? `/profile/${ride.driver.id}` : '#'} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={ride.driver.avatar} alt={ride.driver.name} />
                  <AvatarFallback>{ride.driver.name[0]}</AvatarFallback>
                </Avatar>
                <div className="sm:text-right">
                  <p className="text-sm font-medium text-foreground">{ride.driver.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    <span>{ride.driver.rating}</span>
                    <span>· {ride.driver.trips} trips</span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">${ride.price}</p>
                <p className="text-xs text-muted-foreground">per seat</p>
              </div>
              <Link to={`/ride/${ride.id}`}>
                <Button variant="default" size="sm">
                  View
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideCard;
