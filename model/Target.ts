import { ElementalGauge } from "./ElementalGauge";
import { elementalReactions } from "../data/elementalReactions";

// When an element is applied to a target, a tax is applied to the gauge unit
const auraTax = 0.8;

export class Target {
    auras: ElementalGauge[] = [];

    private addAuraToTarget(newElement: ElementalGauge): void {
        // Apply aura tax
        newElement.gaugeUnits = newElement.gaugeUnits * auraTax;

        // Add to target if no reaction occurred and is not an element that can not be applied
        if (newElement.element != 'Anemo' && newElement.element != 'Geo'){
            this.auras.push(newElement);
        }

        console.log(`Adding ${newElement.element} with gauge ${newElement.gaugeUnits} to target.`)
    }

    public applyElement(newElement: ElementalGauge): ElementalGauge[] {

        // Check for elemental reaction
        const reactionFound = this.applyReaction(newElement);
        if (reactionFound) {
            //(TODO Quicken can have underlying electro aura applied)
            return this.auras;
        }

        this.addAuraToTarget(newElement);
        return this.auras;
    }

    private applyReaction(newAura: ElementalGauge): boolean {
        let reactionFound = false;
        if (this.auras.length < 1) {
            console.log('No sufficient auras for reaction');
            return reactionFound;
        }

        // Remove duplicate auras
        const sameAura = this.auras.find(aura => aura.element == newAura.element);
        if (sameAura) {
            // Keep the aura with the highest gauge unit and keep initial decay rate
            sameAura.gaugeUnits = Math.max(sameAura.gaugeUnits, newAura.gaugeUnits * auraTax);
            reactionFound = true;

            // Since the aura is the same, no reaction occurs
            return reactionFound;
        }
        
        // React with existing aura and new aura
        let reactionLog = 'Reactions Occurred:';
        this.auras.forEach(aura => {
            const reaction = elementalReactions.find(r => r.elements[0].includes(aura.element) && r.elements[1].includes(newAura.element));
            if (reaction) {
                aura.react(reaction.coefficient, newAura.gaugeUnits);

                reactionLog += ` ${reaction.name} (${reaction.coefficient}),`;
                reactionFound = true;
            }
        });

        // Remove depleted auras
        this.auras = this.auras.filter(aura => aura.gaugeUnits > 0);

        reactionLog += `\nRemaining Gauges:`;
        this.auras.forEach(aura => {
            reactionLog += ` ${aura.element}: ${aura.gaugeUnits.toFixed(2)},`;
        });
        console.log(reactionLog);

        return reactionFound;
    }
}
