import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SearchForm from "@/components/rides/SearchForm";
import { ArrowRight, Car, Leaf, Shield, Users, Wallet } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Save Money",
    description: "Share fuel costs and travel for a fraction of the price of other options.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Reduce carbon emissions by sharing rides. One less car on the road.",
  },
  {
    icon: Shield,
    title: "Safe & Verified",
    description: "All drivers are verified. Ratings and reviews from the community.",
  },
  {
    icon: Users,
    title: "Build Community",
    description: "Meet new people and make your commute more enjoyable.",
  },
];

const stats = [
  { value: "50K+", label: "Active Riders" },
  { value: "10K+", label: "Daily Rides" },
  { value: "2M+", label: "CO₂ Saved (kg)" },
];

const Index = () => {
  const navigate = useNavigate();

  const setRoleAndGo = (role: "driver" | "carpooler", path: string) => {
    localStorage.setItem("role", role);
    navigate(path);
  };
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient py-20 md:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-4 top-20 h-72 w-72 rounded-full bg-primary-foreground blur-3xl" />
          <div className="absolute -right-4 bottom-20 h-96 w-96 rounded-full bg-primary-foreground blur-3xl" />
        </div>

        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-in">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground backdrop-blur-sm">
                <Car className="h-4 w-4" />
                <span>The smarter way to travel</span>
              </div>
            </div>

            <h1 className="animate-fade-in font-display text-4xl font-extrabold tracking-tight text-primary-foreground md:text-6xl [animation-delay:100ms]">
              Share Rides,
              <br />
              Save the Planet
            </h1>

            <p className="mt-6 animate-fade-in text-lg text-primary-foreground/80 md:text-xl [animation-delay:200ms]">
              Join thousands of commuters saving money and reducing emissions. Find your perfect ride or offer seats in
              your car.
            </p>

            <div className="mt-10 animate-fade-in [animation-delay:300ms]">
              <SearchForm variant="hero" />
            </div>

            <div className="mt-8 flex animate-fade-in flex-wrap items-center justify-center gap-4 [animation-delay:400ms]">
              <Button variant="heroOutline" size="lg" onClick={() => setRoleAndGo("driver", "/offer")}>
                Offer a Ride
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-card py-12">
        <div className="container">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="animate-fade-in text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="font-display text-3xl font-bold text-primary md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground md:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">Why Choose CarPool?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              More than just a ride – it's a community of travelers making a difference.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="animate-fade-in group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:card-shadow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-3xl bg-hero-gradient p-8 text-center md:p-12">
            <h2 className="font-display text-2xl font-bold text-primary-foreground md:text-3xl">
              Ready to Start Sharing?
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Whether you're looking for a ride or have seats to offer, join our community today.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="heroOutline" size="lg" onClick={() => setRoleAndGo("carpooler", "/search")}>
                Find a Ride
              </Button>

              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                onClick={() => setRoleAndGo("driver", "/offer")}
              >
                Offer a Ride
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
