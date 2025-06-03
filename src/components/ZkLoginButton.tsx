
import React from 'react';
import { Button } from './ui/button';
import { Shield, Loader2 } from 'lucide-react';
import { useZkLogin } from '../contexts/ZkLoginContext';

interface ZkLoginButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

const ZkLoginButton: React.FC<ZkLoginButtonProps> = ({ 
  variant = 'default', 
  size = 'default',
  className = '',
  children
}) => {
  const { login, isLoading, isAuthenticated } = useZkLogin();

  if (isAuthenticated) {
    return null; // Don't show login button if already authenticated
  }

  return (
    <Button
      onClick={login}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={`${className} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        children || (
          <>
            <Shield className="w-4 h-4 mr-2" />
            Login with zkLogin
          </>
        )
      )}
    </Button>
  );
};

export default ZkLoginButton;
