
import React, { useState } from 'react';
import { Users, Plus, Search } from 'lucide-react';
import { useSocial } from './SocialContext';

const GroupsPanel = () => {
  const { groups, joinGroup } = useSocial();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Technology', 'Environment', 'Humanities', 'Science'];

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Discover Groups</h2>
        
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search groups..."
              className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 mb-6">
          <Plus size={16} />
          <span>Create New Group</span>
        </button>
      </div>

      <div className="grid gap-4">
        {filteredGroups.map((group) => (
          <div key={group.id} className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <img
                src={group.avatar}
                alt={group.name}
                className="w-16 h-16 rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{group.name}</h3>
                    <p className="text-gray-300 text-sm mb-2">{group.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users size={14} />
                        <span>{group.members.toLocaleString()} members</span>
                      </div>
                      <span className="bg-gray-800 px-2 py-1 rounded text-xs">{group.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => joinGroup(group.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      group.isJoined
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {group.isJoined ? 'Joined' : 'Join'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsPanel;
