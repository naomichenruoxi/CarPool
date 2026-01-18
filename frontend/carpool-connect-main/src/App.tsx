import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import RideDetails from "./pages/RideDetails";
import OfferRide from "./pages/OfferRide";
import CreateTrip from "./pages/CreateTrip";
import Matches from "./pages/Matches";
import Confirm from "./pages/Confirm";
import Login from "./pages/Login";
import ProfileQuestions from "./pages/ProfileQuestions";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import DriverRequests from "./pages/DriverRequests";

import { useUser } from "@/context/UserContext";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const queryClient = new QueryClient();

import { useState, useEffect } from "react";

const AppRoutes = () => {
  const { loading } = useUser();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    // Force the loading screen to stay for at least 2000ms to show the animation
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !minTimeElapsed) return <LoadingScreen />;

  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile-questions" element={<ProfileQuestions />} />
          <Route path="/search" element={<Search />} />
          <Route path="/ride/:id" element={<RideDetails />} />
          <Route path="/offer" element={<OfferRide />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile/me" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/driver-requests" element={<DriverRequests />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

import { useLoadScript } from "@react-google-maps/api";

// ...

const App = () => {
  // Use hook instead of Component to avoid wrapping everything if key is missing (graceful degradation)
  // OR just wrap. Let's wrap.
  // Actually, useJsApiLoader or LoadScript from @react-google-maps/api

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {/* We will load the script here. If no key, it won't load, autocompletes won't work but won't crash apps unless valid key is required for render. */}
            <GoogleMapsWrapper>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </GoogleMapsWrapper>
          </TooltipProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const libraries: ("places")[] = ["places"];

const GoogleMapsWrapper = ({ children }: { children: React.ReactNode }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // If no key, just render children (autocomplete will be disabled/plain input)
  if (!apiKey) return <>{children}</>;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  if (loadError) {
    console.error("Google Maps Load Error:", loadError);
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <div className="text-destructive font-bold text-xl">Google Maps Failed to Load</div>
        <p className="text-muted-foreground max-w-md">
          There is an issue with the API Key provided.
          Please check your console for details or verify your <code>.env</code> file.
        </p>
        <p className="text-sm font-mono bg-muted p-2 rounded text-left">
          {loadError.message}
        </p>
      </div>
    );
  }

  if (!isLoaded) return <LoadingScreen />;

  return <>{children}</>;
};

export default App;
