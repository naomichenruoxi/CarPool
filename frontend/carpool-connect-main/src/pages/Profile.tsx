
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, MessageCircle, Music, Edit, MapPin, Briefcase, Globe, Star } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";

interface UserProfile {
    id: string;
    name: string;
    isDriver: boolean;
    personalityProfile?: {
        bio: string;
        talkativeness: number;
        musicPreference: string;
        smokingAllowed: boolean;
        petsAllowed: boolean;
        hometown?: string;
        workplace?: string;
        languages?: string;
    };
    tripsCount: number;
    rating: number;
}

const Profile = () => {
    const { id } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [compatibility, setCompatibility] = useState<string | null>(null);
    const [loadingCompatibility, setLoadingCompatibility] = useState(false);

    // If no ID is provided or ID is 'me', view current user
    const isOwnProfile = !id || id === 'me' || (user && id === user.id);
    const profileId = isOwnProfile ? 'me' : id;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const endpoint = isOwnProfile ? '/users/me' : `/users/${id}`;
                const res = await api.get(endpoint);
                setProfile(res.data);

                // Calculate counts if missing (e.g. /me might not return _count structure same as public endpoint)
                // For simplicity, we assume API returns normalized data or we handle it.
                // Public endpoint returns flattened counts. /me might need adjustment.
                // Let's rely on what we implemented effectively.
            } catch (error: any) {
                console.error("Failed to load profile", error);
                // Demo Mode Fallback
                setProfile({
                    id: "demo",
                    name: "Alex Johnson",
                    isDriver: true,
                    tripsCount: 142,
                    rating: 4.9,
                    personalityProfile: {
                        bio: "Eco-friendly commuter who loves coffee and 80s synth-pop. Always on time!",
                        talkativeness: 4,
                        musicPreference: "Indie Pop, Synthwave",
                        smokingAllowed: false,
                        petsAllowed: true,
                        hometown: "Vancouver, BC",
                        workplace: "Tech Hub",
                        languages: "English, French"
                    }
                });
                toast.info("Showing Demo Profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id, isOwnProfile, navigate]);

    useEffect(() => {
        // Determine compatibility if viewing someone else
        if (!isOwnProfile && profile && user) {
            const checkCompatibility = async () => {
                setLoadingCompatibility(true);
                try {
                    const res = await api.post('/matches/compatibility', { targetUserId: profile.id });
                    setCompatibility(res.data.summary);
                } catch (error) {
                    console.error("Failed to check compatibility", error);
                } finally {
                    setLoadingCompatibility(false);
                }
            };
            checkCompatibility();
        }
    }, [isOwnProfile, profile, user]);

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    if (!profile) {
        return <div className="flex bg-background h-screen items-center justify-center">User not found</div>;
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden py-12 px-4 transition-colors duration-500">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] pointer-events-none" />

            <div className="container max-w-5xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar / Main Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="relative group">
                            {/* Glow */}
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-primary to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500" />

                            <Card className="relative border-white/10 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/20 to-purple-600/20" />
                                <CardContent className="pt-12 flex flex-col items-center text-center relative">
                                    <div className="relative mb-4">
                                        <div className="absolute -inset-1 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-sm opacity-70" />
                                        <Avatar className="w-32 h-32 border-4 border-background shadow-xl relative">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} />
                                            <AvatarFallback>{profile.name?.[0]}</AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <h1 className="text-3xl font-display font-bold text-foreground mt-2">{profile.name}</h1>
                                    <Badge variant="secondary" className="mt-2 px-3 py-1 text-sm font-medium uppercase tracking-wide bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                                        {profile.isDriver ? "Driver" : "Passenger"}
                                    </Badge>

                                    <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-foreground">{profile.tripsCount || 0}</p>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Trips</p>
                                        </div>
                                        <div className="text-center border-l border-white/5">
                                            <p className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
                                                {profile.rating || "5.0"} <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                            </p>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Rating</p>
                                        </div>
                                    </div>

                                    {isOwnProfile && (
                                        <Button variant="outline" className="mt-8 w-full border-primary/20 hover:bg-primary/5 hover:text-primary transition-all" onClick={() => navigate('/profile-questions')}>
                                            <Edit className="w-4 h-4 mr-2" /> Edit Profile
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Compatibility Card */}
                        {!isOwnProfile && (
                            <Card className="relative overflow-hidden border-none shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md" />
                                <CardHeader className="relative pb-2">
                                    <CardTitle className="flex items-center gap-2 text-primary font-display">
                                        <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" /> Vibe Check
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative">
                                    {loadingCompatibility ? (
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground py-2">
                                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                            <span>Analyzing cosmic compatibility...</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <p className="text-sm font-medium leading-relaxed italic text-foreground/90 bg-background/40 p-3 rounded-lg border border-white/5">
                                                "{compatibility || "It's a perfect match! You both love 80s rock and hate cilantro."}"
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Details Column */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Bio */}
                        <Card className="border-border/50 bg-card/30 backdrop-blur-md shadow-sm">
                            <CardHeader>
                                <CardTitle className="font-display flex items-center gap-2">
                                    <span className="w-1 h-6 bg-primary rounded-full" /> About Me
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-foreground/80 leading-relaxed text-lg font-light">
                                    {profile.personalityProfile?.bio || "Hey there! I'm using CarPool to save the planet and meet cool people."}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-background/40 border border-white/5">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase">From</p>
                                            <p className="text-sm font-semibold">{profile.personalityProfile?.hometown || "Unknown"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-background/40 border border-white/5">
                                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase">Work/Study</p>
                                            <p className="text-sm font-semibold">{profile.personalityProfile?.workplace || "Unknown"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-background/40 border border-white/5 md:col-span-2">
                                        <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase">Languages</p>
                                            <p className="text-sm font-semibold">{profile.personalityProfile?.languages || "English"}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats / Taste */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-border/50 bg-card/30 backdrop-blur-md">
                                <CardHeader className="pb-3 border-b border-white/5">
                                    <CardTitle className="text-base flex items-center gap-2 font-display">
                                        <MessageCircle className="w-4 h-4 text-primary" /> Talkativeness
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="relative w-full h-4 bg-secondary/50 rounded-full overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${(profile.personalityProfile?.talkativeness || 3) / 5 * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground mt-3 font-medium px-1">
                                        <span>Quiet Observer</span>
                                        <span>Storyteller</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 bg-card/30 backdrop-blur-md">
                                <CardHeader className="pb-3 border-b border-white/5">
                                    <CardTitle className="text-base flex items-center gap-2 font-display">
                                        <Music className="w-4 h-4 text-primary" /> Music Taste
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="flex flex-wrap gap-2">
                                        {(profile.personalityProfile?.musicPreference?.split(',') || ["Everything"]).map(genre => (
                                            <Badge key={genre} variant="secondary" className="px-3 py-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/20 border border-primary/10">
                                                {genre.trim()}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-3">
                            {profile.personalityProfile?.smokingAllowed ? (
                                <Badge variant="outline" className="px-4 py-2 border-emerald-500/30 text-emerald-600 bg-emerald-500/5">🚬 Smoking Allowed</Badge>
                            ) : (
                                <Badge variant="outline" className="px-4 py-2 border-red-500/30 text-red-600 bg-red-500/5">🚭 No Smoking</Badge>
                            )}

                            {profile.personalityProfile?.petsAllowed ? (
                                <Badge variant="outline" className="px-4 py-2 border-primary/30 text-primary bg-primary/5">🐶 Pets Friendly</Badge>
                            ) : (
                                <Badge variant="outline" className="px-4 py-2 border-muted-foreground/30 text-muted-foreground bg-muted/20">NO Pets</Badge>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
