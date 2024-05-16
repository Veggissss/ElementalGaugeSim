import { GenshinElement } from "./GenshinElement";

export class ElementalGauge {
    element: GenshinElement;
    gaugeUnits: number;
    decayRate: number;

    constructor(element: GenshinElement, gaugeUnits: number) {
        this.element = element;
        this.gaugeUnits = gaugeUnits;
        this.decayRate = calculateDecayRate(gaugeUnits);
    }

    react(reactionCoefficient: number, triggerUnit: number): void {
        this.gaugeUnits -= (reactionCoefficient * triggerUnit);

        // Ensure gauge units do not go negative
        if (this.gaugeUnits < 0.01) this.gaugeUnits = 0;
    }
}

// Calculate the decay rate for a given gauge unit
// Formula: https://library.keqingmains.com/combat-mechanics/elemental-effects/elemental-gauge-theory#decay-rate
export function calculateDecayRate(gaugeUnit : number) : number{
    const durability = gaugeUnit * 25;
    return (875 / (4 * durability)) + (25 / 8);
}