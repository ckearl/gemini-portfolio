import React from 'react';
import { Team, Pokemon } from '@/app/nuz/types';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  allPokemon: Pokemon[];
  typeColors: Record<string, string>;
}

export default function InventoryModal({
  isOpen,
  onClose,
  team,
  allPokemon,
  typeColors
}: InventoryModalProps) {
  if (!isOpen) return null;

  // Get all Pokemon that are currently in use by either team
  const getUsedPokemonSpecies = () => {
    const usedSpecies = new Set<string>();
    team.pokemon.forEach(pokemon => {
      if (pokemon) {
        usedSpecies.add(pokemon.name);
      }
    });
    return usedSpecies;
  };

  const usedSpecies = getUsedPokemonSpecies();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-700 border-4 border-gray-800 rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{team.trainer}&apos;s INVENTORY</h2>
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded border-2 border-red-800"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {allPokemon.map((pokemon) => {
            const isOwned = usedSpecies.has(pokemon.name);
            return (
              <div
                key={pokemon.id}
                className={`border-2 rounded-lg p-3 ${
                  isOwned 
                    ? 'bg-green-800 border-green-600' 
                    : 'bg-gray-800 border-gray-600'
                }`}
              >
                <div className="text-center">
                  <div className="text-sm font-bold text-white mb-2">
                    {pokemon.name.toUpperCase()}
                    {isOwned && <span className="text-green-400 ml-2">✓</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    {pokemon.types.map((type: string) => (
                      <span
                        key={type}
                        className={`px-2 py-1 rounded text-xs font-bold text-white border border-white ${typeColors[type] || 'bg-gray-500'}`}
                      >
                        {type.toUpperCase()}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-300 mt-2">
                    {isOwned ? 'OWNED' : 'NOT CAUGHT'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded border-2 border-gray-800 hover:border-gray-600"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}
