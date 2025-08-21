// /src/app/nuz/utils/supabaseClient.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string;
					username: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					username: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					username?: string;
					updated_at?: string;
				};
			};
			soul_link_sessions: {
				Row: {
					id: string;
					name: string;
					player1_id: string;
					player2_id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					player1_id: string;
					player2_id: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					name?: string;
					updated_at?: string;
				};
			};
			teams: {
				Row: {
					id: string;
					session_id: string;
					player_id: string;
					trainer_name: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					session_id: string;
					player_id: string;
					trainer_name?: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					trainer_name?: string;
					updated_at?: string;
				};
			};
			team_pokemon: {
				Row: {
					id: string;
					team_id: string;
					slot_index: number;
					pokemon_id: number;
					pokemon_name: string;
					nickname: string | null;
					level: number;
					types: string[];
					sprite: string | null;
					sprite_url: any; // Sprites object
					base_stats: any; // Stats object
					ivs: any; // Stats object
					evs: any; // Stats object
					nature: string;
					moves: any[] | null; // Move array
					status: any | null; // Status object
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					team_id: string;
					slot_index: number;
					pokemon_id: number;
					pokemon_name: string;
					nickname?: string | null;
					level?: number;
					types: string[];
					sprite?: string | null;
					sprite_url?: any | null;
					base_stats: any;
					ivs: any;
					evs: any;
					nature: string;
					moves?: any[] | null;
					status?: any | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					slot_index?: number;
					pokemon_id?: number;
					pokemon_name?: string;
					nickname?: string | null;
					level?: number;
					types?: string[];
					sprite?: string | null;
					sprite_url?: any | null;
					base_stats?: any;
					ivs?: any;
					evs?: any;
					nature?: string;
					moves?: any[] | null;
					status?: any | null;
					updated_at?: string;
				};
			};
		};
	};
}
