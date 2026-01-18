import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { getDriverBookingRequests } from "@/api/trips";
import RideRequestCard from "@/components/rides/RideRequestCard";
import { Button } from "@/components/ui/button";
import { Loader2, Inbox, ArrowLeft, Bell } from "lucide-react";

const DriverRequests = () => {
    const navigate = useNavigate();
    const { user, loading: userLoading } = useUser();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userLoading && user) {
            loadRequests();
        }
    }, [user, userLoading]);

    const loadRequests = async () => {
        setLoading(true);
        const data = await getDriverBookingRequests();
        setBookings(data);
        setLoading(false);
    };

    const pendingCount = bookings.filter(b => b.status === "PENDING").length;

    if (userLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden py-12 md:py-20">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container max-w-3xl relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="shrink-0"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                <Bell className="h-6 w-6 text-primary" />
                                Ride Requests
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                {pendingCount > 0
                                    ? `${pendingCount} pending request${pendingCount > 1 ? 's' : ''}`
                                    : 'No pending requests'
                                }
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={loadRequests} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
                    </Button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                            <Inbox className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No Requests Yet</h2>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            When passengers request to join your rides, they'll appear here.
                        </p>
                        <Button className="mt-6" onClick={() => navigate("/offer")}>
                            Offer a Ride
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <RideRequestCard
                                key={booking.id}
                                bookingId={booking.id}
                                initialData={booking}
                                onStatusUpdate={loadRequests}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriverRequests;
