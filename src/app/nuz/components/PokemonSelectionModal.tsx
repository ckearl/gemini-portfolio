import React from 'react';
import { Pokemon } from '@/app/nuz/types';

interface PokemonSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPokemon: (pokemon: Pokemon) => void;
  defaultPokemon: Pokemon[];
  typeColors: Record<string, string>;
}

export default function PokemonSelectionModal({
  isOpen,
  onClose,
  onSelectPokemon,
  defaultPokemon,
  typeColors
}: PokemonSelectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-700 border-4 border-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">SELECT POKEMON</h2>
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded border-2 border-red-800"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {defaultPokemon.map((pokemon) => (
            <button
              key={pokemon.id}
              onClick={() => {
                onSelectPokemon(pokemon);
                onClose();
              }}
              className="bg-gray-800 border-2 border-gray-600 rounded-lg p-3 hover:border-yellow-400 transition-colors"
            >
              <div className="text-center">
                <div className="text-sm font-bold text-white mb-2">{pokemon.name.toUpperCase()}</div>
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
              </div>
            </button>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded border-2 border-gray-800 hover:border-gray-600"
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}
