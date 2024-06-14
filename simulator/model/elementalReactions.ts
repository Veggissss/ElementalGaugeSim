import { Reaction } from "./Reactions/Reaction";
import { BurningReaction } from "./Reactions/BurningReaction";
import { FreezeReaction } from "./Reactions/FreezeReaction";
import { QuickenReaction } from "./Reactions/QuickenReaction";
import { ElectroChargedReaction } from "./Reactions/ElectroChargedReaction";

// Define elemental reactions with their coefficients
export const elementalReactions: Reaction[] = [
    new Reaction('Vaporize', ['Burning', 'Pyro'], ['Hydro'], 2),
    new Reaction('Reverse Vaporize', ['Hydro'], ['Burning', 'Pyro'], 0.5),

    new Reaction('Melt', ['Cryo', 'Frozen'], ['Burning', 'Pyro'], 2),
    new Reaction('Reverse Melt', ['Burning', 'Pyro'], ['Cryo', 'Frozen'], 0.5),

    new Reaction('Superconduct', ['Cryo', 'Frozen'], ['Electro'], 1),
    new Reaction('Superconduct', ['Electro'], ['Cryo', 'Frozen'], 1),

    new Reaction('Overloaded', ['Burning', 'Pyro'], ['Electro'], 1),
    new Reaction('Overloaded', ['Electro'], ['Burning', 'Pyro'], 1),

    new Reaction('Bloom', ['Hydro'], ['Quicken', 'Dendro'], 2),
    new Reaction('Reverse Bloom', ['Quicken', 'Dendro'], ['Hydro'], 0.5),

    // TODO Correct the multiplier?
    // Removes Frozen aura, Applies to blunt attacks as well
    new Reaction('Shatter', ['Frozen'], ['Geo'], Infinity),

    new Reaction('Crystallize', ['Burning', 'Pyro', 'Cryo', 'Electro', 'Hydro'], ['Geo'], 0.5),
    new Reaction('Crystallize', ['Geo'], ['Burning', 'Pyro', 'Cryo', 'Electro', 'Hydro'], 0.5), // Bosses can have permanent geo aura

    // https://library.keqingmains.com/evidence/combat-mechanics/elemental-effects/transformative-reactions#freeze-resistance-correction
    // Frozen aura can be reacted with and have underlying hydro and cryo gauges
    new FreezeReaction('Freeze', ['Cryo', 'Frozen'], ['Hydro'], 0),
    new FreezeReaction('Freeze', ['Hydro'], ['Cryo', 'Frozen'], 0),

    new ElectroChargedReaction('Electro-Charged', ['Electro'], ['Hydro'], 0),
    new ElectroChargedReaction('Electro-Charged', ['Hydro'], ['Electro'], 0),

    // TODO opponent application & priority: https://library.keqingmains.com/combat-mechanics/elemental-effects/elemental-gauge-theory#swirl-application
    new Reaction('Swirl', ['Burning', 'Pyro', 'Electro', 'Frozen', 'Cryo', 'Hydro'], ['Anemo'], 0.5),
    new Reaction('Swirl', ['Anemo'], ['Burning', 'Pyro', 'Electro', 'Frozen', 'Cryo', 'Hydro'], 0.5), //Bosses can have permanent anemo aura

    new QuickenReaction('Quicken Spread', ['Quicken','Electro'], ['Dendro'], 0),
    new QuickenReaction('Quicken Aggravate', ['Quicken', 'Dendro'], ['Electro'], 0),

    new BurningReaction('Burning', ['Pyro'], ['Quicken', 'Dendro'], 0),
    new BurningReaction('Burning', ['Quicken', 'Dendro'], ['Pyro'], 0),
];
