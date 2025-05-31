
import { useState, useEffect } from 'react';

export interface Certificate {
  id: string;
  title: string;
  type: 'resource' | 'session';
  issuer: string;
  issuedDate: string;
  certificateId: string;
  verifiable: boolean;
  resourceType?: 'video' | 'pdf' | 'file';
  sessionDuration?: string;
  xpEarned: number;
}

// Mock certificate data - in a real app this would come from a backend
const mockCertificates: Certificate[] = [
  {
    id: '1',
    title: 'Advanced React Patterns and Best Practices',
    type: 'resource',
    issuer: 'PeerVerse Learning',
    issuedDate: '2024-03-20',
    certificateId: 'PV-REACT-2024-001',
    verifiable: true,
    resourceType: 'video',
    xpEarned: 250
  },
  {
    id: '2',
    title: 'React Hooks Deep Dive - Session Completion',
    type: 'session',
    issuer: 'PeerVerse Community',
    issuedDate: '2024-03-18',
    certificateId: 'PV-SESSION-2024-002',
    verifiable: true,
    sessionDuration: '45 min',
    xpEarned: 150
  }
];

export const useCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading certificates from backend
    setTimeout(() => {
      setCertificates(mockCertificates);
      setIsLoading(false);
    }, 500);
  }, []);

  const issueCertificate = (certificate: Omit<Certificate, 'id' | 'issuedDate' | 'certificateId' | 'verifiable'>) => {
    const newCertificate: Certificate = {
      ...certificate,
      id: Date.now().toString(),
      issuedDate: new Date().toISOString().split('T')[0],
      certificateId: `PV-${certificate.type.toUpperCase()}-${new Date().getFullYear()}-${String(certificates.length + 1).padStart(3, '0')}`,
      verifiable: true
    };

    setCertificates(prev => [newCertificate, ...prev]);
    return newCertificate;
  };

  return {
    certificates,
    isLoading,
    issueCertificate
  };
};
