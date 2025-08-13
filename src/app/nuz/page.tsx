'use client';

import { useState, useCallback } from 'react';
import { Team } from './types';
import { defaultTeams } from './constants/pokemonData';
import { AuthProvider } from './auth/AuthContext';
import UserStatus from './components/UserStatus';
import SaveStatus from './components/SaveStatus';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';

export default function SoulLinkPage() {
  const [teams, setTeams] = useState<Team[]>(defaultTeams);

  const handleTeamsChange = useCallback((newTeams: Team[]) => {
    setTeams(newTeams);
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-b from-sky-300 to-green-400 font-mono">
        {/* Battle Arena Background */}
        <div className="relative min-h-screen">
          {/* Sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-green-300"></div>
          
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-600 via-green-500 to-green-400"></div>
          
          {/* Grass patches */}
          <div className="absolute bottom-0 left-1/4 w-32 h-16 bg-green-500 rounded-full opacity-80"></div>
          <div className="absolute bottom-0 right-1/4 w-32 h-16 bg-green-500 rounded-full opacity-80"></div>
          
          <div className="relative z-10 p-4 min-h-screen">
            <div className="max-w-6xl mx-auto">
              {/* Title Bar - styled like Pokemon health bar */}
              <div className="flex justify-center items-center">
                <div className="bg-gray-700 border-4 border-gray-800 rounded-lg p-4 mb-6 text-center">
                  <h1 className="text-3xl font-bold text-white tracking-wider">
                    POKENUZLOCK(ED IN)
                  </h1>
                </div>
              </div>
              
              {/* Game Board */}
              <GameBoard 
                teams={teams} 
                onTeamsChange={handleTeamsChange} 
              />
            </div>
          </div>
        </div>
        
        {/* UI Components */}
        <UserStatus />
        <SaveStatus teams={teams} onTeamsLoad={handleTeamsChange} />
        <GameControls />
      </div>
    </AuthProvider>
  );
}
