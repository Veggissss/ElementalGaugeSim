import { Reaction } from "../model/Reaction";

// Define elemental reactions with their coefficients
export const elementalReactions: Reaction[] = [
    new Reaction('Vaporize', ['Pyro', 'Hydro'], 2),
    new Reaction('Reverse Vaporize', ['Hydro', 'Pyro'], 0.5),

    new Reaction('Melt', ['Cryo', 'Pyro'], 2),
    new Reaction('Reverse Melt', ['Pyro', 'Cryo'], 0.5),

    new Reaction('Superconduct', ['Cryo', 'Electro'], 1),
    new Reaction('Overloaded', ['Pyro', 'Electro'], 1),

    new Reaction('Bloom', ['Hydro', 'Dendro'], 2),
    new Reaction('Reverse Bloom', ['Dendro', 'Hydro'], 0.5),

    new Reaction('Shatter', ['Frozen', 'Geo'], Infinity), 

    // TODO "special" reactions with unique mechanics:

    // Frozen aura can be reacted with and have underlying hydro and cryo gauges
    //new Reaction('Freeze', ['Cryo', 'Hydro'], 1),
    
    // EC will tick once per second so long as enough Electro and Hydro gauge remain, -0.4U from both gauges each tick
    //new Reaction('Electro-Charged', ['Electro', 'Hydro'], 0),

    // Removes Frozen aura, Applies to blunt attacks as well

    //new Reaction('Swirl', ['Anemo', 'Any'], 0.5), // TODO opponent application: https://library.keqingmains.com/combat-mechanics/elemental-effects/elemental-gauge-theory#swirl-application
    //new Reaction('Crystallize', ['Geo', 'Any'], 0.5), //TODO replace any to exclude geo, dendro, 

    //new Reaction('Quicken', ['Electro', 'Dendro'], 1),
    //new Reaction('Spread', ['Dendro', 'Electro'], 0.5),
    //new Reaction('Aggravate', ['Electro', 'Dendro'], 0.5),

    // Burning applies 1U of Pyro aura every 2s (8 ticks) of damage
    //new Reaction('Burning', ['Pyro', 'Dendro'], 2),
];
