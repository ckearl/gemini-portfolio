export interface SoulSilverPokemon {
	id: number;
	name: string;
	types: string[];
	baseStats: {
		hp: number;
		attack: number;
		defense: number;
		specialAttack: number;
		specialDefense: number;
		speed: number;
	};
	ivs: {
		hp: number;
		attack: number;
		defense: number;
		specialAttack: number;
		specialDefense: number;
		speed: number;
	};
	evs: {
		hp: number;
		attack: number;
		defense: number;
		specialAttack: number;
		specialDefense: number;
		speed: number;
	};
	nature: string;
	spriteUrl: {
		soulSilverFrontDefault: string;
	};
}

export interface Pokemon {
	id: number;
	name: string;
	nickname?: string;
	types: string[];
	sprite?: string;
	baseStats: {
		hp: number;
		attack: number;
		defense: number;
		specialAttack: number;
		specialDefense: number;
		speed: number;
	};
	ivs: {
		hp: number;
		attack: number;
		defense: number;
		specialAttack: number;
		specialDefense: number;
		speed: number;
	};
	evs: {
		hp: number;
		attack: number;
		defense: number;
		specialAttack: number;
		specialDefense: number;
		speed: number;
	};
	nature: string;
	moves?: Move[];
	status?: Status;
	level?: number;
	spriteUrl?: Sprites;
}

export interface Sprites {
	soulSilverFrontDefault?: string;
	// more to be added as needed
}

export interface Status {
	type: "normal" | "poison" | "burn" | "freeze" | "paralysis" | "sleep";
	turns?: number; // Number of turns affected, if applicable
	isPermanent?: boolean; // Whether the status lasts until cured or is temporary
}

export interface Move {
	name: string;
	type: string;
	category: "physical" | "special" | "status";
	power: number;
	accuracy: number;
	pp: number;
	priority: number;
}

export interface Team {
	trainer: string;
	pokemon: (Pokemon | null)[];
}
