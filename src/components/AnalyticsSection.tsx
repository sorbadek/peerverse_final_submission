
import React from 'react';
import TimeSpentChart from './TimeSpentChart';
import CourseCompletionChart from './CourseCompletionChart';

const AnalyticsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TimeSpentChart />
      <CourseCompletionChart />
    </div>
  );
};

export default AnalyticsSection;
