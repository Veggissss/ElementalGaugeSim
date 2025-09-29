import { Reaction } from "./Reactions/Reaction";
import { BurningReaction } from "./Reactions/BurningReaction";
import { FreezeReaction } from "./Reactions/FreezeReaction";
import { QuickenReaction } from "./Reactions/QuickenReaction";
import { ElectroChargedReaction } from "./Reactions/ElectroChargedReaction";
import { CatalyzeReaction } from "./Reactions/CatalyzeReaction";
import { BloomReaction } from "./Reactions/BloomReaction";

// Define elemental reactions with their coefficients
export const elementalReactions: Reaction[] = [
    new Reaction('Melt', ['Cryo', 'Frozen'], ['Burning', 'Pyro'], 2),
    new Reaction('Reverse Melt', ['Burning', 'Pyro'], ['Cryo', 'Frozen'], 0.5),

    new Reaction('Vaporize', ['Burning', 'Pyro'], ['Hydro'], 2),
    new Reaction('Reverse Vaporize', ['Hydro'], ['Burning', 'Pyro'], 0.5),

    new Reaction('Superconduct', ['Cryo', 'Frozen'], ['Electro'], 1),
    new Reaction('Superconduct', ['Electro'], ['Cryo', 'Frozen'], 1),

    new Reaction('Overloaded', ['Burning', 'Pyro'], ['Electro'], 1),
    new Reaction('Overloaded', ['Electro'], ['Burning', 'Pyro'], 1),

    // TODO opponent application & priority: https://library.keqingmains.com/combat-mechanics/elemental-effects/elemental-gauge-theory#swirl-application
    new Reaction('Swirl', ['Burning', 'Pyro', 'Electro', 'Frozen', 'Cryo', 'Hydro'], ['Anemo'], 0.5),
    new Reaction('Swirl', ['Anemo'], ['Burning', 'Pyro', 'Electro', 'Frozen', 'Cryo', 'Hydro'], 0.5), //Bosses can have permanent anemo aura

    new Reaction('Shatter', ['Frozen'], ['Geo'], Infinity),

    new Reaction('Crystallize', ['Burning', 'Pyro', 'Cryo', 'Electro', 'Hydro'], ['Geo'], 0.5),
    new Reaction('Crystallize', ['Geo'], ['Burning', 'Pyro', 'Cryo', 'Electro', 'Hydro'], 0.5), // Bosses can have permanent geo aura

    new FreezeReaction('Freeze', ['Cryo'], ['Hydro'], 1),
    new FreezeReaction('Freeze', ['Hydro'], ['Cryo'], 1),

    new BloomReaction('Bloom', ['Hydro'], ['Quicken', 'Dendro'], 2),
    new BloomReaction('Reverse Bloom', ['Quicken', 'Dendro'], ['Hydro'], 0.5),

    new ElectroChargedReaction('Electro-Charged', ['Electro'], ['Hydro'], 0),
    new ElectroChargedReaction('Electro-Charged', ['Hydro'], ['Electro'], 0),

    new BurningReaction('Burning', ['Pyro'], ['Quicken', 'Dendro'], 0),
    new BurningReaction('Burning', ['Quicken', 'Dendro'], ['Pyro'], 0),

    new QuickenReaction('Quicken', ['Dendro'], ['Electro'], 1),
    new QuickenReaction('Quicken', ['Electro'], ['Dendro'], 1),

    new CatalyzeReaction('Spread', ['Quicken'], ['Dendro'], 0),
    new CatalyzeReaction('Aggravate', ['Quicken'], ['Electro'], 0),
];
