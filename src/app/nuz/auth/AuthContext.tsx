"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { supabase } from "../utils/supbaseClient";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface User {
	id: string;
	username: string;
	email: string;
}

interface AuthContextType {
	user: User | null;
	supabaseUser: SupabaseUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	signIn: (
		email: string,
		password: string
	) => Promise<{ success: boolean; error?: string }>;
	signUp: (
		username: string,
		email: string,
		password: string
	) => Promise<{ success: boolean; error?: string }>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Get initial session
		const getInitialSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (session?.user) {
				setSupabaseUser(session.user);
				await loadUserProfile(session.user.id);
			}

			setIsLoading(false);
		};

		getInitialSession();

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (session?.user) {
				setSupabaseUser(session.user);
				await loadUserProfile(session.user.id);
			} else {
				setSupabaseUser(null);
				setUser(null);
			}
			setIsLoading(false);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	const loadUserProfile = async (userId: string) => {
		try {
			const { data: profile, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.single();

			if (error) {
				console.error("Error loading profile:", error);
				return;
			}

			if (profile) {
				setUser({
					id: profile.id,
					username: profile.username,
					email: supabaseUser?.email || "",
				});
			}
		} catch (error) {
			console.error("Error loading user profile:", error);
		}
	};

	const signIn = async (
		email: string,
		password: string
	): Promise<{ success: boolean; error?: string }> => {
		try {
			setIsLoading(true);

			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				return { success: false, error: error.message };
			}

			if (data.user) {
				setSupabaseUser(data.user);
				await loadUserProfile(data.user.id);
			}

			return { success: true };
		} catch (error) {
			console.error("Sign in error:", error);
			return { success: false, error: "An unexpected error occurred" };
		} finally {
			setIsLoading(false);
		}
	};

	const signUp = async (
		username: string,
		email: string,
		password: string
	): Promise<{ success: boolean; error?: string }> => {
		try {
			setIsLoading(true);

			// Check if username is already taken
			const { data: existingProfile } = await supabase
				.from("profiles")
				.select("username")
				.eq("username", username)
				.single();

			if (existingProfile) {
				return { success: false, error: "Username already taken" };
			}

			// Sign up the user
			const { data, error: signUpError } = await supabase.auth.signUp({
				email,
				password,
			});

			if (signUpError) {
				return { success: false, error: signUpError.message };
			}

			if (!data.user) {
				return { success: false, error: "Failed to create user" };
			}

			// Create profile
			const { error: profileError } = await supabase.from("profiles").insert({
				id: data.user.id,
				username,
			});

			if (profileError) {
				console.error("Profile creation error:", profileError);
				// Note: In production, you might want to handle this by cleaning up the auth user
				return { success: false, error: "Failed to create user profile" };
			}

			// If email confirmation is disabled, set the user immediately
			if (data.session) {
				setSupabaseUser(data.user);
				setUser({
					id: data.user.id,
					username,
					email,
				});
			}

			return { success: true };
		} catch (error) {
			console.error("Sign up error:", error);
			return { success: false, error: "An unexpected error occurred" };
		} finally {
			setIsLoading(false);
		}
	};

	const signOut = async () => {
		try {
			await supabase.auth.signOut();
			setUser(null);
			setSupabaseUser(null);
		} catch (error) {
			console.error("Sign out error:", error);
		}
	};

	const value: AuthContextType = {
		user,
		supabaseUser,
		isAuthenticated: !!user,
		isLoading,
		signIn,
		signUp,
		signOut,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}