import { ElementType } from "./ElementType";

export class ElementalGauge {
    element: ElementType;
    gaugeUnits: number;
    originalGaugeUnits: number;
    decayRate: number; // Seconds / unit

    time: number = 0;
    
    constructor(element: ElementType, gaugeUnits: number, decayRate: number | undefined = undefined) {
        this.element = element;
        this.gaugeUnits = gaugeUnits;
        this.originalGaugeUnits = gaugeUnits;

        // Calculate unless decay rate is provided
        this.decayRate = decayRate === undefined ? this.calculateDecayRate(gaugeUnits) : decayRate;
    }
    
    react(reactionCoefficient: number, triggerUnit: number): number {
        this.gaugeUnits -= (reactionCoefficient * triggerUnit);
        
        return this.gaugeUnits;
    }
    
    decay(seconds: number) {
        if (this.decayRate <= 0){
            return;
        }

        this.gaugeUnits -= (1 / this.decayRate) * seconds;
    }

    // Calculate the decay rate for a given gauge unit
    // Formula: https://library.keqingmains.com/combat-mechanics/elemental-effects/elemental-gauge-theory#decay-rate
    calculateDecayRate(gaugeUnits : number) : number{
        const durability = gaugeUnits * 25;
        return (875 / (4 * durability)) + (25 / 8);
    }

    resetDecayRate(){
        this.decayRate = this.calculateDecayRate(this.originalGaugeUnits);
    }
}