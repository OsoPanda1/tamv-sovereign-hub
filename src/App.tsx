import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import DreamSpaces from "./pages/DreamSpaces";
import Marketplace from "./pages/Marketplace";
import University from "./pages/University";
import Wallet from "./pages/Wallet";
import Channels from "./pages/Channels";
import Streaming from "./pages/Streaming";
import Lottery from "./pages/Lottery";
import Pets from "./pages/Pets";
import Profile from "./pages/Profile";
import Gallery from "./pages/Gallery";
import Governance from "./pages/Governance";
import Achievements from "./pages/Achievements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/dreamspaces" element={<DreamSpaces />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/university" element={<University />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/channels" element={<Channels />} />
            <Route path="/streaming" element={<Streaming />} />
            <Route path="/lottery" element={<Lottery />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
