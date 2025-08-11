'use client';

import { useState } from 'react';
import { Pokemon, Team } from './types';
import TeamGrid from './components/TeamGrid';
import PokemonSelectionModal from './components/PokemonSelectionModal';
import PokemonStatsModal from './components/PokemonStatsModal';
import InventoryModal from './components/InventoryModal';

const typeColors: { [key: string]: string } = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-green-400',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

// All available Pokemon for the nuzlocke
const allAvailablePokemon: Pokemon[] = [
  { 
    id: 1, 
    name: 'Bulbasaur', 
    types: ['grass', 'poison'],
    baseStats: { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 4, 
    name: 'Charmander', 
    types: ['fire'],
    baseStats: { hp: 39, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 7, 
    name: 'Squirtle', 
    types: ['water'],
    baseStats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 25, 
    name: 'Pikachu', 
    types: ['electric'],
    baseStats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 133, 
    name: 'Eevee', 
    types: ['normal'],
    baseStats: { hp: 55, attack: 55, defense: 50, specialAttack: 45, specialDefense: 65, speed: 55 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 6, 
    name: 'Charizard', 
    types: ['fire', 'flying'],
    baseStats: { hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 16, 
    name: 'Pidgey', 
    types: ['normal', 'flying'],
    baseStats: { hp: 40, attack: 45, defense: 40, specialAttack: 35, specialDefense: 35, speed: 56 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 19, 
    name: 'Rattata', 
    types: ['normal'],
    baseStats: { hp: 30, attack: 56, defense: 35, specialAttack: 25, specialDefense: 35, speed: 72 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 152, 
    name: 'Chikorita', 
    types: ['grass'],
    baseStats: { hp: 45, attack: 49, defense: 65, specialAttack: 49, specialDefense: 65, speed: 45 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 155, 
    name: 'Cyndaquil', 
    types: ['fire'],
    baseStats: { hp: 39, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 158, 
    name: 'Totodile', 
    types: ['water'],
    baseStats: { hp: 50, attack: 65, defense: 64, specialAttack: 44, specialDefense: 48, speed: 43 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 179, 
    name: 'Mareep', 
    types: ['electric'],
    baseStats: { hp: 55, attack: 40, defense: 40, specialAttack: 65, specialDefense: 45, speed: 35 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 183, 
    name: 'Marill', 
    types: ['water', 'fairy'],
    baseStats: { hp: 70, attack: 20, defense: 50, specialAttack: 20, specialDefense: 50, speed: 40 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 147, 
    name: 'Dratini', 
    types: ['dragon'],
    baseStats: { hp: 41, attack: 64, defense: 45, specialAttack: 50, specialDefense: 50, speed: 50 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 161, 
    name: 'Sentret', 
    types: ['normal'],
    baseStats: { hp: 35, attack: 46, defense: 34, specialAttack: 35, specialDefense: 45, speed: 20 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 163, 
    name: 'Hoothoot', 
    types: ['normal', 'flying'],
    baseStats: { hp: 60, attack: 30, defense: 30, specialAttack: 36, specialDefense: 56, speed: 50 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 23, 
    name: 'Ekans', 
    types: ['poison'],
    baseStats: { hp: 35, attack: 60, defense: 44, specialAttack: 40, specialDefense: 54, speed: 55 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 27, 
    name: 'Sandshrew', 
    types: ['ground'],
    baseStats: { hp: 50, attack: 75, defense: 85, specialAttack: 20, specialDefense: 30, speed: 40 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
];

export default function SoulLinkPage() {
  const [teams, setTeams] = useState<Team[]>([
    {
      trainer: 'Toph',
      pokemon: Array(6).fill(null), // Start with 6 empty slots
    },
    {
      trainer: 'Buddy',
      pokemon: Array(6).fill(null), // Start with 6 empty slots
    },
  ]);

  const [editingTeam, setEditingTeam] = useState<number | null>(null);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [inventoryModalOpen, setInventoryModalOpen] = useState<number | null>(null);

  // Get all Pokemon that are currently in use by either team
  const getUsedPokemonSpecies = () => {
    const usedSpecies = new Set<string>();
    teams.forEach(team => {
      team.pokemon.forEach(pokemon => {
        if (pokemon) {
          usedSpecies.add(pokemon.name);
        }
      });
    });
    return usedSpecies;
  };

  // Get available Pokemon for selection (excluding already used species)
  const getAvailablePokemon = () => {
    const usedSpecies = getUsedPokemonSpecies();
    return allAvailablePokemon.filter(pokemon => !usedSpecies.has(pokemon.name));
  };

  const handlePokemonChange = (teamIndex: number, slotIndex: number, pokemon: Pokemon | null) => {
    const newTeams = [...teams];
    newTeams[teamIndex].pokemon[slotIndex] = pokemon;
    setTeams(newTeams);
  };

  const handleTrainerNameChange = (teamIndex: number, name: string) => {
    const newTeams = [...teams];
    newTeams[teamIndex].trainer = name;
    setTeams(newTeams);
  };

  const addPokemon = (teamIndex: number, slotIndex: number) => {
    setEditingTeam(teamIndex);
    setEditingSlot(slotIndex);
  };

  const removePokemon = (teamIndex: number, slotIndex: number) => {
    handlePokemonChange(teamIndex, slotIndex, null);
  };

  const openPokemonStats = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const updatePokemonNickname = (teamIndex: number, slotIndex: number, nickname: string) => {
    const newTeams = [...teams];
    if (newTeams[teamIndex].pokemon[slotIndex]) {
      newTeams[teamIndex].pokemon[slotIndex]!.nickname = nickname;
      setTeams(newTeams);
      // Update the selected Pokemon in the modal
      if (selectedPokemon) {
        setSelectedPokemon({ ...selectedPokemon, nickname });
      }
    }
  };

  const openInventory = (teamIndex: number) => {
    setInventoryModalOpen(teamIndex);
  };

  return (
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
            
            {/* Teams Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {teams.map((team, teamIndex) => (
                <TeamGrid
                  key={teamIndex}
                  team={team}
                  teamIndex={teamIndex}
                  onAddPokemon={addPokemon}
                  onOpenStats={openPokemonStats}
                  onTrainerNameChange={handleTrainerNameChange}
                  onOpenInventory={() => openInventory(teamIndex)}
                  typeColors={typeColors}
                />
              ))}
            </div>

            {/* Pokemon Selection Modal */}
            <PokemonSelectionModal
              isOpen={editingTeam !== null && editingSlot !== null}
              onClose={() => {
                setEditingTeam(null);
                setEditingSlot(null);
              }}
              onSelectPokemon={(pokemon) => {
                if (editingTeam !== null && editingSlot !== null) {
                  handlePokemonChange(editingTeam, editingSlot, pokemon);
                  setEditingTeam(null);
                  setEditingSlot(null);
                }
              }}
              defaultPokemon={getAvailablePokemon()}
              typeColors={typeColors}
            />

            {/* Pokemon Stats Modal */}
            {selectedPokemon && (
              <PokemonStatsModal
                pokemon={selectedPokemon}
                onClose={() => setSelectedPokemon(null)}
                onUpdateNickname={updatePokemonNickname}
                onRemovePokemon={removePokemon}
                teams={teams}
                typeColors={typeColors}
              />
            )}

            {/* Inventory Modal */}
            {inventoryModalOpen !== null && (
              <InventoryModal
                isOpen={inventoryModalOpen !== null}
                onClose={() => setInventoryModalOpen(null)}
                team={teams[inventoryModalOpen]}
                allPokemon={allAvailablePokemon}
                typeColors={typeColors}
              />
            )}

          </div>
        </div>
      </div>
      
      {/* Action Buttons - bottom right corner */}
      <div className="fixed bottom-4 right-4 flex flex-row gap-2 z-20">
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg border-4 border-gray-800 hover:border-gray-700 transition-colors text-sm">
          TYPE CHART
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg border-4 border-gray-800 hover:border-gray-700 transition-colors text-sm">
          SOUL LINK RULES
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg border-4 border-gray-800 hover:border-gray-700 transition-colors text-sm">
          LOGIN
        </button>
      </div>
    </div>
  );
}
