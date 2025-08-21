// // /src/app/nuz/utils/dataPersistence.ts

import { supabase } from "./supbaseClient";
// Import your existing types
import { Pokemon, Team, Move, Status, Sprites } from "../types";

export interface SoulLinkSession {
	id: string;
	name: string;
	player1_id: string;
	player2_id: string;
	player1_username?: string;
	player2_username?: string;
	created_at: string;
	updated_at: string;
}

export interface TeamWithPokemon {
	id: string;
	session_id: string;
	player_id: string;
	trainer: string;
	pokemon: (Pokemon | null)[];
}

// Session Management
export const createSoulLinkSession = async (
	sessionName: string,
	partnerUsername: string
): Promise<{ session: SoulLinkSession | null; error: string | null }> => {
	try {
		const { data: currentUser } = await supabase.auth.getUser();
		if (!currentUser.user) {
			return { session: null, error: "Not authenticated" };
		}

		// Find partner by username
		const { data: partnerProfile, error: partnerError } = await supabase
			.from("profiles")
			.select("id, username")
			.eq("username", partnerUsername)
			.single();

		if (partnerError || !partnerProfile) {
			return { session: null, error: "Partner not found" };
		}

		// Create session
		const { data: session, error: sessionError } = await supabase
			.from("soul_link_sessions")
			.insert({
				name: sessionName,
				player1_id: currentUser.user.id,
				player2_id: partnerProfile.id,
			})
			.select()
			.single();

		if (sessionError) {
			return { session: null, error: sessionError.message };
		}

		// Create teams for both players
		const teamsToCreate = [
			{
				session_id: session.id,
				player_id: currentUser.user.id,
				trainer_name: "",
			},
			{
				session_id: session.id,
				player_id: partnerProfile.id,
				trainer_name: "",
			},
		];

		const { error: teamsError } = await supabase
			.from("teams")
			.insert(teamsToCreate);

		if (teamsError) {
			// Clean up session if team creation fails
			await supabase.from("soul_link_sessions").delete().eq("id", session.id);
			return { session: null, error: teamsError.message };
		}

		return {
			session: {
				...session,
				player1_username: undefined, // Will be fetched separately if needed
				player2_username: partnerProfile.username,
			},
			error: null,
		};
	} catch (error) {
		return { session: null, error: "Failed to create session" };
	}
};

export const getUserSessions = async (): Promise<SoulLinkSession[]> => {
	try {
		const { data: currentUser } = await supabase.auth.getUser();
		if (!currentUser.user) return [];

		const { data: sessions, error } = await supabase
			.from("soul_link_sessions")
			.select(
				`
        *,
        player1:profiles!soul_link_sessions_player1_id_fkey(username),
        player2:profiles!soul_link_sessions_player2_id_fkey(username)
      `
			)
			.or(
				`player1_id.eq.${currentUser.user.id},player2_id.eq.${currentUser.user.id}`
			)
			.order("updated_at", { ascending: false });

		if (error) {
			console.error("Error fetching sessions:", error);
			return [];
		}

		return sessions.map((session) => ({
			id: session.id,
			name: session.name,
			player1_id: session.player1_id,
			player2_id: session.player2_id,
			player1_username: (session.player1 as any)?.username,
			player2_username: (session.player2 as any)?.username,
			created_at: session.created_at,
			updated_at: session.updated_at,
		}));
	} catch (error) {
		console.error("Error fetching sessions:", error);
		return [];
	}
};

// Team Management
export const getSessionTeams = async (
	sessionId: string
): Promise<TeamWithPokemon[]> => {
	try {
		const { data: teams, error } = await supabase
			.from("teams")
			.select(
				`
        *,
        pokemon:team_pokemon(*)
      `
			)
			.eq("session_id", sessionId)
			.order("created_at");

		if (error) {
			console.error("Error fetching teams:", error);
			return [];
		}

		return teams.map((team) => ({
			id: team.id,
			session_id: team.session_id,
			player_id: team.player_id,
			trainer: team.trainer_name,
			pokemon: Array(6)
				.fill(null)
				.map((_, index) => {
					const pokemonInSlot = (team.pokemon as any[]).find(
						(p) => p.slot_index === index
					);
					if (!pokemonInSlot) return null;

					return {
						id: pokemonInSlot.pokemon_id,
						name: pokemonInSlot.pokemon_name,
						nickname: pokemonInSlot.nickname,
						types: pokemonInSlot.types,
						sprite: pokemonInSlot.sprite,
						baseStats: pokemonInSlot.base_stats,
						ivs: pokemonInSlot.ivs,
						evs: pokemonInSlot.evs,
						nature: pokemonInSlot.nature,
						moves: pokemonInSlot.moves,
						status: pokemonInSlot.status,
						level: pokemonInSlot.level,
						spriteUrl: pokemonInSlot.sprite_url,
					};
				}),
		}));
	} catch (error) {
		console.error("Error fetching teams:", error);
		return [];
	}
};

