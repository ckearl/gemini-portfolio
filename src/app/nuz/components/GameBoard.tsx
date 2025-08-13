'use client';

import { useState, useCallback, useMemo } from 'react';
import { Pokemon, Team } from '../types';
import { allAvailablePokemon, typeColors } from '../constants/pokemonData';
import TeamGrid from './TeamGrid';
import PokemonSelectionModal from './PokemonSelectionModal';
import PokemonStatsModal from './PokemonStatsModal';
import InventoryModal from './InventoryModal';

interface GameBoardProps {
  teams: Team[];
  onTeamsChange: (teams: Team[]) => void;
}

export default function GameBoard({ teams, onTeamsChange }: GameBoardProps) {
  const [editingTeam, setEditingTeam] = useState<number | null>(null);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [inventoryModalOpen, setInventoryModalOpen] = useState<number | null>(null);

  // Get all Pokemon that are currently in use by either team
  const getUsedPokemonSpecies = useCallback(() => {
    const usedSpecies = new Set<string>();
    teams.forEach(team => {
      team.pokemon.forEach(pokemon => {
        if (pokemon) {
          usedSpecies.add(pokemon.name);
        }
      });
    });
    return usedSpecies;
  }, [teams]);

  // Get available Pokemon for selection (excluding already used species)
  const getAvailablePokemon = useCallback(() => {
    const usedSpecies = getUsedPokemonSpecies();
    return allAvailablePokemon.filter(pokemon => !usedSpecies.has(pokemon.name));
  }, [getUsedPokemonSpecies]);

  // Memoize available Pokemon to prevent unnecessary re-renders
  const availablePokemon = useMemo(() => getAvailablePokemon(), [getAvailablePokemon]);

  const handlePokemonChange = useCallback((teamIndex: number, slotIndex: number, pokemon: Pokemon | null) => {
    const newTeams = [...teams];
    newTeams[teamIndex].pokemon[slotIndex] = pokemon;
    onTeamsChange(newTeams);
  }, [teams, onTeamsChange]);

  const handleTrainerNameChange = useCallback((teamIndex: number, name: string) => {
    const newTeams = [...teams];
    newTeams[teamIndex].trainer = name;
    onTeamsChange(newTeams);
  }, [teams, onTeamsChange]);

  const addPokemon = useCallback((teamIndex: number, slotIndex: number) => {
    setEditingTeam(teamIndex);
    setEditingSlot(slotIndex);
  }, []);

  const removePokemon = useCallback((teamIndex: number, slotIndex: number) => {
    handlePokemonChange(teamIndex, slotIndex, null);
  }, [handlePokemonChange]);

  const openPokemonStats = useCallback((pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  }, []);

  const updatePokemonNickname = useCallback((teamIndex: number, slotIndex: number, nickname: string) => {
    const newTeams = [...teams];
    if (newTeams[teamIndex].pokemon[slotIndex]) {
      newTeams[teamIndex].pokemon[slotIndex]!.nickname = nickname;
      onTeamsChange(newTeams);
      // Update the selected Pokemon in the modal
      if (selectedPokemon) {
        setSelectedPokemon({ ...selectedPokemon, nickname });
      }
    }
  }, [teams, onTeamsChange, selectedPokemon]);

  const openInventory = useCallback((teamIndex: number) => {
    setInventoryModalOpen(teamIndex);
  }, []);

  const closeEditing = useCallback(() => {
    setEditingTeam(null);
    setEditingSlot(null);
  }, []);

  const handlePokemonSelect = useCallback((pokemon: Pokemon) => {
    if (editingTeam !== null && editingSlot !== null) {
      handlePokemonChange(editingTeam, editingSlot, pokemon);
      closeEditing();
    }
  }, [editingTeam, editingSlot, handlePokemonChange, closeEditing]);

  const closeStats = useCallback(() => {
    setSelectedPokemon(null);
  }, []);

  const closeInventory = useCallback(() => {
    setInventoryModalOpen(null);
  }, []);

  return (
    <>
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
        onClose={closeEditing}
        onSelectPokemon={handlePokemonSelect}
        defaultPokemon={availablePokemon}
        typeColors={typeColors}
      />

      {/* Pokemon Stats Modal */}
      {selectedPokemon && (
        <PokemonStatsModal
          pokemon={selectedPokemon}
          onClose={closeStats}
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
          onClose={closeInventory}
          team={teams[inventoryModalOpen]}
          allPokemon={allAvailablePokemon}
          typeColors={typeColors}
        />
      )}
    </>
  );
}
