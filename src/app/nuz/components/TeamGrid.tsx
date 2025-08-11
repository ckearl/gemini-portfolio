import React from 'react';
import { Team, Pokemon } from "@/app/nuz/types";
import PokemonCard from './PokemonCard';

interface TeamGridProps {
  team: Team;
  teamIndex: number;
  onAddPokemon: (teamIndex: number, slotIndex: number) => void;
  onOpenStats: (pokemon: Pokemon) => void;
  onTrainerNameChange: (teamIndex: number, name: string) => void;
  onOpenInventory: () => void;
  typeColors: Record<string, string>;
}

export default function TeamGrid({
  team,
  teamIndex,
  onAddPokemon,
  onOpenStats,
  onTrainerNameChange,
  onOpenInventory,
  typeColors
}: TeamGridProps) {
  // Different background colors for each team
  const teamBackgrounds = [
    'bg-blue-400 border-blue-500', // Player 1 (My Team) - Blue theme
    'bg-purple-400 border-purple-500' // Player 2 (Friend's Team) - Purple theme
  ];
  
  const currentBackground = teamBackgrounds[teamIndex] || 'bg-gray-800 border-gray-600';

  return (
    <div className={`${currentBackground} border-4 rounded-lg p-4`}>
      {/* Team Header */}
      <div className="mb-4">
        <input
          type="text"
          value={team.trainer}
          onChange={(e) => onTrainerNameChange(teamIndex, e.target.value)}
          className="text-xl font-bold text-white bg-transparent border-b-2 border-transparent focus:border-yellow-400 focus:outline-none text-center w-full"
          placeholder="Enter Trainer Name"
        />
      </div>
      
      {/* Pokemon Grid */}
      <div className="grid grid-cols-3 grid-rows-2 gap-2 mb-4">
        {team.pokemon.map((pokemon, slotIndex) => (
          <div key={slotIndex} className="bg-gray-700 border-2 border-gray-500 rounded-lg p-2">
            <PokemonCard
              pokemon={pokemon}
              teamIndex={teamIndex}
              slotIndex={slotIndex}
              onAddPokemon={onAddPokemon}
              onOpenStats={onOpenStats}
              typeColors={typeColors}
            />
          </div>
        ))}
      </div>

      {/* Inventory Button */}
      <div className="text-center">
        <button
          onClick={onOpenInventory}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded border-2 border-yellow-800 hover:border-yellow-700 transition-colors"
        >
          VIEW INVENTORY
        </button>
      </div>
    </div>
  );
}
