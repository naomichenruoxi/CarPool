import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Search, MapPin, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/ui/Reveal";

const Dashboard = () => {
    const { user } = useUser();

    // Mock Active Trips for visuals
    const activeTrips = [
        {
            id: 1,
            from: "UBC Campus",
            to: "Downtown Vancouver",
            date: "Today, 5:30 PM",
            role: "Passenger",
            status: "Confirmed"
        }
    ];

    return (
        <div className="min-h-screen bg-background relative overflow-hidden py-12 px-4">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] pointer-events-none" />

            <div className="container max-w-5xl mx-auto relative z-10">

                {/* Welcome Header */}
                <Reveal>
                    <div className="mb-10">
                        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                            Welcome back, <span className="text-primary">{user?.email?.split('@')[0] || "Traveler"}</span>! 👋
                        </h1>
                        <p className="mt-2 text-muted-foreground text-lg">
                            Ready to hit the road? Here's what's happening.
                        </p>
                    </div>
                </Reveal>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <Reveal delay={100} width="100%">
                        <Link to="/search" className="block group h-full">
                            <div className="relative h-full overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-primary/40">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Search className="w-32 h-32 text-primary" />
                                </div>
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="p-3 bg-primary/20 rounded-2xl w-fit mb-4 text-primary">
                                            <Search className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-2xl font-bold font-display mb-2">Find a Ride</h2>
                                        <p className="text-muted-foreground">Browse available trips and book your seat.</p>
                                    </div>
                                    <div className="mt-6 flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                                        Search Now <ArrowRight className="ml-2 w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </Reveal>

                    <Reveal delay={200} width="100%">
                        <Link to="/offer" className="block group h-full">
                            <div className="relative h-full overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-emerald-500/40">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Car className="w-32 h-32 text-emerald-500" />
                                </div>
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="p-3 bg-emerald-500/20 rounded-2xl w-fit mb-4 text-emerald-500">
                                            <Car className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-2xl font-bold font-display mb-2">Offer a Ride</h2>
                                        <p className="text-muted-foreground">Share your journey and earn money.</p>
                                    </div>
                                    <div className="mt-6 flex items-center text-emerald-500 font-medium group-hover:translate-x-1 transition-transform">
                                        Publish Trip <ArrowRight className="ml-2 w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </Reveal>
                </div>

                {/* Active Trips */}
                <Reveal delay={300} width="100%">
                    <div className="mb-12">
                        <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" /> Your Upcoming Trips
                        </h2>
                        <Card className="border-border/50 bg-card/40 backdrop-blur-md">
                            <CardContent className="p-0">
                                {activeTrips.length > 0 ? (
                                    <div className="divide-y divide-border/50">
                                        {activeTrips.map((trip) => (
                                            <div key={trip.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-lg font-semibold">
                                                        <span>{trip.from}</span>
                                                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                                        <span>{trip.to}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {trip.date}</span>
                                                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{trip.role}</span>
                                                    </div>
                                                </div>
                                                <Button variant="outline" className="shrink-0">View Details</Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground">
                                        No active trips. <Link to="/search" className="text-primary hover:underline">Book one now</Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </Reveal>

                {/* Recommended (Vibe Check Placeholder or Similar) */}
                <Reveal delay={400} width="100%">
                    <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-bold font-display mb-2 flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-yellow-300" /> New: AI Vibe Match
                                </h2>
                                <p className="text-white/80 max-w-lg">
                                    We've analyzed your profile! Check out drivers who match your music taste and talkativeness levels.
                                </p>
                            </div>
                            <Link to="/matches">
                                <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90 border-0 shadow-lg font-semibold">
                                    View Matches
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Reveal>

            </div>
        </div>
    );
};

export default Dashboard;
