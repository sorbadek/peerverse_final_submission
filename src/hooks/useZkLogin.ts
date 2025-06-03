import { useContext } from 'react';
import { ZkLoginContext } from '../contexts/ZkLoginContext';

export const useZkLogin = () => {
  const context = useContext(ZkLoginContext);
  if (context === undefined) {
    throw new Error('useZkLogin must be used within a ZkLoginProvider');
  }
  return context;
};
