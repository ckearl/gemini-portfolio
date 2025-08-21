// /src/app/nuz/signin/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "../auth/AuthContext";
import Link from "next/link";

function SignInForm() {
	const [isSignUp, setIsSignUp] = useState(false);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const { signIn, signUp } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			let result;

			if (isSignUp) {
				result = await signUp(username, email, password);
			} else {
				result = await signIn(email, password); // Note: signIn now uses email, not username
			}

			if (result.success) {
				router.push("/nuz");
			} else {
				setError(
					result.error ||
						(isSignUp ? "Failed to create account" : "Invalid credentials")
				);
			}
		} catch {
			setError("An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
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

				<div className="relative z-10 flex items-center justify-center min-h-screen p-4">
					<div className="w-full max-w-md">
						{/* Title Bar - styled like Pokemon health bar */}
						<div className="flex justify-center items-center mb-8">
							<div className="bg-gray-700 border-4 border-gray-800 rounded-lg p-4 text-center">
								<h1 className="text-2xl font-bold text-white tracking-wider">
									{isSignUp ? "JOIN THE CHALLENGE" : "TRAINER LOGIN"}
								</h1>
							</div>
						</div>

						{/* Auth Form */}
						<div className="bg-white/90 backdrop-blur-sm border-4 border-gray-800 rounded-lg p-6 shadow-xl">
							<form onSubmit={handleSubmit} className="space-y-4">
								{isSignUp && (
									<div>
										<label
											htmlFor="username"
											className="block text-sm font-bold text-gray-700 mb-2"
										>
											TRAINER NAME
										</label>
										<input
											type="text"
											id="username"
											value={username}
											onChange={(e) => setUsername(e.target.value)}
											className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 font-mono text-gray-800 placeholder:text-gray-500"
											placeholder="Choose your trainer name"
											required
										/>
									</div>
								)}

								<div>
									<label
										htmlFor="email"
										className="block text-sm font-bold text-gray-700 mb-2"
									>
										EMAIL
									</label>
									<input
										type="email"
										id="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 font-mono text-gray-800 placeholder:text-gray-500"
										placeholder="Enter your email"
										required
									/>
								</div>

								<div>
									<label
										htmlFor="password"
										className="block text-sm font-bold text-gray-700 mb-2"
									>
										PASSWORD
									</label>
									<input
										type="password"
										id="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 font-mono text-gray-800 placeholder:text-gray-500"
										placeholder="Enter your password"
										required
										minLength={6}
									/>
								</div>

								{error && (
									<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
										{error}
									</div>
								)}

								<button
									type="submit"
									disabled={isLoading}
									className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg border-2 border-blue-800 hover:border-blue-700 transition-colors"
								>
									{isLoading
										? "LOADING..."
										: isSignUp
										? "CREATE ACCOUNT"
										: "SIGN IN"}
								</button>
							</form>

							<div className="mt-6 text-center">
								<button
									type="button"
									onClick={() => {
										setIsSignUp(!isSignUp);
										setError(""); // Clear any errors when switching
									}}
									className="text-blue-600 hover:text-blue-800 font-semibold"
								>
									{isSignUp
										? "Already have an account? Sign in"
										: "Don't have an account? Sign up"}
								</button>
							</div>

							<div className="mt-6 text-center">
								<Link
									href="/nuz"
									className="text-gray-600 hover:text-gray-800 font-semibold"
								>
									← Back to Nuzlocke
								</Link>
							</div>
						</div>

						{/* Pokemon-themed decoration */}
						<div className="text-center mt-8 text-gray-600">
							<p className="text-sm">
								{isSignUp
									? "Join the ultimate Pokemon Soul Link challenge!"
									: "Welcome back, trainer!"}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function SignInPage() {
	return (
		<AuthProvider>
			<SignInForm />
		</AuthProvider>
	);
}
