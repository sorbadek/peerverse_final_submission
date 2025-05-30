
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const TimeSpentChart = () => {
  const data = [
    { day: 'SAT', hours: 2 },
    { day: 'SUN', hours: 4 },
    { day: 'MON', hours: 3 },
    { day: 'TUE', hours: 3.5 },
    { day: 'WED', hours: 5 },
    { day: 'THU', hours: 4 },
    { day: 'FRI', hours: 3.5 },
  ];

  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Time Spent</h3>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis hide />
            <Bar 
              dataKey="hours" 
              fill="#60A5FA"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Week</span>
        <span>Month</span>
        <span>Year</span>
      </div>
    </div>
  );
};

export default TimeSpentChart;
