
import React from 'react';
import { Award, X } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Certificate } from '../hooks/useCertificates';

interface CertificateNotificationProps {
  certificate: Certificate;
  onClose: () => void;
}

const CertificateNotification = ({ certificate, onClose }: CertificateNotificationProps) => {
  return (
    <Card className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-600 to-yellow-500 border-yellow-400 max-w-md animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Certificate Earned!</h3>
              <p className="text-white/90 text-xs mt-1 line-clamp-2">
                {certificate.title}
              </p>
              <p className="text-white/80 text-xs mt-1">
                +{certificate.xpEarned} XP earned
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateNotification;
