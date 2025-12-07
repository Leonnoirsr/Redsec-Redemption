'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FRIENDS } from '@/app/constants/friends';
import { FriendCard } from '@/app/components/FriendCard';
import { ArrowLeft, Users } from 'lucide-react';
import { fetchPlayerStats } from '@/app/lib/stats-fetcher';

export default function FriendsPage() {
  const [friendsData, setFriendsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllFriends = async () => {
      // Create an array of promises for fetching each friend's stats
      const promises = FRIENDS.map(async (friend) => {
        try {
          // Fetch using the unified stats-fetcher utility
          // This checks NEXT_PUBLIC_USE_MOCK_DATA env var and uses mock data or live API
          const result = await fetchPlayerStats(friend.platform, friend.username);
          return { ...friend, data: result.data };
        } catch (error) {
          console.error(`Error fetching stats for ${friend.username}:`, error);
          return { ...friend, data: null, error: true };
        }
      });

      const results = await Promise.all(promises);
      
      // Extract Battle Royale wins and sort by wins (descending)
      const friendsWithWins = results.map((friend) => {
        const segments = friend.data?.segments || [];
        const battleRoyaleSegment = segments.find((s: any) => {
          const type = s.type?.toLowerCase();
          const name = s.metadata?.name?.toLowerCase() || '';
          return type === 'battle-royale' || type === 'br' || name.includes('battle royale');
        });
        
        // Get wins from Battle Royale stats, or 0 if not available
        const wins = battleRoyaleSegment?.stats?.wins?.value || 
                    battleRoyaleSegment?.stats?.matchesWon?.value || 
                    0;
        
        return {
          ...friend,
          wins: wins,
          winsDisplay: battleRoyaleSegment?.stats?.wins?.displayValue || 
                      battleRoyaleSegment?.stats?.matchesWon?.displayValue || 
                      '0'
        };
      });
      
      // Sort by wins (descending) - highest wins first
      friendsWithWins.sort((a, b) => b.wins - a.wins);
      
      // Assign ranks (1-based)
      const friendsWithRanks = friendsWithWins.map((friend, index) => ({
        ...friend,
        rank: index + 1
      }));
      
      setFriendsData(friendsWithRanks);
      setLoading(false);
    };

    fetchAllFriends();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
       {/* Header */}
       <div className="container mx-auto mb-8">
         <div className="flex items-center justify-between py-4 border-b border-gray-800">
           <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
             <ArrowLeft className="w-5 h-5" />
             <span>Back to Search</span>
           </Link>
           <div className="flex items-center gap-2 text-xl font-bold">
             <Users className="w-6 h-6 text-red-500" />
             <span>SQUAD STATS</span>
           </div>
           <div className="w-20"></div>
         </div>
       </div>

       <div className="container mx-auto">
         {loading ? (
           <div className="flex justify-center py-12">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {friendsData.map((friend) => {
               // Find the best segment for stats (Battle Royale or Overview)
               const segments = friend.data?.segments || [];
               
               // Prioritize Battle Royale stats if available
               const battleRoyaleSegment = segments.find((s: any) => {
                 const type = s.type?.toLowerCase();
                 const name = s.metadata?.name?.toLowerCase() || '';
                 return type === 'battle-royale' || type === 'br' || name.includes('battle royale');
               });
               
               // Fallback to overview
               const overviewSegment = segments.find((s: any) => s.type === 'overview');
               
               const stats = battleRoyaleSegment?.stats || overviewSegment?.stats;
               
               return (
                 <FriendCard
                   key={`${friend.platform}-${friend.username}`}
                   username={friend.username}
                   platform={friend.platform}
                   avatarUrl={friend.data?.platformInfo.avatarUrl}
                   customImage={friend.headshot}
                   kd={stats?.kdRatio?.displayValue}
                   wl={stats?.wlPercentage?.displayValue || stats?.wins?.displayValue} // Use Wins if Win % not available for BR
                   rank={friend.rank?.toString()} // Rank based on Battle Royale wins (1, 2, 3, etc.)
                 />
               );
             })}
           </div>
         )}

         {!loading && friendsData.length === 0 && (
           <div className="text-center text-gray-500 mt-12">
             No friends configured. Add usernames to constants/friends.ts
           </div>
         )}
       </div>
    </div>
  );
}
