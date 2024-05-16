import { ElementalGauge } from "./ElementalGauge";
import { elementalReactions } from "../data/elementalReactions";

export class Target {
    auras: ElementalGauge[] = [];

    addAura(newAura: ElementalGauge): void {
        // Apply aura tax
        newAura.gaugeUnits = newAura.gaugeUnits * 0.8;

        // Add to target
        this.auras.push(newAura);

        // Check for elemental reaction
        console.log(this.applyReaction());
    }

    applyReaction(): string {
        if (this.auras.length < 2) return 'No sufficient auras for reaction';

        let response = 'Reactions Occurred:';
        let reactionFound = false;
        console.log(this.auras[0].element);
        console.log(this.auras[0].gaugeUnits);

        const aura1 = this.auras[0];
        const aura2 = this.auras[1];

        // Remove duplicate auras
        if (aura1.element == aura2.element) {
            // Keep the aura with the highest gauge units and keep initial decay rate
            aura1.gaugeUnits = Math.max(aura1.gaugeUnits, aura2.gaugeUnits);
            
            // Remove the other aura
            this.auras = this.auras.filter(aura => aura != aura2);
        }

        const reaction = elementalReactions.find(r => r.elements[0].includes(aura1.element) && r.elements[1].includes(aura2.element));
        if (reaction) {
            aura1.react(reaction.coefficient, aura2.gaugeUnits);

            if (reaction.coefficient != 1 && reaction.coefficient != 0) {
                aura2.gaugeUnits = 0;
            }

            response += ` ${reaction.name} (${reaction.coefficient}),`;
            reactionFound = true;
        }

        // Remove depleted auras
        this.auras = this.auras.filter(aura => aura.gaugeUnits > 0);

        // Remove anemo and geo auras
        this.auras = this.auras.filter(aura => aura.element != 'Anemo' && aura.element != 'Geo');

        if (!reactionFound) {
            return 'No Reaction';
        }

        response += ` Remaining Gauges:`;
        this.auras.forEach(aura => {
            response += ` ${aura.element}: ${aura.gaugeUnits.toFixed(2)},`;
        });
        return response;
    }
}
