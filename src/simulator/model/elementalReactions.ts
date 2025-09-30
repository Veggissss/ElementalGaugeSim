import { Reaction } from "./Reactions/Reaction";
import { BurningReaction } from "./Reactions/BurningReaction";
import { FreezeReaction } from "./Reactions/FreezeReaction";
import { QuickenReaction } from "./Reactions/QuickenReaction";
import { ElectroChargedReaction } from "./Reactions/ElectroChargedReaction";
import { CatalyzeReaction } from "./Reactions/CatalyzeReaction";
import { BloomReaction } from "./Reactions/BloomReaction";
import { MeltReaction } from "./Reactions/MeltReaction";
import { ElementName } from "./Elements/ElementName";

const priorityList: ElementName[] = ['Electro', 'Burning', 'Pyro', 'Hydro', 'Cryo', 'Frozen'];

// Define elemental reactions with their coefficients
// https://genshin-impact.fandom.com/wiki/Elemental_Gauge_Theory/Simultaneous_Reaction_Priority#Reaction_Priority_Table
export const elementalReactions: Reaction[] = [
    new Reaction('Overloaded', ['Burning', 'Pyro'], ['Electro'], 1),
    new Reaction('Overloaded', ['Electro'], ['Burning', 'Pyro'], 1),

    new MeltReaction('Melt', ['Frozen', 'Cryo'], ['Burning', 'Pyro'], 2),
    new Reaction('Reverse Melt', ['Burning', 'Pyro'], ['Frozen', 'Cryo'], 0.5),

    new Reaction('Vaporize', ['Burning', 'Pyro'], ['Hydro'], 2),
    new Reaction('Reverse Vaporize', ['Hydro'], ['Burning', 'Pyro'], 0.5),

    new Reaction('Superconduct', ['Frozen', 'Cryo'], ['Electro'], 1),
    new Reaction('Superconduct', ['Electro'], ['Frozen', 'Cryo'], 1),

    // TODO opponent application & priority: https://library.keqingmains.com/combat-mechanics/elemental-effects/elemental-gauge-theory#swirl-application
    new Reaction('Swirl', priorityList, ['Anemo'], 0.5),
    new Reaction('Swirl', ['Anemo'], priorityList, 0.5), //Bosses can have permanent anemo aura

    // TODO add electro shatter
    new Reaction('Shatter', ['Frozen'], ['Geo'], Infinity),

    new Reaction('Crystallize', priorityList, ['Geo'], 0.5),
    new Reaction('Crystallize', ['Geo'], priorityList, 0.5), // Bosses can have permanent geo aura

    new FreezeReaction('Freeze', ['Cryo'], ['Hydro'], 1),
    new FreezeReaction('Freeze', ['Hydro'], ['Cryo'], 1),

    new BloomReaction('Bloom', ['Hydro'], ['Quicken', 'Dendro'], 2),
    new BloomReaction('Reverse Bloom', ['Quicken', 'Dendro'], ['Hydro'], 0.5),

    new ElectroChargedReaction('Electro-Charged', ['Electro'], ['Hydro'], 0),
    new ElectroChargedReaction('Electro-Charged', ['Hydro'], ['Electro'], 0),

    new QuickenReaction('Quicken', ['Dendro'], ['Electro'], 1),
    new QuickenReaction('Quicken', ['Electro'], ['Dendro'], 1),

    new CatalyzeReaction('Spread', ['Quicken'], ['Dendro'], 0),
    new CatalyzeReaction('Aggravate', ['Quicken'], ['Electro'], 0),

    new BurningReaction('Burning', ['Pyro'], ['Quicken', 'Dendro'], 0),
    new BurningReaction('Burning', ['Quicken', 'Dendro'], ['Pyro'], 0),
];
