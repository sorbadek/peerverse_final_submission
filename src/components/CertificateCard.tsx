
import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Download, CheckCircle, Award, Video, FileText, Users } from 'lucide-react';
import { Certificate } from '../hooks/useCertificates';

interface CertificateCardProps {
  certificate: Certificate;
}

const CertificateCard = ({ certificate }: CertificateCardProps) => {
  const getTypeIcon = () => {
    if (certificate.type === 'session') {
      return <Users className="w-5 h-5" />;
    }
    
    switch (certificate.resourceType) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const getTypeBadgeColor = () => {
    return certificate.type === 'session' 
      ? 'bg-purple-600/20 text-purple-400 border-purple-600/30'
      : 'bg-blue-600/20 text-blue-400 border-blue-600/30';
  };

  return (
    <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 text-yellow-500">
            {getTypeIcon()}
            <Badge variant="secondary" className={getTypeBadgeColor()}>
              {certificate.type === 'session' ? 'Session' : 'Resource'}
            </Badge>
          </div>
          {certificate.verifiable && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
        </div>
        
        <h3 className="font-medium text-white mb-1 text-sm line-clamp-2">
          {certificate.title}
        </h3>
        
        <p className="text-xs text-gray-400 mb-2">
          Issued by {certificate.issuer} • {certificate.xpEarned} XP earned
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span>Completed: {new Date(certificate.issuedDate).toLocaleDateString()}</span>
          {certificate.sessionDuration && (
            <span>Duration: {certificate.sessionDuration}</span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">ID: {certificate.certificateId}</span>
          <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-600 h-7 px-2 text-xs">
            <Download className="w-3 h-3 mr-1" />
            Verify
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateCard;
