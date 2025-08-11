import React from 'react';
import { Pokemon, Team } from "@/app/nuz/types";

interface PokemonStatsModalProps {
  pokemon: Pokemon;
  onClose: () => void;
  onUpdateNickname: (teamIndex: number, slotIndex: number, nickname: string) => void;
  onRemovePokemon: (teamIndex: number, slotIndex: number) => void;
  teams: Team[];
  typeColors: Record<string, string>;
}

export default function PokemonStatsModal({
  pokemon,
  onClose,
  onUpdateNickname,
  onRemovePokemon,
  teams,
  typeColors
}: PokemonStatsModalProps) {
  const handleNicknameChange = (newNickname: string) => {
    // Find the Pokemon in the teams to update it
    for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
      const slotIndex = teams[teamIndex].pokemon.findIndex((p: Pokemon | null) => p?.id === pokemon.id);
      if (slotIndex !== -1) {
        onUpdateNickname(teamIndex, slotIndex, newNickname);
        break;
      }
    }
  };

  const handleRemovePokemon = () => {
    // Find the Pokemon in the teams to remove it
    for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
      const slotIndex = teams[teamIndex].pokemon.findIndex((p: Pokemon | null) => p?.id === pokemon.id);
      if (slotIndex !== -1) {
        onRemovePokemon(teamIndex, slotIndex);
        onClose();
        break;
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-gray-700 border-4 border-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 border-b-2 border-gray-600 pb-2">
          <h3 className="text-2xl font-bold text-white">
            {(pokemon.nickname || pokemon.name).toUpperCase()} STATS
          </h3>
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded border-2 border-red-800"
          >
            ✕
          </button>
        </div>
        
        {/* Pokemon Info Header */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="text-white">
              <div className="text-lg font-bold">
                <input
                  type="text"
                  value={pokemon.nickname || pokemon.name}
                  onChange={(e) => handleNicknameChange(e.target.value)}
                  placeholder="Enter nickname..."
                  className="bg-transparent text-lg font-bold text-white placeholder-gray-400 focus:outline-none focus:border-b-2 focus:border-yellow-400 w-full"
                />
              </div>
              <div className="text-sm text-gray-300 mt-1">
                Species: {pokemon.name}
              </div>
              <div className="flex gap-2 mt-2">
                {pokemon.types.map((type) => (
                  <span
                    key={type}
                    className={`px-3 py-1 rounded text-sm font-bold text-white border-2 border-white ${typeColors[type] || 'bg-gray-500'}`}
                  >
                    {type.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Base Stats */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h4 className="text-lg font-bold text-white mb-3 border-b border-gray-600 pb-2">BASE STATS</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(pokemon.baseStats).map(([stat, value]) => (
              <div key={stat} className="flex justify-between items-center">
                <span className="text-white font-medium capitalize">
                  {stat === 'specialAttack' ? 'Sp. Atk' : 
                   stat === 'specialDefense' ? 'Sp. Def' : 
                   stat.toUpperCase()}
                </span>
                <span className="text-yellow-400 font-bold text-lg">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Values (IVs) */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h4 className="text-lg font-bold text-white mb-3 border-b border-gray-600 pb-2">INDIVIDUAL VALUES (IVs)</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(pokemon.ivs).map(([stat, value]) => (
              <div key={stat} className="flex justify-between items-center">
                <span className="text-white font-medium capitalize">
                  {stat === 'specialAttack' ? 'Sp. Atk' : 
                   stat === 'specialDefense' ? 'Sp. Def' : 
                   stat.toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold">{value}</span>
                  <div className="w-16 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full" 
                      style={{ width: `${(value / 31) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Effort Values (EVs) */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h4 className="text-lg font-bold text-white mb-3 border-b border-gray-600 pb-2">EFFORT VALUES (EVs)</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(pokemon.evs).map(([stat, value]) => (
              <div key={stat} className="flex justify-between items-center">
                <span className="text-white font-medium capitalize">
                  {stat === 'specialAttack' ? 'Sp. Atk' : 
                   stat === 'specialDefense' ? 'Sp. Def' : 
                   stat.toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-bold">{value}</span>
                  <div className="w-16 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full" 
                      style={{ width: `${(value / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nature */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h4 className="text-lg font-bold text-white mb-3 border-b border-gray-600 pb-2">NATURE</h4>
          <div className="text-center">
            <span className="text-purple-400 font-bold text-xl">{pokemon.nature}</span>
          </div>
        </div>

        {/* Remove Pokemon Button */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-lg font-bold text-white mb-3 border-b border-gray-600 pb-2">TEAM MANAGEMENT</h4>
          <div className="flex gap-2">
            <button
              onClick={handleRemovePokemon}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-3 rounded border-2 border-red-800"
            >
              REMOVE FROM TEAM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
