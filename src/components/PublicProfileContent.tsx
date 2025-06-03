
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star, Users, Award, BookOpen, Share2, MessageCircle, UserPlus } from 'lucide-react';
import { useCertificates } from '../hooks/useCertificates';
import CertificateCard from './CertificateCard';

interface PublicProfileContentProps {
  isOwnProfile?: boolean;
  userId?: string;
}

const PublicProfileContent = ({ isOwnProfile = true, userId }: PublicProfileContentProps) => {
  const { certificates, isLoading } = useCertificates();

  // Mock user data - in real app this would be fetched based on userId
  const getUserData = (id?: string) => {
    if (!id || isOwnProfile) {
      return {
        name: 'Sandro Williams',
        profilePicture: '/image/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
        interests: ['DeFi & Trading', 'NFTs & Digital Art', 'Smart Contract Development', 'DAO & Governance'],
        bio: 'Passionate blockchain developer and educator. Love helping others learn about the Sui ecosystem.',
        location: 'San Francisco, CA',
        joinDate: '2024-01-15',
        verified: true
      };
    }
    
    // Mock data for other users
    return {
      name: 'Alex Chen',
      profilePicture: '/placeholder-avatar.png',
      interests: ['Smart Contracts', 'Web3 Development', 'Blockchain Security'],
      bio: 'Full-stack blockchain developer with 5+ years of experience.',
      location: 'New York, NY',
      joinDate: '2023-11-20',
      verified: false
    };
  };

  const userSettings = getUserData(userId);

  // Dynamically generated achievements
  const achievements = [
    { id: 1, title: 'First Session Host', icon: '🎯', earned: '2024-01-15', description: 'Hosted your first learning session' },
    { id: 2, title: 'Knowledge Contributor', icon: '📚', earned: '2024-02-20', description: 'Shared 10+ learning resources' },
    { id: 3, title: 'Peer Helper', icon: '🤝', earned: '2024-03-10', description: 'Helped 50+ peers learn' },
    { id: 4, title: 'Session Regular', icon: '⭐', earned: '2024-03-25', description: 'Attended 25+ learning sessions' }
  ];

  // Auto-calculated activity stats
  const totalXPFromCertificates = certificates.reduce((total, cert) => total + cert.xpEarned, 0);
  const activityStats = {
    xpBalance: totalXPFromCertificates + 1000,
    peersConnected: 156,
    coursesCompleted: certificates.filter(cert => cert.type === 'resource').length,
    badgesEarned: achievements.length,
    sessionsHosted: 23,
    materialsShared: 15,
    questionsAnswered: 87,
    peerRating: 4.9,
    certificatesEarned: certificates.length
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={userSettings.profilePicture} />
              <AvatarFallback>{userSettings.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-bold text-white">{userSettings.name}</h1>
                {userSettings.verified && <Award className="w-6 h-6 text-yellow-500" />}
              </div>
              <p className="text-gray-400 mb-2">{userSettings.bio}</p>
              <p className="text-sm text-gray-500 mb-4">
                📍 {userSettings.location} • Joined {new Date(userSettings.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{activityStats.xpBalance.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">XP Balance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{activityStats.peersConnected}</div>
                  <div className="text-sm text-gray-400">Peers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{activityStats.certificatesEarned}</div>
                  <div className="text-sm text-gray-400">Certificates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{activityStats.badgesEarned}</div>
                  <div className="text-sm text-gray-400">Badges</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {!isOwnProfile && (
                  <>
                    <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-700">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-700">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Achievements */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Achievements & Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="text-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <div className="text-sm font-medium text-white">{achievement.title}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(achievement.earned).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Earned Certificates */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                Earned Certificates ({certificates.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-400">Loading certificates...</div>
                </div>
              ) : certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.map((certificate) => (
                    <CertificateCard key={certificate.id} certificate={certificate} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No certificates earned yet</p>
                  <p className="text-gray-500 text-sm mt-2">Complete learning resources or sessions to earn certificates!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Learning Interests */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Learning Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userSettings.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Activity Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Sessions Hosted</span>
                <span className="text-white font-medium">{activityStats.sessionsHosted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Materials Shared</span>
                <span className="text-white font-medium">{activityStats.materialsShared}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Questions Answered</span>
                <span className="text-white font-medium">{activityStats.questionsAnswered}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Peer Rating</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-white font-medium">{activityStats.peerRating}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions (only for own profile) */}
          {isOwnProfile && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-gray-600 text-white hover:bg-gray-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Learning Progress
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-600 text-white hover:bg-gray-700">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Connections
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-600 text-white hover:bg-gray-700">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Resources
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfileContent;
