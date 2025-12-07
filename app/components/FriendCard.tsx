import React    from 'react';
import Link     from 'next/link';
import { User } from 'lucide-react';

interface FriendCardProps {
  username: string;
  platform: string;
  kd?: string;
  wl?: string;
  rank?: string;
  avatarUrl?: string;
  customImage?: string;
}

export const FriendCard: React.FC<FriendCardProps> = ({ username, platform, kd, wl, rank, avatarUrl, customImage }) => {
  const displayImage = customImage || avatarUrl;

  return (
    <Link href={`/stats/${platform}/${username}`}>
      <div className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-xl p-6 transition-all hover:border-red-500/50 hover:shadow-lg group cursor-pointer">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-600 group-hover:border-red-500 transition-colors">
            {displayImage ? (
              <img 
                src={displayImage} 
                alt={username} 
                className="w-12 h-12 object-cover object-center" 
              />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">{username}</h3>
            <p className="text-xs text-gray-400 uppercase">{platform}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-900/50 p-2 rounded-lg">
            <div className="text-xs text-gray-500">K/D</div>
            <div className="font-semibold text-white">{kd || '-'}</div>
          </div>
          <div className="bg-gray-900/50 p-2 rounded-lg">
             <div className="text-xs text-gray-500">Win %</div>
             <div className="font-semibold text-white">{wl || '-'}</div>
          </div>
           <div className="bg-gray-900/50 p-2 rounded-lg">
             <div className="text-xs text-gray-500">Rank</div>
             <div className="font-semibold text-white">
               {rank ? `#${rank}` : '-'}
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