export const updateTrainerName = async (
	teamId: string,
	trainerName: string
): Promise<boolean> => {
	try {
		const { error } = await supabase
			.from("teams")
			.update({ trainer_name: trainerName })
			.eq("id", teamId);

		if (error) {
			console.error("Error updating trainer name:", error);
			return false;
		}

		return true;
	} catch (error) {
		console.error("Error updating trainer name:", error);
		return false;
	}
};

// Pokemon Management
export const addPokemonToTeam = async (
	teamId: string,
	slotIndex: number,
	pokemon: Pokemon
): Promise<{ success: boolean; error?: string }> => {
	try {
		// First check if pokemon already exists in the session (Soul Link rule)
		const { data: existingPokemon, error: checkError } = await supabase
			.from("team_pokemon")
			.select("pokemon_name")
			.eq("team_id", teamId);

		if (checkError) {
			return { success: false, error: checkError.message };
		}

		// Get the session ID from the team
		const { data: team } = await supabase
			.from("teams")
			.select("session_id")
			.eq("id", teamId)
			.single();

		if (!team) {
			return { success: false, error: "Team not found" };
		}

		// Check if pokemon exists in any team in this session
		const { data: allTeamsInSession } = await supabase
			.from("teams")
			.select("id")
			.eq("session_id", team.session_id);

		if (!allTeamsInSession) {
			return { success: false, error: "Session not found" };
		}

		const teamIds = allTeamsInSession.map((t) => t.id);

		const { data: sessionPokemon, error: sessionCheckError } = await supabase
			.from("team_pokemon")
			.select("pokemon_name")
			.in("team_id", teamIds)
			.eq("pokemon_name", pokemon.name);

		if (sessionCheckError) {
			return { success: false, error: sessionCheckError.message };
		}

		if (sessionPokemon.length > 0) {
			return {
				success: false,
				error: "This Pokémon is already caught by your partner!",
			};
		}

		// Remove existing pokemon in this slot if any
		await supabase
			.from("team_pokemon")
			.delete()
			.eq("team_id", teamId)
			.eq("slot_index", slotIndex);

		// Add the new pokemon
		const { error: insertError } = await supabase.from("team_pokemon").insert({
			team_id: teamId,
			slot_index: slotIndex,
			pokemon_id: pokemon.id,
			pokemon_name: pokemon.name,
			nickname: pokemon.nickname,
			types: pokemon.types,
			sprite: pokemon.sprite,
			sprite_url: pokemon.spriteUrl,
			base_stats: pokemon.baseStats,
			ivs: pokemon.ivs,
			evs: pokemon.evs,
			nature: pokemon.nature,
			moves: pokemon.moves,
			status: pokemon.status,
			level: pokemon.level || 1,
		});

		if (insertError) {
			return { success: false, error: insertError.message };
		}

		return { success: true };
	} catch (error) {
		console.error("Error adding pokemon to team:", error);
		return { success: false, error: "Failed to add Pokémon" };
	}
};

export const removePokemonFromTeam = async (
	teamId: string,
	slotIndex: number
): Promise<boolean> => {
	try {
		const { error } = await supabase
			.from("team_pokemon")
			.delete()
			.eq("team_id", teamId)
			.eq("slot_index", slotIndex);

		if (error) {
			console.error("Error removing pokemon:", error);
			return false;
		}

		return true;
	} catch (error) {
		console.error("Error removing pokemon:", error);
		return false;
	}
};

export const updatePokemonNickname = async (
	pokemonId: string,
	nickname: string
): Promise<boolean> => {
	try {
		const { error } = await supabase
			.from("team_pokemon")
			.update({ nickname })
			.eq("id", pokemonId);

		if (error) {
			console.error("Error updating nickname:", error);
			return false;
		}

		return true;
	} catch (error) {
		console.error("Error updating nickname:", error);
		return false;
	}
};

// Real-time subscriptions
export const subscribeToSessionTeams = (
	sessionId: string,
	callback: (teams: TeamWithPokemon[]) => void
) => {
	return supabase
		.channel(`session-${sessionId}`)
		.on(
			"postgres_changes",
			{
				event: "*",
				schema: "public",
				table: "teams",
				filter: `session_id=eq.${sessionId}`,
			},
			async () => {
				const teams = await getSessionTeams(sessionId);
				callback(teams);
			}
		)
		.on(
			"postgres_changes",
			{
				event: "*",
				schema: "public",
				table: "team_pokemon",
			},
			async (payload) => {
				// Check if this change affects our session
				const teamId =
					(payload.new as any)?.team_id || (payload.old as any)?.team_id;
				if (!teamId) return;

				const { data: team } = await supabase
					.from("teams")
					.select("session_id")
					.eq("id", teamId)
					.single();

				if (team?.session_id === sessionId) {
					const teams = await getSessionTeams(sessionId);
					callback(teams);
				}
			}
		)
		.subscribe();
};
