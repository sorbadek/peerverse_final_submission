
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EnokiFlowProvider } from '@mysten/enoki/react';
import { AuthProvider } from './contexts/AuthContext';
import { ZkLoginProvider } from './contexts/ZkLoginContext';
import { SocialProvider } from './components/SocialContext';
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Learn from "./pages/Learn";
import TutorHub from "./pages/TutorHub";
import Community from "./pages/Community";
import Marketplace from "./pages/Marketplace";
import UploadMaterial from "./pages/UploadMaterial";
import Vault from "./pages/Vault";
import Settings from "./pages/Settings";
import PublicProfile from "./pages/PublicProfile";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <EnokiFlowProvider apiKey={import.meta.env.VITE_ENOKI_API_KEY || 'demo-api-key'}>
        <ZkLoginProvider>
          <AuthProvider>
            <SocialProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/dashboard" element={<Index />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/tutor-hub" element={<TutorHub />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/upload-material" element={<UploadMaterial />} />
                  <Route path="/vault" element={<Vault />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile/:userId" element={<PublicProfile />} />
                  <Route path="/profile" element={<PublicProfile />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </SocialProvider>
          </AuthProvider>
        </ZkLoginProvider>
      </EnokiFlowProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
