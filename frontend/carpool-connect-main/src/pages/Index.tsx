import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SearchForm from "@/components/rides/SearchForm";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight, Car, Leaf, MapPin, Shield, Users, Wallet } from "lucide-react";

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
  { value: "50K+", label: "Active Riders", icon: Users },
  { value: "10K+", label: "Daily Rides", icon: Car },
  { value: "2M+", label: "CO₂ Saved (kg)", icon: Leaf },
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
      <section className="relative overflow-hidden bg-hero-gradient py-24 md:py-36">
        {/* Dynamic Mesh Background - Boosted Visibility */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] animate-mesh opacity-100 will-change-transform">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_60%)]" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/40 blur-[60px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/40 blur-[60px] rounded-full mix-blend-screen" />
          </div>
        </div>

        {/* Floating Blobs (Preserved & Enhanced) */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-accent/50 blur-3xl animate-float will-change-transform" />
          <div className="absolute right-0 bottom-0 h-[30rem] w-[30rem] rounded-full bg-primary-foreground/40 blur-3xl animate-float-delayed will-change-transform" />
        </div>

        {/* Floating 3D Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Car Icon - Top Left */}
          <Car className="hidden md:block absolute top-32 left-[5%] w-32 h-32 text-primary/30 -rotate-12 animate-float dark:text-white/20" />
          {/* MapPin Icon - Bottom Right */}
          <MapPin className="hidden md:block absolute bottom-40 right-[10%] w-24 h-24 text-accent/40 rotate-12 animate-float-delayed dark:text-white/20" />
          {/* Leaf Icon - floating somewhere distinct */}
          <Leaf className="hidden md:block absolute top-1/2 right-[20%] w-16 h-16 text-emerald-500/40 rotate-45 animate-float duration-[7000ms] dark:text-emerald-400/30" />

          {/* Driving Car Animation - Visible on ALL screens and FASTER */}
          <div className="absolute bottom-32 left-0 w-full animate-drive opacity-90 dark:opacity-70 z-10 will-change-transform">
            <Car className="w-16 h-16 md:w-24 md:h-24 text-primary/80 dark:text-white/80" strokeWidth={1.5} />
          </div>
        </div>

        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal width="100%">
              <div className="flex justify-center">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm text-primary-foreground backdrop-blur-md shadow-inner transition-transform hover:scale-105">
                  <Car className="h-4 w-4" />
                  <span className="font-medium tracking-wide">The smarter way to travel</span>
                </div>
              </div>
            </Reveal>

            <Reveal width="100%" delay={100}>
              <h1 className="font-display text-5xl font-extrabold tracking-tight text-white md:text-7xl drop-shadow-sm leading-tight">
                <span className="text-glow">Share Rides,</span>
                <br />
                <span className="text-emerald-400 font-extrabold pb-2">Save the Planet</span>
              </h1>
            </Reveal>

            <Reveal width="100%" delay={200}>
              <p className="mt-8 text-lg text-primary-foreground/90 md:text-2xl font-light max-w-2xl mx-auto leading-relaxed">
                Join thousands of commuters saving money and reducing emissions.
                Find your perfect ride or offer seats today.
              </p>
            </Reveal>

            <Reveal width="100%" delay={300}>
              <div className="mt-12 p-1">
                <div className="rounded-2xl p-2 shadow-2xl ring-1 ring-white/10 hover:scale-[1.01] transition-transform duration-500">
                  <div className="bg-black/30 rounded-xl p-4 md:p-6 backdrop-blur-xl border border-white/10 shadow-inner">
                    <SearchForm variant="hero" />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal width="100%" delay={400}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button
                  variant="heroOutline"
                  size="lg"
                  className="h-14 px-8 text-lg border-2 hover:bg-white/20 transition-all duration-300"
                  onClick={() => setRoleAndGo("driver", "/offer")}
                >
                  Offer a Ride
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats Section - Animated & Floating */}
      <section className="relative z-20 mt-8 md:-mt-12 pb-20 pointer-events-none">
        <div className="container pointer-events-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 100} width="100%">
                <div className="relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 p-6 md:p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-primary/20 group text-center md:text-left">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300 transform translate-x-1/4 -translate-y-1/4">
                    <stat.icon className="w-24 h-24 text-primary" />
                  </div>

                  <div className="relative z-10 flex flex-col items-center md:items-start">
                    <div className="mb-2 p-2 rounded-lg bg-primary/10 text-primary w-fit">
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <p className="font-display text-4xl md:text-5xl font-extrabold text-primary drop-shadow-sm">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>

                  {/* Decorative shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-200%] group-hover:animate-shimmer" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-background relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
        <div className="absolute -left-64 top-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -right-64 bottom-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative">
          <Reveal width="100%">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="font-display text-3xl font-bold text-foreground md:text-5xl drop-shadow-sm">Why Choose <span className="text-primary">CarPool?</span></h2>
              <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
                More than just a ride – it's a community of travelers making a difference.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 150} width="100%">
                <div
                  className="group h-full rounded-3xl border border-border/40 bg-card/40 backdrop-blur-sm p-8 transition-all duration-500 
                  hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] 
                  hover:-translate-y-2 hover:bg-card/80"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-emerald-500/10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:from-primary group-hover:to-emerald-500 group-hover:text-white shadow-sm ring-1 ring-primary/20">
                    <feature.icon className="h-8 w-8" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-3 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">{feature.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container relative z-10">
          <Reveal width="100%">
            <div className="mx-auto max-w-4xl rounded-[2.5rem] p-8 text-center md:p-16 shadow-2xl relative overflow-hidden group transition-all duration-500
              border-none
              bg-gradient-to-r from-primary to-emerald-700 shadow-2xl
            ">

              {/* Floating Icons Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Leaf className="absolute top-10 left-10 w-24 h-24 text-emerald-500/10 rotate-[-15deg] animate-float transition-transform group-hover:scale-110 duration-700 dark:text-white/10" />
                <Car className="absolute bottom-10 right-10 w-32 h-32 text-blue-500/10 rotate-[15deg] animate-float-delayed transition-transform group-hover:scale-110 duration-700 dark:text-white/10" />
                <Wallet className="absolute top-10 right-20 w-16 h-16 text-yellow-500/10 rotate-[10deg] animate-float-delayed transition-transform group-hover:scale-110 duration-700 dark:text-white/10" />
              </div>

              {/* Hover Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:animate-shimmer pointer-events-none" />

              <div className="relative z-10">
                <h2 className="font-display text-3xl font-bold md:text-5xl mb-6 text-white">
                  Ready to Start Sharing?
                </h2>
                <p className="mt-4 text-xl font-light max-w-2xl mx-auto mb-10 text-white/90">
                  Whether you're looking for a ride or have seats to offer, join our community today.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setRoleAndGo("carpooler", "/search")}
                    className="h-14 px-8 text-lg border-white/40 text-white hover:bg-white/20 hover:text-white transition-all duration-300"
                  >
                    Find a Ride
                  </Button>

                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                      bg-white text-primary hover:bg-white/90"
                    onClick={() => setRoleAndGo("driver", "/offer")}
                  >
                    Offer a Ride
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Index;
