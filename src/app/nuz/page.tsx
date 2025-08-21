// /src/app/nuz/page.tsx

"use client";

import { useState } from "react";
import { AuthProvider } from "./auth/AuthContext";
import UserStatus from "./components/UserStatus";
// import SaveStatus from "./components/SaveStatus";
import GameBoard from "./components/GameBoard";
import SessionManager from "./components/SessionManager";
import GameControls from "./components/GameControls";

export default function SoulLinkPage() {
	const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

	const handleSessionSelect = (sessionId: string) => {
		setCurrentSessionId(sessionId);
	};

	const handleBackToSessions = () => {
		setCurrentSessionId(null);
	};

	return (
		<AuthProvider>
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

							{/* Main Content - Either SessionManager or GameBoard */}
							{currentSessionId ? (
								<GameBoard
									sessionId={currentSessionId}
									onBackToSessions={handleBackToSessions}
								/>
							) : (
								<SessionManager onSessionSelect={handleSessionSelect} />
							)}
						</div>
					</div>
				</div>

				{/* UI Components - Always visible */}
				<UserStatus />
				{/* Only show SaveStatus when in a session for backwards compatibility */}
				{/* {currentSessionId && (
					<SaveStatus
						teams={[]} // Empty since we're using DB now
						onTeamsLoad={() => {}} // No-op since we load from DB
					/>
				)} */}
				<GameControls />
			</div>
		</AuthProvider>
	);
}
