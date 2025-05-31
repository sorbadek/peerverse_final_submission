
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star, Users, Award, BookOpen, Download, Share2, CheckCircle } from 'lucide-react';

interface PublicProfileContentProps {
  isOwnProfile?: boolean;
}

const PublicProfileContent = ({ isOwnProfile = true }: PublicProfileContentProps) => {
  // User data that would come from settings
  const userSettings = {
    name: 'Sandro Williams',
    profilePicture: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
    interests: ['DeFi & Trading', 'NFTs & Digital Art', 'Smart Contract Development', 'DAO & Governance']
  };

  // Dynamically generated achievements based on user activity
  const achievements = [
    { id: 1, title: 'First Session Host', icon: '🎯', earned: '2024-01-15', description: 'Hosted your first learning session' },
    { id: 2, title: 'Knowledge Contributor', icon: '📚', earned: '2024-02-20', description: 'Shared 10+ learning resources' },
    { id: 3, title: 'Peer Helper', icon: '🤝', earned: '2024-03-10', description: 'Helped 50+ peers learn' },
    { id: 4, title: 'Session Regular', icon: '⭐', earned: '2024-03-25', description: 'Attended 25+ learning sessions' }
  ];

  // Auto-generated certificates based on completed learning paths
  const completedCourses = [
    {
      id: 1,
      title: 'Sui Move Programming Fundamentals',
      issuer: 'PeerVerse',
      completedDate: '2024-03-20',
      certificateId: 'PV-SUI-2024-001',
      verifiable: true,
      xpEarned: 500
    },
    {
      id: 2,
      title: 'zkLogin Integration Mastery',
      issuer: 'PeerVerse',
      completedDate: '2024-02-15',
      certificateId: 'PV-ZK-2024-002',
      verifiable: true,
      xpEarned: 350
    },
    {
      id: 3,
      title: 'DeFi on Sui Blockchain',
      issuer: 'PeerVerse',
      completedDate: '2024-01-30',
      certificateId: 'PV-DEFI-2024-003',
      verifiable: true,
      xpEarned: 600
    }
  ];

  // Auto-calculated activity stats based on user engagement
  const activityStats = {
    xpBalance: completedCourses.reduce((total, course) => total + course.xpEarned, 0) + 1000, // Base + earned
    peersConnected: 156,
    coursesCompleted: completedCourses.length,
    badgesEarned: achievements.length,
    sessionsHosted: 23,
    materialsShared: 15,
    questionsAnswered: 87,
    peerRating: 4.9
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
                <Award className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-gray-400 mb-4">Sui Blockchain Enthusiast & DeFi Explorer</p>
              
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
                  <div className="text-2xl font-bold text-purple-400">{activityStats.coursesCompleted}</div>
                  <div className="text-sm text-gray-400">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{activityStats.badgesEarned}</div>
                  <div className="text-sm text-gray-400">Badges</div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {!isOwnProfile && (
                  <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-700">
                    <Users className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
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
                  <div key={achievement.id} className="text-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
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

          {/* Completed Courses & Certificates */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                Sui Blockchain Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedCourses.map((course) => (
                  <div key={course.id} className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">Issued by {course.issuer} • {course.xpEarned} XP earned</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>Completed: {new Date(course.completedDate).toLocaleDateString()}</span>
                          <span>ID: {course.certificateId}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {course.verifiable && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-600">
                          <Download className="w-4 h-4 mr-1" />
                          Verify
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Learning Interests from Settings */}
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

          {/* Auto-calculated Activity Stats */}
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
        </div>
      </div>
    </div>
  );
};

export default PublicProfileContent;
