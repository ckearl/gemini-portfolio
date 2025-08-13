import { Pokemon } from '../types';

export const typeColors: { [key: string]: string } = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-green-400',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

// All available Pokemon for the nuzlocke
export const allAvailablePokemon: Pokemon[] = [
  { 
    id: 1, 
    name: 'Bulbasaur', 
    types: ['grass', 'poison'],
    baseStats: { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 4, 
    name: 'Charmander', 
    types: ['fire'],
    baseStats: { hp: 39, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 7, 
    name: 'Squirtle', 
    types: ['water'],
    baseStats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 25, 
    name: 'Pikachu', 
    types: ['electric'],
    baseStats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 133, 
    name: 'Eevee', 
    types: ['normal'],
    baseStats: { hp: 55, attack: 55, defense: 50, specialAttack: 45, specialDefense: 65, speed: 55 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 6, 
    name: 'Charizard', 
    types: ['fire', 'flying'],
    baseStats: { hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 16, 
    name: 'Pidgey', 
    types: ['normal', 'flying'],
    baseStats: { hp: 40, attack: 45, defense: 40, specialAttack: 35, specialDefense: 35, speed: 56 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 19, 
    name: 'Rattata', 
    types: ['normal'],
    baseStats: { hp: 30, attack: 56, defense: 35, specialAttack: 25, specialDefense: 35, speed: 72 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 152, 
    name: 'Chikorita', 
    types: ['grass'],
    baseStats: { hp: 45, attack: 49, defense: 65, specialAttack: 49, specialDefense: 65, speed: 45 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 155, 
    name: 'Cyndaquil', 
    types: ['fire'],
    baseStats: { hp: 39, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 158, 
    name: 'Totodile', 
    types: ['water'],
    baseStats: { hp: 50, attack: 65, defense: 64, specialAttack: 44, specialDefense: 48, speed: 43 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 179, 
    name: 'Mareep', 
    types: ['electric'],
    baseStats: { hp: 55, attack: 40, defense: 40, specialAttack: 65, specialDefense: 45, speed: 35 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 183, 
    name: 'Marill', 
    types: ['water', 'fairy'],
    baseStats: { hp: 70, attack: 20, defense: 50, specialAttack: 20, specialDefense: 50, speed: 40 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 147, 
    name: 'Dratini', 
    types: ['dragon'],
    baseStats: { hp: 41, attack: 64, defense: 45, specialAttack: 50, specialDefense: 50, speed: 50 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 161, 
    name: 'Sentret', 
    types: ['normal'],
    baseStats: { hp: 35, attack: 46, defense: 34, specialAttack: 35, specialDefense: 45, speed: 20 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 163, 
    name: 'Hoothoot', 
    types: ['normal', 'flying'],
    baseStats: { hp: 60, attack: 30, defense: 30, specialAttack: 36, specialDefense: 56, speed: 50 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 23, 
    name: 'Ekans', 
    types: ['poison'],
    baseStats: { hp: 35, attack: 60, defense: 44, specialAttack: 40, specialDefense: 54, speed: 55 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
  { 
    id: 27, 
    name: 'Sandshrew', 
    types: ['ground'],
    baseStats: { hp: 50, attack: 75, defense: 85, specialAttack: 20, specialDefense: 30, speed: 40 },
    ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
    evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
    nature: 'Hardy'
  },
];

export const defaultTeams = [
  {
    trainer: 'Toph',
    pokemon: Array(6).fill(null), // Start with 6 empty slots
  },
  {
    trainer: 'Buddy',
    pokemon: Array(6).fill(null), // Start with 6 empty slots
  },
];
