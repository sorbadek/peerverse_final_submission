
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'loading:', loading);

  if (loading) {
    console.log('ProtectedRoute - showing loading screen');
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="bg-gray-900 border-gray-700 w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-white text-center flex items-center justify-center">
              <Loader2 className="h-6 w-6 mr-2 animate-spin text-blue-500" />
              Verifying Session
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col items-center space-y-4 pt-4">
              <p className="text-gray-400">
                Please wait while we check your authentication status.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute - redirecting to home, user not authenticated');
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute - rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
