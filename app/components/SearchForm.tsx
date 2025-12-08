'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export const SearchForm = () => {
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState('psn');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setLoading(true);
    // Normalize platform: tracker.gg typically uses 'psn' for PlayStation
    router.push(`/stats/${platform}/${encodeURIComponent(username)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col gap-4">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Enter PSN Username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          />
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
        </div>
        
        {/* Platform selection could be added here if expanding beyond PSN */}
        {/* For now, it defaults to PSN as per user request */}
        
        <button
          type="submit"
          disabled={loading || !username}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'View Stats'}
        </button>
      </div>
    </form>
  );
};


