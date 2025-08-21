// /src/app/nuz/components/SessionManager.tsx

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import {
	getUserSessions,
	createSoulLinkSession,
	SoulLinkSession,
} from "../utils/dataPersistence";

interface SessionManagerProps {
	onSessionSelect: (sessionId: string) => void;
}

export default function SessionManager({
	onSessionSelect,
}: SessionManagerProps) {
	const { user, isAuthenticated } = useAuth();
	const [sessions, setSessions] = useState<SoulLinkSession[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [newSessionName, setNewSessionName] = useState("");
	const [partnerUsername, setPartnerUsername] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (isAuthenticated) {
			loadSessions();
		}
	}, [isAuthenticated]);

	const loadSessions = async () => {
		setIsLoading(true);
		try {
			const userSessions = await getUserSessions();
			setSessions(userSessions);
		} catch (error) {
			console.error("Error loading sessions:", error);
			setError("Failed to load sessions");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCreateSession = async () => {
		if (!newSessionName.trim() || !partnerUsername.trim()) {
			setError("Please fill in all fields");
			return;
		}

		setError(null);
		setIsCreating(true);

		try {
			const { session, error } = await createSoulLinkSession(
				newSessionName.trim(),
				partnerUsername.trim()
			);

			if (error) {
				setError(error);
			} else if (session) {
				setNewSessionName("");
				setPartnerUsername("");
				await loadSessions();
				onSessionSelect(session.id);
			}
		} catch (error) {
			setError("Failed to create session");
		} finally {
			setIsCreating(false);
		}
	};

	if (!isAuthenticated) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">
						Sign in to start your Soul Link adventure!
					</h2>
					<p className="text-gray-600">
						You need to be signed in to create or join Soul Link sessions.
					</p>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading your Soul Link sessions...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-800 mb-2">
					Soul Link Sessions
				</h1>
				<p className="text-gray-600">
					Welcome back, {user?.username}! Choose a session or create a new one.
				</p>
			</div>

			{/* Existing Sessions */}
			{sessions.length > 0 && (
				<div className="mb-8">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						Your Soul Link Sessions
					</h2>
					<div className="grid gap-4">
						{sessions.map((session) => {
							const isPlayer1 = session.player1_id === user?.id;
							const partnerName = isPlayer1
								? session.player2_username
								: session.player1_username;

							return (
								<div
									key={session.id}
									className="bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer p-4"
									onClick={() => onSessionSelect(session.id)}
								>
									<div className="flex justify-between items-start">
										<div>
											<h3 className="font-semibold text-lg text-gray-800">
												{session.name}
											</h3>
											<p className="text-gray-600">
												Partner: {partnerName || "Unknown"}
											</p>
											<p className="text-sm text-gray-500">
												Created:{" "}
												{new Date(session.created_at).toLocaleDateString()}
											</p>
										</div>
										<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
											Enter Session
										</button>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Create New Session */}
			<div className="bg-gray-50 rounded-lg p-6">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">
					Create New Soul Link Session
				</h2>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
						{error}
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Session Name
						</label>
						<input
							type="text"
							value={newSessionName}
							onChange={(e) => setNewSessionName(e.target.value)}
							placeholder="Our Epic Soul Link Run"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							disabled={isCreating}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Partner's Username
						</label>
						<input
							type="text"
							value={partnerUsername}
							onChange={(e) => setPartnerUsername(e.target.value)}
							placeholder="partner_username"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							disabled={isCreating}
						/>
					</div>
				</div>

				<button
					onClick={handleCreateSession}
					disabled={
						isCreating || !newSessionName.trim() || !partnerUsername.trim()
					}
					className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors disabled:cursor-not-allowed"
				>
					{isCreating ? "Creating..." : "Create Soul Link Session"}
				</button>

				<p className="text-sm text-gray-500 mt-2">
					Your partner must have an account with the exact username you enter.
				</p>
			</div>
		</div>
	);
}
