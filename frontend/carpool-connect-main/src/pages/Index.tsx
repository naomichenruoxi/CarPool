import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight, Car, Leaf, MapPin, Shield, Users, Wallet, Search } from "lucide-react";

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



const Index = () => {
  const navigate = useNavigate();

  const setRoleAndGo = (role: "driver" | "carpooler", path: string) => {
    localStorage.setItem("role", role);
    navigate(path);
  };
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      {/* Hero Section - Redesigned for WOW */}
      <section className="relative overflow-hidden bg-hero-gradient min-h-[calc(100vh-64px)] flex items-center py-20">
        {/* Dynamic Mesh Background - Subtle & Deep */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] animate-mesh opacity-60 will-change-transform">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_70%)]" />
            <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/30 blur-[100px] rounded-full mix-blend-screen animate-pulse duration-[4000ms]" />
            <div className="absolute bottom-1/3 right-1/3 w-[600px] h-[600px] bg-accent/20 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[6000ms]" />
          </div>
        </div>

        {/* Floating Icons - 3D Depth Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <Car className="hidden md:block absolute top-20 left-[10%] w-40 h-40 text-primary/20 -rotate-12 animate-float blur-[1px]" />
          <MapPin className="hidden md:block absolute bottom-32 right-[15%] w-32 h-32 text-accent/30 rotate-12 animate-float-delayed blur-[1px]" />
          <Leaf className="hidden md:block absolute top-1/2 right-[5%] w-20 h-20 text-emerald-400/20 rotate-45 animate-float duration-[8000ms]" />

          {/* Moving Car across bottom - Increased Visibility */}
          <div className="absolute bottom-10 left-0 w-full animate-drive opacity-90 z-10">
            <Car className="w-32 h-32 text-white/30 drop-shadow-lg" strokeWidth={1.5} />
          </div>
        </div>

        <div className="container relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            <Reveal width="100%">
              <div className="flex justify-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-2 text-sm font-semibold text-white backdrop-blur-md shadow-lg transition-transform hover:scale-105 hover:bg-white/20">
                  <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  The smarter way to travel
                </div>
              </div>
            </Reveal>

            <Reveal width="100%" delay={100}>
              <h1 className="font-display text-5xl font-black tracking-tight text-white md:text-8xl drop-shadow-lg leading-[1.1] mb-6">
                Share Rides, <br />
                <span className="text-emerald-300 drop-shadow-md">Save the Planet</span>
              </h1>
            </Reveal>

            <Reveal width="100%" delay={200}>
              <p className="mt-6 text-xl text-emerald-50 md:text-2xl font-light max-w-3xl mx-auto leading-relaxed opacity-90">
                Join thousands of commuters making a difference.
                Whether you're a driver or a passenger, <span className="font-semibold text-white">Pathr</span> connects you instantly.
              </p>
            </Reveal>

            <Reveal width="100%" delay={300}>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button
                  size="lg"
                  className="h-16 px-10 text-xl font-bold bg-white text-emerald-900 hover:bg-emerald-50 shadow-2xl hover:scale-105 hover:shadow-white/20 transition-all active:scale-95 w-full sm:w-auto rounded-2xl"
                  onClick={() => navigate("/signup")}
                >
                  Get Started Now
                  <ArrowRight className="h-6 w-6 ml-2" />
                </Button>
                <Button
                  variant="heroOutline"
                  size="lg"
                  className="h-16 px-10 text-xl font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all w-full sm:w-auto rounded-2xl backdrop-blur-sm"
                  onClick={() => navigate("/login")}
                >
                  Browser Rides
                </Button>
              </div>
            </Reveal>

            {/* Quick Stats Teaser */}
            <Reveal width="100%" delay={500}>
              <div className="mt-16 flex justify-center gap-12 text-white/50 text-sm font-medium tracking-widest uppercase">
                <div><span className="text-white font-bold text-lg block">50k+</span> Riders</div>
                <div><span className="text-white font-bold text-lg block">100%</span> Verified</div>
                <div><span className="text-white font-bold text-lg block">4.9/5</span> Rating</div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* How It Works Section - Glass & Gradient */}
      <section className="py-24 bg-muted/20 relative overflow-hidden bg-grain">
        {/* Background gradient blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        {/* The Pathr Line - Connecting The Steps */}
        <div className="absolute top-1/2 left-0 w-full h-full hidden md:block pointer-events-none opacity-40">
          <svg className="w-full h-full absolute top-0 left-0 z-0" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              d="M0,160 C320,300, 420,0, 720,160 C1020,320, 1120,0, 1440,160"
              fill="none"
              stroke="url(#gradient-path)"
              strokeWidth="4"
              strokeDasharray="12 12"
              className="animate-pulse"
            />
            <defs>
              <linearGradient id="gradient-path" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
                <stop offset="50%" stopColor="#10B981" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="container relative">
          <Reveal width="100%">
            <div className="text-center mb-16 relative z-10">
              <span className="text-sm font-bold text-primary tracking-widest uppercase mb-2 block">Simple Process</span>
              <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">How It Works</h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">Start your journey with Pathr in 3 simple steps.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              { title: "Create Profile", text: "Sign up instantly and verify your details to join our trusted community.", icon: Users, step: "01" },
              { title: "Find or Offer", text: "Search for a ride that matches your route, or offer your empty seats.", icon: Search, step: "02" },
              { title: "Travel Together", text: "Meet your co-travelers, save money, and enjoy the journey.", icon: Car, step: "03" }
            ].map((step, i) => (
              <Reveal key={i} delay={i * 200} width="100%">
                <div className="relative p-8 rounded-[2rem] bg-white dark:bg-card border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden h-full">
                  {/* Step Number Watermark - Fixed for Light Mode */}
                  <div className="absolute -right-4 -top-6 text-[150px] font-black text-primary/5 dark:text-white/5 select-none font-display z-0 group-hover:scale-110 transition-transform duration-700">
                    {step.step}
                  </div>

                  <div className="relative z-10 flex flex-col items-start h-full">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white text-2xl mb-6 shadow-lg rotate-3 group-hover:rotate-6 transition-transform duration-300">
                      <step.icon className="w-8 h-8" strokeWidth={2} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 font-display text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{step.text}</p>
                  </div>

                  {/* Bottom Gradient Line */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Animated & Floating (Real Data) */}
      <section className="relative z-20 py-20 pointer-events-none">
        <div className="container pointer-events-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: "3.7kg", label: "CO₂ Saved Per Trip", icon: Leaf, sub: "Source: Transport Canada" },
              { value: "$1,500+", label: "Annual Savings", icon: Wallet, sub: "Average Commuter Savings" },
              { value: "17 Tons", label: "Yearly CO₂ Reduction", icon: Car, sub: "Per 4-Person Carpool" },
            ].map((stat, index) => (
              <Reveal key={stat.label} delay={index * 100} width="100%">
                <div className="relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 p-6 md:p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-primary/20 group text-center md:text-left h-full">
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
                    <p className="text-xs text-muted-foreground/60 mt-2 italic border-t border-border/50 pt-2 w-full">
                      {stat.sub}
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
              <h2 className="font-display text-3xl font-bold text-foreground md:text-5xl drop-shadow-sm">Why Choose <span className="text-primary">Pathr?</span></h2>
              <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
                More than just a ride – it's a community of travelers making a difference.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 150} width="100%">
                <div
                  className="group h-full rounded-3xl border border-border/60 bg-card/60 backdrop-blur-sm p-8 transition-all duration-500 
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
                    onClick={() => navigate("/signup")}
                    className="h-14 px-8 text-lg border-white/40 text-white hover:bg-white/20 hover:text-white transition-all duration-300"
                  >
                    Join to Find
                  </Button>

                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                      bg-white text-primary hover:bg-white/90"
                    onClick={() => navigate("/signup")}
                  >
                    Join to Offer
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
