import { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Navigation, Clock, User, Sparkles, Check, X, MessageCircle } from "lucide-react";
import { getBookingDetails, updateBookingStatus } from "@/api/trips";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RideRequestCardProps {
    bookingId: number;
    initialData?: any;
    onStatusUpdate?: () => void;
}

const mapContainerStyle = {
    width: "100%",
    height: "250px",
    borderRadius: "12px",
};

const RideRequestCard = ({ bookingId, initialData, onStatusUpdate }: RideRequestCardProps) => {
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<any>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [modifiedDirections, setModifiedDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadDetails();
    }, [bookingId]);

    const loadDetails = async () => {
        setLoading(true);
        const data = await getBookingDetails(bookingId);
        if (data) {
            setDetails(data);
            // Load map directions after getting details
            if (data.booking.pickupAddress && data.booking.dropoffAddress) {
                loadDirections(data.booking);
            }
        }
        setLoading(false);
    };

    const loadDirections = useCallback(async (booking: any) => {
        if (!window.google?.maps) return;

        const directionsService = new google.maps.DirectionsService();

        // Original route (driver's trip)
        try {
            const originalResult = await directionsService.route({
                origin: booking.trip.origin,
                destination: booking.trip.destination,
                travelMode: google.maps.TravelMode.DRIVING,
            });
            setDirections(originalResult);
        } catch (error) {
            console.error("Error fetching original directions:", error);
        }

        // Modified route with pickup/dropoff
        if (booking.pickupAddress && booking.dropoffAddress) {
            try {
                const modifiedResult = await directionsService.route({
                    origin: booking.trip.origin,
                    destination: booking.trip.destination,
                    waypoints: [
                        { location: booking.pickupAddress, stopover: true },
                        { location: booking.dropoffAddress, stopover: true },
                    ],
                    optimizeWaypoints: false,
                    travelMode: google.maps.TravelMode.DRIVING,
                });
                setModifiedDirections(modifiedResult);
            } catch (error) {
                console.error("Error fetching modified directions:", error);
            }
        }
    }, []);

    const handleApprove = async () => {
        setUpdating(true);
        const result = await updateBookingStatus(bookingId, 'APPROVED');
        if (result.success) {
            toast.success("Ride request approved!");
            onStatusUpdate?.();
            loadDetails();
        } else {
            toast.error(result.error || "Failed to approve");
        }
        setUpdating(false);
    };

    const handleReject = async () => {
        setUpdating(true);
        const result = await updateBookingStatus(bookingId, 'REJECTED');
        if (result.success) {
            toast.success("Ride request declined");
            onStatusUpdate?.();
            loadDetails();
        } else {
            toast.error(result.error || "Failed to decline");
        }
        setUpdating(false);
    };

    if (loading) {
        return (
            <Card className="animate-pulse">
                <CardHeader className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] bg-muted rounded-xl" />
                </CardContent>
            </Card>
        );
    }

    if (!details) {
        return (
            <Card className="border-destructive/50">
                <CardContent className="p-6 text-center text-muted-foreground">
                    Failed to load booking details
                </CardContent>
            </Card>
        );
    }

    const { booking, detourInfo, compatibilitySummary } = details;
    const passenger = booking.passenger;
    const trip = booking.trip;
    const isPending = booking.status === "PENDING";

    // Calculate map center
    const getMapCenter = () => {
        if (booking.pickupLat && booking.pickupLng) {
            return { lat: booking.pickupLat, lng: booking.pickupLng };
        }
        return { lat: 37.7749, lng: -122.4194 }; // Default SF
    };

    return (
        <Card className={cn(
            "relative overflow-hidden border-border/50 transition-all duration-300",
            isPending && "ring-2 ring-primary/20"
        )}>
            {/* Status Badge */}
            <Badge
                variant={booking.status === "APPROVED" ? "default" : booking.status === "REJECTED" ? "destructive" : "secondary"}
                className="absolute top-4 right-4 z-10"
            >
                {booking.status}
            </Badge>

            <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {passenger.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-lg">{passenger.name || "Rider"}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">Requested a pickup</span>
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Route Info */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                        <MapPin className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground">Pickup</p>
                            <p className="text-sm font-medium line-clamp-2">{booking.pickupAddress || "Not specified"}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                        <Navigation className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground">Dropoff</p>
                            <p className="text-sm font-medium line-clamp-2">{booking.dropoffAddress || "Not specified"}</p>
                        </div>
                    </div>
                </div>

                {/* Map */}
                {booking.pickupAddress && (
                    <div className="rounded-xl overflow-hidden border border-border/50">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            zoom={10}
                            center={getMapCenter()}
                            options={{
                                disableDefaultUI: true,
                                zoomControl: true,
                                styles: [
                                    { elementType: "geometry", stylers: [{ color: "#1d1d1d" }] },
                                    { elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
                                    { featureType: "road", elementType: "geometry", stylers: [{ color: "#2d2d2d" }] },
                                ],
                            }}
                        >
                            {/* Original Route (faded) */}
                            {directions && (
                                <DirectionsRenderer
                                    directions={directions}
                                    options={{
                                        polylineOptions: { strokeColor: "#6b7280", strokeWeight: 3, strokeOpacity: 0.4 },
                                        suppressMarkers: true,
                                    }}
                                />
                            )}
                            {/* Modified Route (highlighted) */}
                            {modifiedDirections && (
                                <DirectionsRenderer
                                    directions={modifiedDirections}
                                    options={{
                                        polylineOptions: { strokeColor: "#10b981", strokeWeight: 4, strokeOpacity: 0.9 },
                                        suppressMarkers: false,
                                    }}
                                />
                            )}
                        </GoogleMap>
                    </div>
                )}

                {/* Detour Info */}
                {detourInfo && !detourInfo.error && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span className="text-sm font-medium">Detour Time</span>
                        </div>
                        <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30">
                            +{detourInfo.extraDuration} min ({detourInfo.detourPercentage}% extra)
                        </Badge>
                    </div>
                )}

                {/* AI Compatibility Summary */}
                {compatibilitySummary && (
                    <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            <span className="text-sm font-semibold text-purple-400">Match Insights</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{compatibilitySummary}</p>
                    </div>
                )}

                {/* First Message Preview */}
                {booking.messages?.[0] && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                        <MessageCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <p className="text-sm text-muted-foreground italic">"{booking.messages[0].content}"</p>
                    </div>
                )}

                {/* Action Buttons */}
                {isPending && (
                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
                            onClick={handleReject}
                            disabled={updating}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Decline
                        </Button>
                        <Button
                            className="flex-1 bg-gradient-to-r from-primary to-emerald-600"
                            onClick={handleApprove}
                            disabled={updating}
                        >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RideRequestCard;
