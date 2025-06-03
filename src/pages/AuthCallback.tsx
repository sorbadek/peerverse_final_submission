
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnokiFlow } from '@mysten/enoki/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string>('');
  const enokiFlow = useEnokiFlow();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');
        const state = urlParams.get('state');

        if (!authCode) {
          throw new Error('No authorization code received');
        }

        // Complete the zkLogin process using the enokiFlow
        const session = await enokiFlow.handleAuthCallback();

        if (session) {
          setStatus('success');
          // Store session for persistence
          localStorage.setItem('zkLogin_session', JSON.stringify(session));
          
          // Redirect to dashboard after successful login
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          throw new Error('Failed to create zkLogin session');
        }
      } catch (error) {
        console.error('zkLogin callback error:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
        setStatus('error');
        
        // Redirect to home page after error
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate, enokiFlow]);

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
                Redirecting to home page...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
