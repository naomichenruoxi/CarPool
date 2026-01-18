import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { ArrowRight, Music, MessageCircle, Cigarette, Dog, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import api from "@/lib/axios";

const ProfileQuestions = () => {
  const navigate = useNavigate();
  const { role } = useUser();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    bio: "",
    talkativeness: 3,
    musicPreference: "",
    smokingAllowed: false,
    petsAllowed: false,
    hometown: "",
    workplace: "",
    languages: ""
  });

  const handleContinue = async () => {
    setLoading(true);
    try {
      await api.put('/users/profile', formData);
      toast.success("Profile updated! Let's get moving. 🚗");
      navigate(role === "driver" ? "/offer" : "/search"); // Direct to relevant flow
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Uh oh! Couldn't save your vibe. Try again?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background p-4">
      <div className="container max-w-2xl mx-auto py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold text-foreground mb-3">
            Vibe Check ✨
          </h1>
          <p className="text-muted-foreground text-lg">
            Help us match you with the perfect Pathr buddies.
          </p>
        </div>

        <div className="bg-card border border-border/50 shadow-xl rounded-3xl p-8 space-y-8 animate-fade-in">

          {/* Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <User className="w-5 h-5 text-primary" />
              <Label htmlFor="bio" className="text-base">About You</Label>
            </div>
            <Textarea
              id="bio"
              placeholder="In a tweet: I love hiking, 90s rock, and quiet mornings..."
              className="resize-none h-24 text-base"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          {/* Talkativeness */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-foreground font-semibold">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <Label className="text-base">Talkativeness</Label>
              </div>
              <span className="text-sm text-muted-foreground font-normal">
                {formData.talkativeness === 1 ? "Zen Silence 🤫" :
                  formData.talkativeness === 5 ? "Non-stop Chat 🗣️" : "Balanced ☯️"}
              </span>
            </div>
            <Slider
              defaultValue={[3]}
              max={5}
              min={1}
              step={1}
              onValueChange={(vals) => setFormData({ ...formData, talkativeness: vals[0] })}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>Quiet</span>
              <span>Chatty</span>
            </div>
          </div>

          {/* Music */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Music className="w-5 h-5 text-primary" />
              <Label htmlFor="music" className="text-base">Music Vibe</Label>
            </div>
            <Input
              id="music"
              placeholder="e.g. Taylor Swift, Lo-Fi, True Crime Podcasts..."
              value={formData.musicPreference}
              onChange={(e) => setFormData({ ...formData, musicPreference: e.target.value })}
            />
          </div>

          {/* New Trust Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="hometown">Hometown 🏠</Label>
              <Input
                id="hometown"
                placeholder="e.g. Seattle, WA"
                value={formData.hometown}
                onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workplace">Work / School 💼</Label>
              <Input
                id="workplace"
                placeholder="e.g. Student at UW"
                value={formData.workplace}
                onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="languages">Languages I Speak 🗣️</Label>
              <Input
                id="languages"
                placeholder="e.g. English, Spanish, Hindi"
                value={formData.languages}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3">
                <Cigarette className="w-5 h-5 text-muted-foreground" />
                <Label htmlFor="smoking" className="cursor-pointer">Smoking Allowed?</Label>
              </div>
              <Switch
                id="smoking"
                checked={formData.smokingAllowed}
                onCheckedChange={(c) => setFormData({ ...formData, smokingAllowed: c })}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3">
                <Dog className="w-5 h-5 text-muted-foreground" />
                <Label htmlFor="pets" className="cursor-pointer">Pets Allowed?</Label>
              </div>
              <Switch
                id="pets"
                checked={formData.petsAllowed}
                onCheckedChange={(c) => setFormData({ ...formData, petsAllowed: c })}
              />
            </div>
          </div>

          <Button
            onClick={handleContinue}
            size="lg"
            className="w-full text-lg h-12 mt-4"
            disabled={loading}
          >
            {loading ? "Saving..." : "All Set! Let's Go 🚀"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileQuestions;
