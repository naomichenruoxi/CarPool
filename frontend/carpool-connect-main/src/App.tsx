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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
