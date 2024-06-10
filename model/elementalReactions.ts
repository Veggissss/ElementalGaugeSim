import { Reaction } from "./Reactions/Reaction";
import { BurningReaction } from "./Reactions/BurningReaction";
import { FreezeReaction } from "./Reactions/FreezeReaction";
import { QuickenReaction } from "./Reactions/QuickenReaction";

// Define elemental reactions with their coefficients
export const elementalReactions: Reaction[] = [
    new Reaction('Vaporize', ['Pyro', 'Burning'], ['Hydro'], 2),
    new Reaction('Reverse Vaporize', ['Hydro'], ['Pyro', 'Burning'], 0.5),

    new Reaction('Melt', ['Cryo', 'Frozen'], ['Pyro', 'Burning'], 2),
    new Reaction('Reverse Melt', ['Pyro', 'Burning'], ['Cryo', 'Frozen'], 0.5),

    new Reaction('Superconduct', ['Cryo', 'Frozen'], ['Electro'], 1),
    new Reaction('Overloaded', ['Pyro', 'Burning'], ['Electro'], 1),

    new Reaction('Bloom', ['Hydro'], ['Quicken', 'Dendro'], 2),
    new Reaction('Reverse Bloom', ['Quicken', 'Dendro'], ['Hydro'], 0.5),

    // TODO Correct the multiplier?
    // Removes Frozen aura, Applies to blunt attacks as well
    new Reaction('Shatter', ['Frozen'], ['Geo'], Infinity),

    new Reaction('Crystallize', ['Burning', 'Pyro', 'Cryo', 'Electro', 'Hydro'],['Geo'], 0.5),
    new Reaction('Crystallize', ['Geo'], ['Burning', 'Pyro', 'Cryo', 'Electro', 'Hydro'], 0.5), // Bosses can have permanent geo aura

    // https://library.keqingmains.com/evidence/combat-mechanics/elemental-effects/transformative-reactions#freeze-resistance-correction
    // Frozen aura can be reacted with and have underlying hydro and cryo gauges
    new FreezeReaction('Freeze', ['Cryo', 'Frozen'], ['Hydro'], 0),
    new FreezeReaction('Freeze', ['Hydro'], ['Cryo', 'Frozen'], 0),

    // EC will tick once per second so long as enough Electro and Hydro gauge remain, -0.4U from both gauges each tick;
    // When either the Electro or Hydro gauge completely decays, the next Electro-Charged tick will prematurely occur at the moment when the gauge is completely decayed. 
    // However, if one of the gauges empties within 0.5s of the last Electro-Charged tick, there will not be another tick of Electro-Charged.
    new Reaction('Electro-Charged', ['Electro'], ['Hydro'], 0),
    new Reaction('Electro-Charged', ['Hydro'], ['Electro'], 0),

    // TODO opponent application & priority: https://library.keqingmains.com/combat-mechanics/elemental-effects/elemental-gauge-theory#swirl-application
    new Reaction('Swirl', ['Burning', 'Pyro', 'Electro', 'Frozen', 'Cryo', 'Hydro'], ['Anemo'], 0.5),
    new Reaction('Swirl', ['Anemo'], ['Burning', 'Pyro', 'Electro', 'Frozen', 'Cryo', 'Hydro'], 0.5), //Bosses can have permanent anemo aura

    new QuickenReaction('Quicken Spread', ['Electro'], ['Dendro'], 0),
    new QuickenReaction('Quicken Aggravate', ['Quicken', 'Dendro'], ['Electro'], 0),

    new BurningReaction('Burning', ['Pyro'], ['Quicken', 'Dendro'], 0),
    new BurningReaction('Burning', ['Quicken', 'Dendro'], ['Pyro'], 0),
];
