import { Reaction } from "../model/Reactions/Reaction";
import { BurningReaction } from "../model/Reactions/BurningReaction";
import { FreezeReaction } from "../model/Reactions/FreezeReaction";

// Define elemental reactions with their coefficients
export const elementalReactions: Reaction[] = [
    new Reaction('Vaporize', ['Pyro', 'Burning'], ['Hydro'], 2),
    new Reaction('Reverse Vaporize', ['Hydro'], ['Pyro', 'Burning'], 0.5),

    new Reaction('Melt', ['Cryo', 'Frozen'], ['Pyro', 'Burning'], 2),
    new Reaction('Reverse Melt', ['Pyro','Burning'], ['Cryo', 'Frozen'], 0.5),

    new Reaction('Superconduct', ['Cryo', 'Frozen'], ['Electro'], 1),
    new Reaction('Overloaded', ['Pyro', 'Burning'], ['Electro'], 1),

    new Reaction('Bloom', ['Hydro'], ['Dendro'], 2),
    new Reaction('Reverse Bloom', ['Dendro'], ['Hydro'], 0.5),

    // TODO Correct the multiplier?
    // Removes Frozen aura, Applies to blunt attacks as well
    new Reaction('Shatter', ['Frozen'], ['Geo'], Infinity), 

    new Reaction('Crystallize', ['Geo'], ['Burning', 'Pyro', 'Cryo', 'Electro', 'Hydro'], 0.5),

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

    new Reaction('Quicken', ['Electro'], ['Dendro'], 0),
    new Reaction('Quicken', ['Dendro'], ['Electro'], 0),

    new Reaction('Spread', ['Quicken'], ['Electro'], 0),
    new Reaction('Aggravate', ['Quicken'], ['Dendro'], 0),

    // Old?: Decay rate of Dendro while burning is the sum of the natural decay rates of Dendro and Pyro auras
    // Burning applies 1U of Pyro aura every 2s (8 ticks) of damage

    // Burning ~2s per 1U of dendro aura so 1.5U dendro aura will last ~3s; assumption: decay rate is 2U/s for all units?
    // Remaining Pyro gauge of burning will always be 1U?: Nope gauge varies; depends on pyro aura gauge &(and max dendro?), and decay rate of first initial aura? further needs testing.

    // If a burning aura is vaporized or melted, the resulting aura will be dendro that decays at initial dendro decay rate with reduced gauge.
    
    // So when there is a burning aura, the decay rate of dendro aura is 0.4U/s. 
    // It refreshes the underlying pyro aura every 2s,
    
    // The burning aura specifically has a gauge of 2U, so 1.6U with tax. So it does not decay at all
    new BurningReaction('Burning', ['Pyro'], ['Dendro'], 0),
    new BurningReaction('Burning', ['Dendro'], ['Pyro'], 0),
];
