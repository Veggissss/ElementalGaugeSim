
// Type of all possible reactions in the game
export const ReactionNames = [
    'Vaporize', 'Reverse Vaporize',
    'Melt', 'Reverse Melt',
    'Bloom', 'Reverse Bloom',
    'Superconduct', 'Overloaded',
    'Shatter', 'Freeze',
    'Electro-Charged', 'Burning',
    'Swirl', 'Crystallize',
    'Quicken Aggravate', 'Quicken Spread',
] as const;

export type ReactionName = typeof ReactionNames[number];