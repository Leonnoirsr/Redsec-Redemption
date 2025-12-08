'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { StatsCard } from '@/app/components/ui/StatsCard';
import { WeaponCard } from '@/app/components/ui/WeaponCard';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { FRIENDS } from '@/app/constants/friends';
import { fetchPlayerStats } from '@/app/lib/stats-fetcher';

interface StatsPageProps {
  params: Promise<{ platform: string; username: string }>;
}

export default function StatsPage({ params }: StatsPageProps) {
  // Unwrap the params Promise using React.use()
  const { platform, username } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch stats using the unified stats-fetcher utility
    // This checks NEXT_PUBLIC_USE_MOCK_DATA env var and uses mock data or live API
    const fetchStats = async () => {
      try {
        const result = await fetchPlayerStats(platform, username);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [platform, username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Player Not Found</h1>
        <p className="text-gray-400 mb-4 text-center max-w-md">
          Could not retrieve stats for {decodeURIComponent(username)} on {platform}.
        </p>
        {error && (
          <p className="text-gray-500 mb-6 text-sm text-center max-w-md">
            Error: {error}
          </p>
        )}
        <Link href="/" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  const { platformInfo, segments } = data.data;
  const overview = segments.find((s: any) => s.type === 'overview');
  const stats = overview?.stats;
  
  // Find if this user is a friend and has a full body image
  const friendData = FRIENDS.find(f => f.username.toLowerCase() === decodeURIComponent(username).toLowerCase());
  const fullBodyImage = friendData?.fullBody;
  
  // Find Battle Royale segment - check multiple possible types and names
  const battleRoyaleSegment = segments.find((s: any) => {
    const type = s.type?.toLowerCase();
    const name = s.metadata?.name?.toLowerCase() || '';
    
    return (
      type === 'battle-royale' ||
      type === 'br' ||
      name.includes('battle royale') ||
      name.includes('battle royale') ||
      (type === 'gamemode' && name.includes('royale'))
    );
  });
  
  const brStats = battleRoyaleSegment?.stats;
  
  // Extract weapon segments and sort by kills (most used)
  const weaponSegments = segments
    .filter((s: any) => s.type === 'weapon')
    .map((s: any) => ({
      name: s.metadata?.name || 'Unknown Weapon',
      imageUrl: s.metadata?.imageUrl,
      kills: s.stats?.kills?.value || 0,
      killsDisplay: s.stats?.kills?.displayValue,
    }))
    .filter((w: any) => w.kills > 0) // Only show weapons with kills
    .sort((a: any, b: any) => b.kills - a.kills) // Sort by kills descending
    .slice(0, 4); // Get top 4 weapons
  
  // Debug log if BR stats found
  if (brStats) {
    console.log('Battle Royale stats found:', Object.keys(brStats));
  } else {
    console.log('Battle Royale segment not found. Available segments:', segments.map((s: any) => ({
      type: s.type,
      name: s.metadata?.name
    })));
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-12">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Search</span>
          </Link>
          <div className="font-bold text-xl">REDSEC <span className="text-red-600">REDEMPTION</span></div>
          <div className="w-20"></div> {/* Spacer */}
        </div>
      </div>

      <div className="container mx-auto p-4 sm:p-6 pt-8">
        {/* Profile Header & Soldier Image Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start mb-8">
          {/* Left Column: Soldier Image (if available) or Profile Header */}
          {fullBodyImage ? (
            <div className="w-full lg:w-1/4 flex flex-col items-center">
              <div className="relative w-full aspect-[3/4] max-w-xs mx-auto">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10 rounded-2xl"></div>
                <img 
                  src={fullBodyImage} 
                  alt={platformInfo.platformUserHandle} 
                  className="w-full h-full object-cover object-top rounded-2xl shadow-2xl border border-gray-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-center">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{platformInfo.platformUserHandle}</h1>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full lg:w-1/4">
              <div className="flex flex-col items-center gap-4 bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-gray-700 bg-gray-800 shadow-xl">
                  <img 
                    src={platformInfo.avatarUrl} 
                    alt={platformInfo.platformUserHandle} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{platformInfo.platformUserHandle}</h1>
                </div>
              </div>
            </div>
          )}

          {/* Right Column: Stats */}
          <div className="w-full lg:w-3/4">
            {/* Battle Royale Stats - Most Important Section */}
            {brStats && (
              <div className="space-y-4 mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-red-500">🏆</span>
                  BATTLE ROYALE STATS
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {brStats.wins?.displayValue && brStats.wins.displayValue !== 'N/A' && (
                <StatsCard 
                  title="Wins" 
                  value={brStats.wins.displayValue} 
                  percentile={brStats.wins?.percentile}
                  rank={brStats.wins?.rank}
                  className="bg-red-900/30 border-2 border-red-600"
                />
              )}
              {/* Check for alternative win stats if main one is missing */}
              {(!brStats.wins?.displayValue || brStats.wins.displayValue === 'N/A') && brStats.matchesWon?.displayValue && brStats.matchesWon.displayValue !== 'N/A' && (
                <StatsCard 
                  title="Wins" 
                  value={brStats.matchesWon.displayValue} 
                  percentile={brStats.matchesWon?.percentile}
                  rank={brStats.matchesWon?.rank}
                  className="bg-red-900/30 border-2 border-red-600"
                />
              )}
              
              {brStats.wlPercentage?.displayValue && brStats.wlPercentage.displayValue !== 'N/A' && (
                <StatsCard 
                  title="Win %" 
                  value={brStats.wlPercentage.displayValue} 
                  percentile={brStats.wlPercentage?.percentile}
                  rank={brStats.wlPercentage?.rank}
                  className="bg-red-900/30 border-2 border-red-600"
                />
              )}
              
              {brStats.matchesPlayed?.displayValue && brStats.matchesPlayed.displayValue !== 'N/A' && (
                <StatsCard 
                  title="Matches Played" 
                  value={brStats.matchesPlayed.displayValue} 
                  percentile={brStats.matchesPlayed?.percentile}
                  rank={brStats.matchesPlayed?.rank}
                  className="bg-red-900/30 border-2 border-red-600"
                />
              )}
              
              {brStats.kdRatio?.displayValue && brStats.kdRatio.displayValue !== 'N/A' && (
                <StatsCard 
                  title="K/D Ratio" 
                  value={brStats.kdRatio.displayValue} 
                  percentile={brStats.kdRatio?.percentile}
                  rank={brStats.kdRatio?.rank}
                  className="bg-red-900/30 border-2 border-red-600"
                />
              )}
              
              {brStats.kills?.displayValue && brStats.kills.displayValue !== 'N/A' && (
                <StatsCard 
                  title="Kills" 
                  value={brStats.kills.displayValue} 
                  percentile={brStats.kills?.percentile}
                  rank={brStats.kills?.rank}
                  className="bg-red-900/30 border-2 border-red-600"
                />
              )}
              
              {brStats.assists?.displayValue && brStats.assists.displayValue !== 'N/A' && (
                <StatsCard 
                  title="Assists" 
                  value={brStats.assists.displayValue} 
                  percentile={brStats.assists?.percentile}
                  rank={brStats.assists?.rank}
                  className="bg-red-900/30 border-2 border-red-600"
                />
              )}
              
              {brStats.top10s?.displayValue && brStats.top10s.displayValue !== 'N/A' && (
                <StatsCard 
                  title="Top 10s" 
                  value={brStats.top10s.displayValue} 
                  percentile={brStats.top10s?.percentile}
                  rank={brStats.top10s?.rank}
                  className="bg-red-900/30 border-2 border-red-600"
                />
              )}
              
              {brStats.scorePerMinute?.displayValue && brStats.scorePerMinute.displayValue !== 'N/A' && (
                <StatsCard 
                  title="Score/Min" 
                  value={brStats.scorePerMinute.displayValue} 
                  percentile={brStats.scorePerMinute?.percentile}
                  rank={brStats.scorePerMinute?.rank}
                  className="bg-red-900/30 border-2 border-red-600"
                />
              )}

              {/* Overall Stats - K/D and Time Played - Placed directly below Battle Royale stats */}
              {stats?.kdRatio?.displayValue && stats.kdRatio.displayValue !== 'N/A' && (
                <StatsCard 
                  title="K/D Ratio" 
                  value={stats.kdRatio.displayValue} 
                  percentile={stats.kdRatio?.percentile}
                  rank={stats.kdRatio?.rank}
                  className="bg-gray-800/80"
                />
              )}
              {stats?.timePlayed?.displayValue && stats.timePlayed.displayValue !== 'N/A' && (
                <StatsCard 
                  title="Time Played" 
                  value={stats.timePlayed.displayValue} 
                  percentile={stats.timePlayed?.percentile}
                  rank={stats.timePlayed?.rank}
                  className="bg-gray-800/80"
                />
              )}
                </div>
              </div>
            )}

            {/* Show overall stats even if BR stats are not available */}
            {!brStats && stats && (
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {stats.kdRatio?.displayValue && stats.kdRatio.displayValue !== 'N/A' && (
                <StatsCard 
                  title="K/D Ratio" 
                  value={stats.kdRatio.displayValue} 
                  percentile={stats.kdRatio?.percentile}
                  rank={stats.kdRatio?.rank}
                  className="bg-gray-800/80"
                />
              )}
              {stats.timePlayed?.displayValue && stats.timePlayed.displayValue !== 'N/A' && (
                <StatsCard 
                  title="Time Played" 
                  value={stats.timePlayed.displayValue} 
                  percentile={stats.timePlayed?.percentile}
                  rank={stats.timePlayed?.rank}
                  className="bg-gray-800/80"
                />
              )}
                </div>
              </div>
            )}

            {/* Favorites Section - Most Used Weapons */}
            {weaponSegments.length > 0 && (
              <div className="space-y-4 mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-red-500">⭐</span>
                  FAVORITES
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
                  {weaponSegments.map((weapon: any, index: number) => (
                    <WeaponCard
                      key={index}
                      name={weapon.name}
                      imageUrl={weapon.imageUrl}
                      kills={weapon.killsDisplay}
                      className="bg-gray-800/80"
                    />
                  ))}
                </div>
              </div>
            )}
            
            {!stats && !brStats && (
              <div className="text-center text-gray-400 py-12">No stats available for this player.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
