import { useEffect, useState } from "react";
import { searchMatches, getTrips, MatchResult } from "@/api/trips";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";

const Matches = () => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      // Fetch all trips to show availability
      try {
        const results = await getTrips();
        setMatches(results);
      } catch (err) {
        console.error("Failed to load matches", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-8">AI-Powered Matches 🤖</h1>

      {loading ? (
        <div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Analyzing Routes...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <Card key={match.id} className="relative overflow-hidden border-primary/20 bg-card/50">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{match.driver?.name || "Driver"}</span>
                  <Badge variant="outline">${match.pricePerSeat}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  {match.origin} ➝ {match.destination}
                </div>

                {/* AI Explanation Block */}
                {match.aiExplanation && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-1 text-primary font-semibold text-xs uppercase tracking-wide">
                      <Sparkles className="w-3 h-3" /> Gemini Insight
                    </div>
                    <p className="text-sm italic text-foreground/90">
                      "{match.aiExplanation}"
                    </p>
                  </div>
                )}

                {/* Metrics */}
                {match.matchMetrics && (
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
                    <div>Detour: {match.matchMetrics.detour}%</div>
                    <div>Overlap: {match.matchMetrics.overlap}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {matches.length === 0 && <p>No matches found.</p>}
        </div>
      )}
    </div>
  );
};

export default Matches;
