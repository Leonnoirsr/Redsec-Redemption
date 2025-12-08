'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FRIENDS } from '@/app/constants/friends';
import { ArrowLeft, Trophy, Users, Trash2 } from 'lucide-react';
import { SquadWinForm } from '@/app/components/SquadWinForm';

interface SquadWin {
  id: string;
  players: string[];
  date: string;
  createdAt: string;
}

interface PlayerParticipation {
  username: string;
  squadWins: number;
  headshot?: string;
}

export default function SquadWinsPage() {
  const [squadWins, setSquadWins] = useState<SquadWin[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerParticipation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSquadWins = async () => {
    try {
      const response = await fetch('/api/squad-wins');
      const wins: SquadWin[] = await response.json();
      
      // Sort by date (newest first)
      wins.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setSquadWins(wins);

      // Calculate player participation stats
      const participationMap = new Map<string, number>();
      
      wins.forEach(win => {
        win.players.forEach(player => {
          participationMap.set(player, (participationMap.get(player) || 0) + 1);
        });
      });

      const stats: PlayerParticipation[] = Array.from(participationMap.entries())
        .map(([username, squadWins]) => {
          const friendData = FRIENDS.find(f => f.username.toLowerCase() === username.toLowerCase());
          return {
            username,
            squadWins,
            headshot: friendData?.headshot,
          };
        })
        .sort((a, b) => b.squadWins - a.squadWins);

      setPlayerStats(stats);
    } catch (error) {
      console.error('Error fetching squad wins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSquadWins();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this squad win?')) {
      return;
    }

    // Prompt for admin token if needed
    const adminToken = prompt('Enter admin password to delete:');
    if (!adminToken) {
      return; // User cancelled
    }

    try {
      const response = await fetch(`/api/squad-wins?id=${id}&token=${encodeURIComponent(adminToken)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          alert('Incorrect password. Deletion not authorized.');
        } else {
          throw new Error(errorData.error || 'Failed to delete squad win');
        }
        return;
      }

      fetchSquadWins();
    } catch (error) {
      console.error('Error deleting squad win:', error);
      alert('Failed to delete squad win. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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
            <Trophy className="w-6 h-6 text-red-500" />
            <span>SQUAD WINS</span>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="container mx-auto space-y-8">
        {/* Add New Squad Win Button */}
        <div className="flex justify-center">
          <SquadWinForm onSuccess={fetchSquadWins} />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {/* Top Players by Squad Win Participation */}
            {playerStats.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-red-500" />
                  TOP PLAYERS BY SQUAD WINS
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playerStats.map((player, index) => (
                    <div
                      key={player.username}
                      className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-red-500/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-600">
                          {player.headshot ? (
                            <img
                              src={player.headshot}
                              alt={player.username}
                              className="w-12 h-12 object-cover object-center"
                            />
                          ) : (
                            <Users className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-red-500 font-bold">#{index + 1}</span>
                            <h3 className="text-lg font-bold text-white">{player.username}</h3>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-500">{player.squadWins}</div>
                        <div className="text-sm text-gray-400">Squad Wins</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tracked Squad Wins */}
            {squadWins.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-red-500" />
                  TRACKED SQUAD WINS
                </h2>
                <div className="space-y-4">
                  {squadWins.map((win) => {
                    const friendDataMap = new Map(
                      FRIENDS.map(f => [f.username.toLowerCase(), f])
                    );

                    return (
                      <div
                        key={win.id}
                        className="bg-gray-800 border-2 border-red-500/30 rounded-xl p-6 hover:border-red-500/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-red-900/30 border-2 border-red-500 flex items-center justify-center">
                              <Trophy className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">Squad Win</h3>
                              <p className="text-sm text-gray-400">{formatDate(win.date)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(win.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                            title="Delete this win"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {win.players.map((playerName) => {
                            const friendData = friendDataMap.get(playerName.toLowerCase());
                            const displayImage = friendData?.headshot;

                            return (
                              <div
                                key={playerName}
                                className="bg-gray-900/50 rounded-lg p-3 flex flex-col items-center"
                              >
                                {displayImage && (
                                  <img
                                    src={displayImage}
                                    alt={playerName}
                                    className="w-10 h-10 rounded-full mb-2 object-cover object-center"
                                  />
                                )}
                                <div className="text-sm font-semibold text-white text-center">{playerName}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">No Squad Wins Yet</h3>
                <p className="text-gray-500">
                  Click "New Squad Win" above to start tracking your squad victories!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
