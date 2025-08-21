"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Pokemon, Team } from "../types";
import { allAvailablePokemon, typeColors } from "../constants/pokemonData";
import { useAuth } from "../auth/AuthContext";
import {
	getSessionTeams,
	addPokemonToTeam,
	removePokemonFromTeam,
	updateTrainerName,
	updatePokemonNickname,
	subscribeToSessionTeams,
	TeamWithPokemon,
} from "../utils/dataPersistence";
import TeamGrid from "./TeamGrid";
import PokemonSelectionModal from "./PokemonSelectionModal";
import PokemonStatsModal from "./PokemonStatsModal";
import InventoryModal from "./InventoryModal";

interface GameBoardProps {
	sessionId: string;
	onBackToSessions: () => void;
}

export default function GameBoard({
	sessionId,
	onBackToSessions,
}: GameBoardProps) {
	const { user } = useAuth();
	const [teams, setTeams] = useState<TeamWithPokemon[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Modal states
	const [editingTeam, setEditingTeam] = useState<number | null>(null);
	const [editingSlot, setEditingSlot] = useState<number | null>(null);
	const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
	const [inventoryModalOpen, setInventoryModalOpen] = useState<number | null>(
		null
	);

	// Load teams when component mounts or sessionId changes
	useEffect(() => {
		loadTeams();
	}, [sessionId]);

	// Set up real-time subscription
	useEffect(() => {
		const channel = subscribeToSessionTeams(sessionId, (updatedTeams) => {
			setTeams(updatedTeams);
		});

		return () => {
			channel.unsubscribe();
		};
	}, [sessionId]);

	const loadTeams = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const sessionTeams = await getSessionTeams(sessionId);
			setTeams(sessionTeams);
		} catch (err) {
			console.error("Error loading teams:", err);
			setError("Failed to load teams");
		} finally {
			setIsLoading(false);
		}
	};

	// Convert database teams to your existing Team format for compatibility
	const convertedTeams = useMemo((): Team[] => {
		return teams.map((team) => ({
			trainer: team.trainer,
			pokemon: team.pokemon,
		}));
	}, [teams]);

	// Get all Pokemon that are currently in use by either team
	const getUsedPokemonSpecies = useCallback(() => {
		const usedSpecies = new Set<string>();
		teams.forEach((team) => {
			team.pokemon.forEach((pokemon) => {
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
		return allAvailablePokemon.filter(
			(pokemon) => !usedSpecies.has(pokemon.name)
		);
	}, [getUsedPokemonSpecies]);

	// Memoize available Pokemon to prevent unnecessary re-renders
	const availablePokemon = useMemo(
		() => getAvailablePokemon(),
		[getAvailablePokemon]
	);

	// Get current user's team
	const getCurrentUserTeam = useCallback(() => {
		return teams.find((team) => team.player_id === user?.id);
	}, [teams, user?.id]);

	// Get current user's team index for compatibility with existing components
	const getCurrentUserTeamIndex = useCallback(() => {
		return teams.findIndex((team) => team.player_id === user?.id);
	}, [teams, user?.id]);

	const handlePokemonChange = useCallback(
		async (teamIndex: number, slotIndex: number, pokemon: Pokemon | null) => {
			const team = teams[teamIndex];
			if (!team) return;

			// Only allow users to modify their own team
			if (team.player_id !== user?.id) {
				setError("You can only modify your own team!");
				return;
			}

			try {
				if (pokemon) {
					const result = await addPokemonToTeam(team.id, slotIndex, pokemon);
					if (!result.success) {
						setError(result.error || "Failed to add Pokémon");
						return;
					}
				} else {
					const success = await removePokemonFromTeam(team.id, slotIndex);
					if (!success) {
						setError("Failed to remove Pokémon");
						return;
					}
				}

				// Teams will be updated via real-time subscription
				setError(null);
			} catch (err) {
				console.error("Error updating pokemon:", err);
				setError("Failed to update Pokémon");
			}
		},
		[teams, user?.id]
	);

	const handleTrainerNameChange = useCallback(
		async (teamIndex: number, name: string) => {
			const team = teams[teamIndex];
			if (!team) return;

			// Only allow users to modify their own team
			if (team.player_id !== user?.id) {
				setError("You can only modify your own team!");
				return;
			}

			try {
				const success = await updateTrainerName(team.id, name);
				if (!success) {
					setError("Failed to update trainer name");
					return;
				}

				// Teams will be updated via real-time subscription
				setError(null);
			} catch (err) {
				console.error("Error updating trainer name:", err);
				setError("Failed to update trainer name");
			}
		},
		[teams, user?.id]
	);

	const addPokemon = useCallback(
		(teamIndex: number, slotIndex: number) => {
			const team = teams[teamIndex];
			if (!team) return;

			// Only allow users to add to their own team
			if (team.player_id !== user?.id) {
				setError("You can only modify your own team!");
				return;
			}

			setEditingTeam(teamIndex);
			setEditingSlot(slotIndex);
			setError(null);
		},
		[teams, user?.id]
	);

	const removePokemon = useCallback(
		(teamIndex: number, slotIndex: number) => {
			handlePokemonChange(teamIndex, slotIndex, null);
		},
		[handlePokemonChange]
	);

	const openPokemonStats = useCallback((pokemon: Pokemon) => {
		setSelectedPokemon(pokemon);
	}, []);

	const updatePokemonNicknameHandler = useCallback(
		async (teamIndex: number, slotIndex: number, nickname: string) => {
			const team = teams[teamIndex];
			if (!team || team.player_id !== user?.id) {
				setError("You can only modify your own Pokémon!");
				return;
			}

			const pokemon = team.pokemon[slotIndex];
			if (!pokemon) return;

			try {
				// Find the database pokemon record - we'll need to modify the data layer to handle this
				// For now, we'll update locally and let real-time sync handle it
				const success = await updatePokemonNickname(
					pokemon.id?.toString() || "",
					nickname
				);
				if (!success) {
					setError("Failed to update nickname");
					return;
				}

				// Update the selected Pokemon in the modal
				if (selectedPokemon && selectedPokemon.name === pokemon.name) {
					setSelectedPokemon({ ...selectedPokemon, nickname });
				}

				setError(null);
			} catch (err) {
				console.error("Error updating nickname:", err);
				setError("Failed to update nickname");
			}
		},
		[teams, user?.id, selectedPokemon]
	);

	const openInventory = useCallback((teamIndex: number) => {
		setInventoryModalOpen(teamIndex);
	}, []);

	const closeEditing = useCallback(() => {
		setEditingTeam(null);
		setEditingSlot(null);
	}, []);

	const handlePokemonSelect = useCallback(
		(pokemon: Pokemon) => {
			if (editingTeam !== null && editingSlot !== null) {
				handlePokemonChange(editingTeam, editingSlot, pokemon);
				closeEditing();
			}
		},
		[editingTeam, editingSlot, handlePokemonChange, closeEditing]
	);

	const closeStats = useCallback(() => {
		setSelectedPokemon(null);
	}, []);

	const closeInventory = useCallback(() => {
		setInventoryModalOpen(null);
	}, []);

	// Loading state
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading your Soul Link session...</p>
				</div>
			</div>
		);
	}

	// Error state
	if (error && teams.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-4">
						<p className="font-semibold">Error loading session</p>
						<p>{error}</p>
					</div>
					<button
						onClick={onBackToSessions}
						className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
					>
						Back to Sessions
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Header */}
			<div className="mb-6 flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">
						Soul Link Session
					</h1>
					<p className="text-gray-600">
						{teams.length === 2 &&
							`${teams[0].trainer || "Player 1"} vs ${
								teams[1].trainer || "Player 2"
							}`}
					</p>
				</div>
				<button
					onClick={onBackToSessions}
					className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
				>
					Back to Sessions
				</button>
			</div>

			{/* Error banner */}
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
					{error}
				</div>
			)}

			{/* Teams Container */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{convertedTeams.map((team, teamIndex) => {
					const dbTeam = teams[teamIndex];
					const isCurrentUserTeam = dbTeam?.player_id === user?.id;

					return (
						<div
							key={teamIndex}
							className={isCurrentUserTeam ? "" : "opacity-75"}
						>
							{isCurrentUserTeam && (
								<div className="mb-2 text-sm font-medium text-blue-600">
									Your Team
								</div>
							)}
							<TeamGrid
								team={team}
								teamIndex={teamIndex}
								onAddPokemon={addPokemon}
								onOpenStats={openPokemonStats}
								onTrainerNameChange={handleTrainerNameChange}
								onOpenInventory={() => openInventory(teamIndex)}
								typeColors={typeColors}
								disabled={!isCurrentUserTeam} // Disable interactions for partner's team
							/>
						</div>
					);
				})}
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
					onUpdateNickname={updatePokemonNicknameHandler}
					onRemovePokemon={removePokemon}
					teams={convertedTeams}
					typeColors={typeColors}
				/>
			)}

			{/* Inventory Modal */}
			{inventoryModalOpen !== null && (
				<InventoryModal
					isOpen={inventoryModalOpen !== null}
					onClose={closeInventory}
					team={convertedTeams[inventoryModalOpen]}
					allPokemon={allAvailablePokemon}
					typeColors={typeColors}
				/>
			)}
		</>
	);
}
