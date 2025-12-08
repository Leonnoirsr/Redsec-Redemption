'use client';

import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { FRIENDS } from '@/app/constants/friends';

interface SquadWinFormProps {
  onSuccess: () => void;
}

export const SquadWinForm: React.FC<SquadWinFormProps> = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availablePlayers = FRIENDS.map(f => f.username);

  const togglePlayer = (username: string) => {
    if (selectedPlayers.includes(username)) {
      setSelectedPlayers(selectedPlayers.filter(p => p !== username));
    } else {
      if (selectedPlayers.length < 4) {
        setSelectedPlayers([...selectedPlayers, username]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPlayers.length === 0) {
      alert('Please select at least one player');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/squad-wins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ players: selectedPlayers }),
      });

      if (!response.ok) {
        throw new Error('Failed to save squad win');
      }

      setSelectedPlayers([]);
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error saving squad win:', error);
      alert('Failed to save squad win. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-lg"
      >
        <Plus className="w-5 h-5" />
        <span>New Squad Win</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Add Squad Win</h3>
          <button
            onClick={() => {
              setIsOpen(false);
              setSelectedPlayers([]);
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Select Players ({selectedPlayers.length}/4)
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {availablePlayers.map((username) => {
                const isSelected = selectedPlayers.includes(username);
                return (
                  <button
                    key={username}
                    type="button"
                    onClick={() => togglePlayer(username)}
                    disabled={!isSelected && selectedPlayers.length >= 4}
                    className={`
                      p-3 rounded-lg border-2 transition-colors text-left
                      ${isSelected
                        ? 'bg-red-900/30 border-red-500 text-white'
                        : selectedPlayers.length >= 4
                        ? 'bg-gray-900/50 border-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:border-gray-600'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{username}</span>
                      {isSelected && <Check className="w-4 h-4 text-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedPlayers.length > 0 && (
            <div className="bg-gray-900/50 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-2">Selected Squad:</div>
              <div className="flex flex-wrap gap-2">
                {selectedPlayers.map((player) => (
                  <span
                    key={player}
                    className="bg-red-900/30 text-red-400 px-2 py-1 rounded text-sm font-medium"
                  >
                    {player}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setSelectedPlayers([]);
              }}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedPlayers.length === 0 || isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Win'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

