import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Pokemon, SoulSilverPokemon } from "@/app/nuz/types";

interface PokemonSelectionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelectPokemon: (pokemon: Pokemon) => void;
	defaultPokemon: Pokemon[];
	typeColors: Record<string, string>;
}

export default function PokemonSelectionModal({
	isOpen,
	onClose,
	onSelectPokemon,
	typeColors,
}: PokemonSelectionModalProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [allPokemon, setAllPokemon] = useState<SoulSilverPokemon[]>([]);
	const [loading, setLoading] = useState(false);

	// Load Pokemon data when modal opens
	useEffect(() => {
		if (isOpen && allPokemon.length === 0) {
			setLoading(true);
			fetch("/soulsilver_pokemon.json")
				.then((response) => response.json())
				.then((data: SoulSilverPokemon[]) => {
					setAllPokemon(data);
					setLoading(false);
				})
				.catch((error) => {
					console.error("Error loading Pokemon data:", error);
					setLoading(false);
				});
		}
	}, [isOpen, allPokemon.length]);

	// Fuzzy search function
	const fuzzySearch = (
		searchTerm: string,
		pokemon: SoulSilverPokemon
	): number => {
		if (!searchTerm) return 1;

		const term = searchTerm.toLowerCase();
		const name = pokemon.name.toLowerCase();
		const types = pokemon.types.join(" ").toLowerCase();

		// Exact name match gets highest score
		if (name === term) return 100;

		// Name starts with search term
		if (name.startsWith(term)) return 90;

		// Name contains search term
		if (name.includes(term)) return 80;

		// Type exact match
		if (pokemon.types.some((type) => type.toLowerCase() === term)) return 70;

		// Type contains search term
		if (types.includes(term)) return 60;

		// Character-by-character fuzzy matching for name
		let nameScore = 0;
		let termIndex = 0;
		for (let i = 0; i < name.length && termIndex < term.length; i++) {
			if (name[i] === term[termIndex]) {
				nameScore += 1;
				termIndex++;
			}
		}

		if (termIndex === term.length) {
			return Math.max(50, nameScore * 10);
		}

		return 0;
	};

	// Filtered and sorted Pokemon
	const filteredPokemon = useMemo(() => {
		if (!searchTerm.trim()) {
			return allPokemon.sort((a, b) => a.name.localeCompare(b.name));
		}

		return allPokemon
			.map((pokemon) => ({
				pokemon,
				score: fuzzySearch(searchTerm, pokemon),
			}))
			.filter((item) => item.score > 0)
			.sort((a, b) => {
				// First sort by score (descending)
				if (b.score !== a.score) return b.score - a.score;
				// Then by name (ascending)
				return a.pokemon.name.localeCompare(b.pokemon.name);
			})
			.map((item) => item.pokemon)
			.slice(0, 50); // Limit results to prevent performance issues
	}, [allPokemon, searchTerm]);

	// Convert SoulSilverPokemon to Pokemon type
	const convertToPokemon = (ssPokemon: SoulSilverPokemon): Pokemon => ({
		id: ssPokemon.id,
		name: ssPokemon.name,
		types: ssPokemon.types,
		nature: ssPokemon.nature,
		baseStats: ssPokemon.baseStats,
    ivs: ssPokemon.ivs,
    evs: ssPokemon.evs
	});

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
			<div className="bg-gray-700 border-4 border-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-white">SELECT POKEMON</h2>
					<button
						onClick={onClose}
						className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded border-2 border-red-800"
					>
						✕
					</button>
				</div>

				{/* Search Bar */}
				<div className="mb-4">
					<input
						type="text"
						placeholder="Search Pokemon by name or type..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full bg-gray-800 border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
						autoFocus
					/>
				</div>

				{/* Results */}
				<div className="flex-1 overflow-y-auto">
					{loading ? (
						<div className="text-center text-white py-8">
							<div className="text-lg">Loading Pokemon...</div>
						</div>
					) : filteredPokemon.length === 0 ? (
						<div className="text-center text-gray-400 py-8">
							{searchTerm
								? "No Pokemon found matching your search."
								: "Start typing to search Pokemon..."}
						</div>
					) : (
						<div className="space-y-2">
							{filteredPokemon.map((pokemon) => (
								<button
									key={pokemon.id}
									onClick={() => {
										onSelectPokemon(convertToPokemon(pokemon));
										onClose();
									}}
									className="w-full bg-gray-800 border-2 border-gray-600 rounded-lg p-3 hover:border-yellow-400 transition-colors flex items-center gap-4"
								>
									{/* Pokemon Sprite */}
									<div className="flex-shrink-0">
										<Image
											src={pokemon.spriteUrl.soulSilverFrontDefault}
											alt={pokemon.name}
											width={64} // Add width
											height={64} // Add height
											className="w-16 h-16 pixelated"
											style={{ imageRendering: "pixelated" }}
											onError={(e) => {
												// Fallback if sprite fails to load
												const target = e.target as HTMLImageElement;
												target.style.display = "none";
											}}
										/>
									</div>

									{/* Pokemon Info */}
									<div className="flex-1 text-left">
										<div className="flex items-center gap-4 mb-2">
											<div className="text-lg font-bold text-white">
												{pokemon.name.toUpperCase()}
											</div>
											<div className="text-sm text-gray-400">
												#{pokemon.id.toString().padStart(3, "0")}
											</div>
										</div>

										<div className="flex gap-2">
											{pokemon.types.map((type) => (
												<span
													key={type}
													className={`px-2 py-1 rounded text-xs font-bold text-white border border-white ${
														typeColors[type] || "bg-gray-500"
													}`}
												>
													{type.toUpperCase()}
												</span>
											))}
										</div>
									</div>
								</button>
							))}
						</div>
					)}
				</div>

				<button
					onClick={onClose}
					className="mt-4 w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded border-2 border-gray-800 hover:border-gray-600"
				>
					CANCEL
				</button>
			</div>
		</div>
	);
}
