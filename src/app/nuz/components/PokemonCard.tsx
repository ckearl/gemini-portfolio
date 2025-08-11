import React from 'react';
import { Pokemon } from "@/app/nuz/types";

interface PokemonCardProps {
  pokemon: Pokemon | null;
  teamIndex: number;
  slotIndex: number;
  onAddPokemon: (teamIndex: number, slotIndex: number) => void;
  onOpenStats: (pokemon: Pokemon) => void;
  typeColors: Record<string, string>;
}

export default function PokemonCard({
  pokemon,
  teamIndex,
  slotIndex,
  onAddPokemon,
  onOpenStats,
  typeColors
}: PokemonCardProps) {
  if (pokemon) {
    return (
      <div className="w-full h-full flex flex-col relative min-h-[100px]">
        {/* Pokemon Name - at the top */}
        <div className="text-xs font-bold text-white bg-gray-800 px-2 py-1 rounded w-full text-center flex-shrink-0">
          {(pokemon.nickname || pokemon.name).toUpperCase()}
        </div>
        
        {/* Type Badges - in the middle with proper spacing */}
        <div className="mt-2 flex flex-col gap-2 flex-1">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className={`px-2 py-1 rounded text-xs font-bold text-white border-2 border-white text-center flex-shrink-0 ${typeColors[type] || 'bg-gray-500'}`}
            >
              {type.toUpperCase()}
            </span>
          ))}
        </div>
        
        {/* Clickable overlay for stats */}
        <button
          onClick={() => onOpenStats(pokemon)}
          className="absolute inset-0 w-full h-full bg-transparent transition-colors rounded-lg z-10 cursor-pointer"
          title="Click to view stats"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => onAddPokemon(teamIndex, slotIndex)}
      className="w-full h-full bg-gray-700 hover:bg-gray-600 border-2 border-dashed border-gray-500 hover:border-gray-400 rounded-lg flex items-center justify-center transition-colors min-h-[80px]"
    >
      <span className="text-gray-400 text-sm font-bold">+ ADD POKEMON</span>
    </button>
  );
}
