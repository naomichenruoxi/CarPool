import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { ArrowRight } from "lucide-react";

const ProfileQuestions = () => {
  const navigate = useNavigate();
  const { role } = useUser();

  const handleContinue = () => {
    navigate("/create-trip");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Tell us about yourself
          </h1>
          <p className="text-muted-foreground">
            You selected: <span className="font-semibold text-primary capitalize">{role}</span>
          </p>
        </div>

        <div className="space-y-6 bg-card border border-border rounded-2xl p-8">
          {/* TODO: Add personality profile questions */}
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Question 1 placeholder</p>
              <p className="mt-2 text-foreground">What's your preferred communication style?</p>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Question 2 placeholder</p>
              <p className="mt-2 text-foreground">Do you prefer quiet rides or conversation?</p>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Question 3 placeholder</p>
              <p className="mt-2 text-foreground">What music do you enjoy during trips?</p>
            </div>
          </div>

          <Button 
            onClick={handleContinue} 
            size="lg" 
            className="w-full mt-8"
          >
            Continue to Create Trip
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileQuestions;
