
import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Award } from 'lucide-react';

const XPContributionTracker = () => {
  // Mock user data - in real app this would come from backend
  const userXP = 1250;
  const monthlyContributions = 8;
  const monthlyConsumption = 12;
  const netXPChange = +45; // positive means gaining XP
  const riskLevel = userXP < 500 ? 'high' : userXP < 1000 ? 'medium' : 'low';

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Current XP */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Award className="h-5 w-5 text-yellow-400 mr-2" />
            <span className="text-gray-400 text-sm">Current XP</span>
          </div>
          <div className="text-2xl font-bold text-white">{userXP.toLocaleString()}</div>
          <div className={`text-sm flex items-center justify-center mt-1 ${
            netXPChange >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {netXPChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {netXPChange >= 0 ? '+' : ''}{netXPChange} this month
          </div>
        </div>

        {/* Contributions */}
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-2">Sessions Hosted</div>
          <div className="text-2xl font-bold text-green-400">{monthlyContributions}</div>
          <div className="text-xs text-gray-500 mt-1">this month</div>
        </div>

        {/* Consumption */}
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-2">Sessions Attended</div>
          <div className="text-2xl font-bold text-blue-400">{monthlyConsumption}</div>
          <div className="text-xs text-gray-500 mt-1">this month</div>
        </div>

        {/* Balance Status */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            {riskLevel === 'high' && <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />}
            <span className="text-gray-400 text-sm">Balance Status</span>
          </div>
          <div className={`text-sm font-medium px-3 py-1 rounded-full ${
            riskLevel === 'low' ? 'bg-green-900 text-green-300' :
            riskLevel === 'medium' ? 'bg-yellow-900 text-yellow-300' :
            'bg-red-900 text-red-300'
          }`}>
            {riskLevel === 'low' ? 'Healthy' : riskLevel === 'medium' ? 'Watch' : 'Critical'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {riskLevel === 'low' ? 'Keep contributing!' : 
             riskLevel === 'medium' ? 'Host more sessions' : 
             'XP running low'}
          </div>
        </div>
      </div>

      {/* Warning Message for Low XP */}
      {riskLevel === 'high' && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
          <div className="flex items-center text-red-300 text-sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="font-medium">XP Critical Level:</span>
          </div>
          <p className="text-red-200 text-sm mt-1">
            Your XP is running low. Host more sessions or contribute solutions to avoid reaching zero XP, 
            which would require purchasing more XP to continue learning.
          </p>
        </div>
      )}

      {/* Information Box */}
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
        <p className="text-blue-200 text-sm">
          <span className="font-medium">How it works:</span> Attending sessions consumes XP, hosting sessions earns XP. 
          Keep your contribution-to-consumption ratio balanced to maintain healthy XP levels.
        </p>
      </div>
    </div>
  );
};

export default XPContributionTracker;
