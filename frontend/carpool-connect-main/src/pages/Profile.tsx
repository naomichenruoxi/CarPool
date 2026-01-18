
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, MessageCircle, Music, Edit, MapPin, Briefcase, Globe } from "lucide-react";
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
                if (error.response?.status === 401) {
                    toast.error("Please log in to view profiles");
                    navigate('/login');
                    return;
                }
                toast.error("Could not load profile");
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
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="container max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Sidebar / Main Info */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="card-shadow border-primary/20">
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <Avatar className="w-32 h-32 border-4 border-background shadow-xl mb-4">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} />
                                    <AvatarFallback>{profile.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
                                <p className="text-muted-foreground capitalize">{profile.isDriver ? "Driver" : "Passenger"}</p>

                                {isOwnProfile && (
                                    <Button variant="outline" className="mt-6 w-full" onClick={() => navigate('/profile-questions')}>
                                        <Edit className="w-4 h-4 mr-2" /> Edit Profile
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Compatibility Card */}
                        {!isOwnProfile && (
                            <Card className="bg-gradient-to-tr from-primary/10 to-accent/10 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-primary">
                                        <Sparkles className="w-5 h-5" /> Vibe Check
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {loadingCompatibility ? (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Loader2 className="w-4 h-4 animate-spin" /> Analyzing vibes...
                                        </div>
                                    ) : (
                                        <p className="text-sm font-medium leading-relaxed italic text-foreground/80">
                                            "{compatibility || "It's a match!"}"
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Details Column */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Bio */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About Me</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-foreground/80 leading-relaxed font-medium">
                                    {profile.personalityProfile?.bio || "No bio yet."}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    {profile.personalityProfile?.hometown && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <span>From {profile.personalityProfile.hometown}</span>
                                        </div>
                                    )}
                                    {profile.personalityProfile?.workplace && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Briefcase className="w-4 h-4 text-primary" />
                                            <span>Works/Studies at {profile.personalityProfile.workplace}</span>
                                        </div>
                                    )}
                                    {profile.personalityProfile?.languages && (
                                        <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
                                            <Globe className="w-4 h-4 text-primary" />
                                            <span>Speaks {profile.personalityProfile.languages}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats / Taste */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4 text-primary" /> Talkativeness
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="w-full bg-secondary h-2.5 rounded-full mt-2">
                                        <div
                                            className="bg-primary h-2.5 rounded-full transition-all duration-1000"
                                            style={{ width: `${(profile.personalityProfile?.talkativeness || 3) / 5 * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                        <span>Quiet</span>
                                        <span>Chatty</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Music className="w-4 h-4 text-primary" /> Music Taste
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Badge variant="secondary" className="text-sm px-3 py-1">
                                        {profile.personalityProfile?.musicPreference || "Anything"}
                                    </Badge>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Additional Badges */}
                        <div className="flex gap-2">
                            {profile.personalityProfile?.smokingAllowed && <Badge variant="outline">🚬 Smoking Allowed</Badge>}
                            {profile.personalityProfile?.petsAllowed && <Badge variant="outline">🐶 Pets Friendly</Badge>}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
