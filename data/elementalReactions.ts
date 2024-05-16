import { Reaction } from "../model/Reaction";

// Define elemental reactions with their coefficients
export const elementalReactions: Reaction[] = [
    new Reaction('Vaporize', ['Pyro', 'Hydro'], 2),
    new Reaction('Reverse Vaporize', ['Hydro', 'Pyro'], 0.5),

    new Reaction('Melt', ['Cryo', 'Pyro'], 2),
    new Reaction('Reverse Melt', ['Pyro', 'Cryo'], 0.5),

    new Reaction('Electro-Charged', ['Electro', 'Hydro'], 0), //TODO need to -0.4 U every tick

    new Reaction('Superconduct', ['Cryo', 'Electro'], 2),
    new Reaction('Overloaded', ['Pyro', 'Electro'], 2),

    new Reaction('Freeze', ['Cryo', 'Hydro'], 1),
    new Reaction('Shatter', ['Cryo', 'Geo'], 1), // Applies to blunt attacks as well

    new Reaction('Swirl', ['Anemo', 'Any'], 0.5),
    new Reaction('Crystallize', ['Geo', 'Any'], 0.5),

    //new Reaction('Quicken', ['Electro', 'Dendro'], 1),
    //new Reaction('Spread', ['Dendro', 'Electro'], 0.5),
    //new Reaction('Aggravate', ['Electro', 'Dendro'], 0.5),

    new Reaction('Bloom', ['Hydro', 'Dendro'], 0.5),
    new Reaction('Bloom', ['Dendro', 'Hydro'], 2),
];
