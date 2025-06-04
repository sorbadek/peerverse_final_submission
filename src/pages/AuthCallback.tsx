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
        // Use the fragment (hash) or query string as the callback payload
        let callbackPayload = '';
        if (location.hash && location.hash.length > 1) {
          callbackPayload = location.hash.substring(1); // remove '#'
        } else if (location.search && location.search.length > 1) {
          callbackPayload = location.search.substring(1); // remove '?'
        }

        if (!callbackPayload) {
          throw new Error('No authorization token received');
        }

        // Use the Enoki SDK's handleAuthCallback as recommended
        await enokiFlow.handleAuthCallback(callbackPayload);

        setStatus('success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
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