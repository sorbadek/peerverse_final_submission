
import React from 'react';
import { Play } from 'lucide-react';

const ContinueLearning = () => {
  const courses = [
    {
      title: "Beginner's Guide To Becoming A Professional Frontend Developer",
      author: "Mohammad Shams Tabrez",
      role: "UI / UX Designer",
      level: "BEGINNER",
      image: "/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png",
      progress: 0,
      bgColor: "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    {
      title: "How To Create Your Portfolio Website",
      author: "Sarah Johnson",
      role: "Frontend Developer", 
      level: "INTERMEDIATE",
      image: "/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png",
      progress: 45,
      bgColor: "bg-gradient-to-br from-orange-400 to-yellow-500"
    },
    {
      title: "Beginner's Guide To Becoming A Professional Frontend Developer",
      author: "Prashant Kumar Singh",
      role: "Software Developer",
      level: "FRONTEND",
      image: "/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png", 
      progress: 75,
      bgColor: "bg-gradient-to-br from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Continue Learning</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course, index) => (
          <div key={index} className="bg-white rounded-xl p-4 hover:shadow-lg transition-shadow">
            <div className={`${course.bgColor} rounded-lg p-4 mb-4 relative overflow-hidden`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white bg-white/20 px-2 py-1 rounded">
                  {course.level}
                </span>
                <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Play size={14} className="text-white ml-0.5" />
                </button>
              </div>
              <div className="mt-8">
                <div className="w-full bg-white/20 rounded-full h-1">
                  <div 
                    className="bg-white h-1 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-800 text-sm mb-3 line-clamp-2">
              {course.title}
            </h3>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              <div>
                <div className="text-xs font-medium text-gray-800">{course.author}</div>
                <div className="text-xs text-gray-500">{course.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueLearning;
