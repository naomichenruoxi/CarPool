import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Index from "./pages/Index";
import Search from "./pages/Search";
import RideDetails from "./pages/RideDetails";
import OfferRide from "./pages/OfferRide";
import CreateTrip from "./pages/CreateTrip";
import Matches from "./pages/Matches";
import Confirm from "./pages/Confirm";
import ProfileQuestions from "./pages/ProfileQuestions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/profile-questions" element={<ProfileQuestions />} />
                <Route path="/search" element={<Search />} />
                <Route path="/ride/:id" element={<RideDetails />} />
                <Route path="/offer" element={<OfferRide />} />
                <Route path="/create-trip" element={<CreateTrip />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/confirm" element={<Confirm />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
