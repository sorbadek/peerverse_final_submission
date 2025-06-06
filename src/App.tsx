import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EnokiFlowProvider } from '@mysten/enoki/react';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { registerEnokiWallets } from '@mysten/enoki';
import AuthProvider from './contexts/AuthContext';
import { ZkLoginProvider } from './contexts/ZkLoginContext';
import { SocialProvider } from './components/SocialContext';
import ProtectedRoute from './components/ProtectedRoute';
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
import JitsiMeet from "./components/JitsiMeet";

const queryClient = new QueryClient();

// Configure the Sui network
const NETWORK = 'devnet';
const networks = {
  [NETWORK]: { url: getFullnodeUrl(NETWORK) }
};

// Create SUI client for Enoki
const suiClient = new SuiClient({ url: getFullnodeUrl(NETWORK) });

// Register Enoki wallets with API key
registerEnokiWallets({
  apiKey: import.meta.env.VITE_ENOKI_API_KEY,
  network: NETWORK,
  providers: {
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirectUrl: `${window.location.origin}/auth/callback`
    }
  },
  client: suiClient
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <SuiClientProvider networks={networks} defaultNetwork={NETWORK}>
        <WalletProvider preferredWallets={['enoki']}>
          <EnokiFlowProvider apiKey={import.meta.env.VITE_ENOKI_API_KEY}>
            <ZkLoginProvider>
              <AuthProvider>
                <SocialProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <Index />
                        </ProtectedRoute>
                      } />
                      <Route path="/learn" element={
                        <ProtectedRoute>
                          <Learn />
                        </ProtectedRoute>
                      } />
                      <Route path="/tutor-hub" element={
                        <ProtectedRoute>
                          <TutorHub />
                        </ProtectedRoute>
                      } />
                      <Route path="/community" element={
                        <ProtectedRoute>
                          <Community />
                        </ProtectedRoute>
                      } />
                      <Route path="/marketplace" element={
                        <ProtectedRoute>
                          <Marketplace />
                        </ProtectedRoute>
                      } />
                      <Route path="/upload-material" element={
                        <ProtectedRoute>
                          <UploadMaterial />
                        </ProtectedRoute>
                      } />
                      <Route path="/vault" element={
                        <ProtectedRoute>
                          <Vault />
                        </ProtectedRoute>
                      } />
                      <Route path="/session/:roomId" element={
                        <ProtectedRoute>
                          <div className="w-full h-screen">
                            <JitsiMeet onClose={() => window.history.back()} roomId={window.location.pathname.split('/').pop() || ''} />
                          </div>
                        </ProtectedRoute>
                      } />
                      <Route path="/public-profile" element={
                        <ProtectedRoute>
                          <PublicProfile />
                        </ProtectedRoute>
                      } />
                      <Route path="/settings" element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      } />
                      <Route path="/profile/:userId" element={
                        <ProtectedRoute>
                          <PublicProfile />
                        </ProtectedRoute>
                      } />
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <PublicProfile />
                        </ProtectedRoute>
                      } />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </TooltipProvider>
                </SocialProvider>
              </AuthProvider>
            </ZkLoginProvider>
          </EnokiFlowProvider>
        </WalletProvider>
      </SuiClientProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
