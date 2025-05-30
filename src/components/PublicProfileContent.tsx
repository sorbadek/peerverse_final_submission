
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star, Users, Award, BookOpen, Download, Share2, CheckCircle } from 'lucide-react';

const PublicProfileContent = () => {
  const achievements = [
    { id: 1, title: 'React Master', icon: '⚛️', earned: '2024-01-15' },
    { id: 2, title: 'Community Helper', icon: '🤝', earned: '2024-02-20' },
    { id: 3, title: 'Content Creator', icon: '✍️', earned: '2024-03-10' },
    { id: 4, title: 'Peer Mentor', icon: '👨‍🏫', earned: '2024-03-25' }
  ];

  const completedCourses = [
    {
      id: 1,
      title: 'Advanced React Development',
      issuer: 'PeerVerse',
      completedDate: '2024-03-20',
      certificateId: 'PV-REACT-2024-001',
      verifiable: true
    },
    {
      id: 2,
      title: 'Machine Learning Fundamentals',
      issuer: 'PeerVerse',
      completedDate: '2024-02-15',
      certificateId: 'PV-ML-2024-002',
      verifiable: true
    },
    {
      id: 3,
      title: 'UI/UX Design Principles',
      issuer: 'PeerVerse',
      completedDate: '2024-01-30',
      certificateId: 'PV-UXUI-2024-003',
      verifiable: true
    }
  ];

  const skills = [
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 
    'Machine Learning', 'UI/UX Design', 'Data Analysis'
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png" />
              <AvatarFallback>SW</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-bold text-white">Sandro Williams</h1>
                <Award className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-gray-400 mb-4">Full-Stack Developer & AI Enthusiast</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">2,450</div>
                  <div className="text-sm text-gray-400">XP Balance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">156</div>
                  <div className="text-sm text-gray-400">Peers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">12</div>
                  <div className="text-sm text-gray-400">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">8</div>
                  <div className="text-sm text-gray-400">Badges</div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Connect
                </Button>
                <Button variant="outline" size="sm">
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
                  <div key={achievement.id} className="text-center p-3 bg-gray-700 rounded-lg">
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
                Digital Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedCourses.map((course) => (
                  <div key={course.id} className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">Issued by {course.issuer}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>Completed: {new Date(course.completedDate).toLocaleDateString()}</span>
                          <span>ID: {course.certificateId}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {course.verifiable && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        <Button size="sm" variant="outline">
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
          {/* Skills */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Certified Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-600/20 text-blue-400">
                    {skill}
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
                <span className="text-white font-medium">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Materials Shared</span>
                <span className="text-white font-medium">15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Questions Answered</span>
                <span className="text-white font-medium">87</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Peer Rating</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-white font-medium">4.9</span>
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
