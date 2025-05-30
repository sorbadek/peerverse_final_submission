
import React, { useState } from 'react';
import { Plus, Eye, EyeOff } from 'lucide-react';

const XPBalanceCard = () => {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg">👑</span>
            <span className="font-medium">X.P Balance:</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="bg-white/20 hover:bg-white/30 transition-colors rounded-full p-2"
              title={showBalance ? "Hide balance" : "Show balance"}
            >
              {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {showBalance ? "17,395.54" : "••••••"}
              </div>
              <div className="text-sm opacity-90">xp</div>
            </div>
          </div>
        </div>
        
        <button className="bg-white/20 hover:bg-white/30 transition-colors rounded-full px-4 py-2 flex items-center space-x-2 mb-6">
          <Plus size={16} />
          <span className="text-sm font-medium">Add More X.P</span>
        </button>
        
        <div>
          <div className="text-lg font-semibold">137 Contributions made</div>
          <div className="text-sm opacity-90">this month!</div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-4 right-8 w-8 h-8 bg-white/10 rounded-full"></div>
    </div>
  );
};

export default XPBalanceCard;
