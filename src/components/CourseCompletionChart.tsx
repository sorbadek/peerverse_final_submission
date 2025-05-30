
import React from 'react';

const CourseCompletionChart = () => {
  const stats = [
    { label: 'Completed', value: 54, color: 'bg-green-500' },
    { label: 'In Progress', value: 9, color: 'bg-blue-500' },
    { label: 'Not Completed', value: 27, color: 'bg-red-500' },
    { label: 'Not Started', value: 10, color: 'bg-yellow-500' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Course Completion</h3>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          {/* Animated circular progress */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={351.86}
              strokeDashoffset={161.35}
              className="text-green-500"
              strokeLinecap="round"
            />
            <circle
              cx="64"
              cy="64"
              r="48"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={301.59}
              strokeDashoffset={274.43}
              className="text-blue-500"
              strokeLinecap="round"
            />
            <circle
              cx="64"
              cy="64"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={251.33}
              strokeDashoffset={183.47}
              className="text-red-500"
              strokeLinecap="round"
            />
            <circle
              cx="64"
              cy="64"
              r="32"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={201.06}
              strokeDashoffset={181.00}
              className="text-yellow-500"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              <span className="text-sm text-gray-600">{stat.label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-800">%{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCompletionChart;
