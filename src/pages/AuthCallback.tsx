import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEnokiFlow } from '@mysten/enoki/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string>('');
  const enokiFlow = useEnokiFlow();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('AuthCallback - starting callback handling');
        console.log('location.hash:', location.hash);
        console.log('location.search:', location.search);

        // Clear any existing auth state
        localStorage.removeItem('zklogin_id_token');
        localStorage.removeItem('user');

        // Use the fragment (hash) or query string as the callback payload
        let callbackPayload = '';
        if (location.hash && location.hash.length > 1) {
          callbackPayload = location.hash.substring(1); // remove '#'
        } else if (location.search && location.search.length > 1) {
          callbackPayload = location.search.substring(1); // remove '?'
        }

        console.log('callbackPayload:', callbackPayload);

        if (!callbackPayload) {
          throw new Error('No authorization token received');
        }

        console.log('Calling enokiFlow.handleAuthCallback...');
        // Use the Enoki SDK's handleAuthCallback as recommended
        const session = await enokiFlow.handleAuthCallback(callbackPayload);
        console.log('enokiFlow.handleAuthCallback completed successfully');
        console.log('Session object structure:', JSON.stringify(session, null, 2));
        
        // Try to get the JWT from the session or Enoki wallet
        let jwtToken: string | null = null;
        let userAddress: string | null = null;
        
        // Get the current address from the Enoki wallet
        try {
          const accounts = await window.enoki?.getAccounts();
          if (accounts?.[0]?.address) {
            userAddress = accounts[0].address;
            console.log('Got user address from Enoki wallet:', userAddress);
          }
        } catch (e) {
          console.warn('Could not get address from Enoki wallet:', e);
        }
        
        // Debug: Log all localStorage contents
        console.log('Current localStorage contents:');
        Object.keys(localStorage).forEach(key => {
          console.log(`- ${key}:`, localStorage.getItem(key));
        });
        
        // Safely check session for idToken
        interface AuthSession {
          idToken?: string;
          // Add other session properties as needed
        }
        
        const safeSession = session as AuthSession | null;
        if (safeSession?.idToken) {
          jwtToken = safeSession.idToken;
          console.log('Found JWT in session.idToken');
        } 
        // If not in session, try to get it from Enoki wallet instance
        else {
          console.log('No JWT in session, checking Enoki wallet instance...');
          try {
            // Type-safe access to window.enoki
            interface EnokiState {
              token?: string;
              user?: { idToken?: string };
            }
            
            const enokiState = (window as unknown as { enoki?: { state?: EnokiState } })?.enoki?.state;
            
            if (enokiState?.token) {
              jwtToken = enokiState.token;
              console.log('Found JWT in window.enoki.state.token');
            } else if (enokiState?.user?.idToken) {
              jwtToken = enokiState.user.idToken;
              console.log('Found JWT in window.enoki.state.user.idToken');
            }
          } catch (e) {
            console.warn('Could not access Enoki wallet state:', e);
          }
        }
        
        if (jwtToken) {
          localStorage.setItem('zklogin_id_token', jwtToken);
          console.log('Saved JWT to localStorage. New token:', jwtToken);
          
          // If we have user info, save it
          if (userAddress) {
            const userData = {
              name: 'User',
              email: 'user@zklogin.sui',
              zkAddress: userAddress
            };
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('Saved user data to localStorage');
          }
          
          // Verify tokens were saved
          const savedToken = localStorage.getItem('zklogin_id_token');
          const savedUser = localStorage.getItem('user');
          console.log('Verification - Retrieved from localStorage:', { savedToken, savedUser });
        } else {
          console.warn('No JWT token found in session or Enoki wallet state');
          // Log the session structure for debugging
          console.log('Session structure:', JSON.stringify(session, null, 2));
          throw new Error('No authentication token received from provider');
        }
        setStatus('success');
        console.log('AuthCallback - success, redirecting to dashboard in 3 seconds');
        
        // Give more time for the auth state to propagate
        setTimeout(() => {
          // Force a full page reload to ensure all auth state is properly initialized
          window.location.href = '/dashboard';
        }, 1000);
      } catch (error) {
        console.error('zkLogin callback error:', error);
        
        // Enhanced error logging
        let errorMessage = 'Authentication failed';
        if (error instanceof Error) {
          errorMessage = error.message;
          
          // Handle specific Enoki errors
          if (error.message.includes('network is not enabled')) {
            errorMessage = 'Devnet access not enabled for this API key. Check Enoki dashboard settings.';
          } else if (error.message.includes('invalid client id')) {
            errorMessage = 'Google OAuth client ID mismatch. Verify your configuration.';
          }
        }
        
        setError(errorMessage);
        setStatus('error');
        
        // Redirect to home page after error
        setTimeout(() => {
          navigate('/');
        }, 5000);
      }
    };

    handleCallback();
  }, [navigate, location, enokiFlow]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-gray-700 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-white text-center">
            {status === 'processing' && 'Completing zkLogin...'}
            {status === 'success' && 'Login Successful!'}
            {status === 'error' && 'Login Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'processing' && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-gray-400">
                Securing your privacy with zero-knowledge proofs...
              </p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-green-400">
              <p>zkLogin completed successfully!</p>
              <p className="text-sm text-gray-400 mt-2">
                Redirecting to dashboard...
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-red-400">
              <p>Authentication failed</p>
              <p className="text-sm text-gray-400 mt-2">{error}</p>
              <p className="text-sm text-gray-400 mt-2">
                Redirecting to home page in 5 seconds...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
