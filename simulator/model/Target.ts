import { ElementalGauge } from "./Elements/ElementalGauge";
import { BurningReaction } from "./Reactions/BurningReaction";
import { ElectroChargedReaction } from "./Reactions/ElectroChargedReaction";
import { Reaction } from "./Reactions/Reaction";
import { elementalReactions } from "./elementalReactions";

// Units gauge can be considered 0 with floating point error
const floatPrecision = 1.0e-10;

export class Target {
    // When an element is applied to a target, a tax is applied to the gauge unit
    auraTax = 0.8;

    auras: ElementalGauge[] = [];
    freezeResist: number;

    constructor(freezeResist: number = 0) {
        this.freezeResist = freezeResist;
    }

    public applyElement(newElement: ElementalGauge): Reaction[] {
        // Check for elemental reaction
        const reactionFound = this.applyReaction(newElement);
        if (reactionFound.length > 0) {
            console.log(reactionFound);
            return reactionFound;
        }

        // Since no reaction occurred, add the new element as an aura
        if (newElement.gaugeUnits > 0) {
            this.addElementAsAura(newElement);
        }
        else {
            console.log(`Element ${newElement.element.name} has no gauge units.`);
        }
        return [];
    }

    public timeStep(seconds: number): ElementalGauge[] {
        // Decay all auras
        this.auras.forEach(aura => {
            aura.decay(seconds);
            aura.time += seconds;

            console.log(`Decayed ${aura.element.name} to ${aura.gaugeUnits} with decay rate ${aura.decayRate}.`)
        });

        ElectroChargedReaction.step(this);

        // Remove depleted auras with floating point error
        this.auras = this.auras.filter(aura => aura.gaugeUnits > floatPrecision);

        BurningReaction.step(this);

        // Remove depleted auras
        this.auras = this.auras.filter(aura => aura.gaugeUnits > 0);

        return this.auras;
    }

    public addElementAsAura(newElement: ElementalGauge): void {
        // Apply aura tax
        newElement.gaugeUnits *= this.auraTax;

        // Add to target if no reaction occurred and is not an element that can not be applied
        if (!newElement.element.canBeAura) {
            return;
        }

        console.log(`Adding ${newElement.element.name} with gauge ${newElement.gaugeUnits} to target.`)
        this.auras.push(newElement);
    }

    private applyReaction(newElement: ElementalGauge): Reaction[] {
        if (this.auras.length < 1) {
            console.log('No sufficient auras for reaction');
            return [];
        }

        // Remove duplicate auras
        const sameAura = this.auras.find(aura => aura.element.name == newElement.element.name);
        if (sameAura) {
            console.log(`Same aura ${sameAura.element.name} found.`);
            // Keep the aura with the highest gauge unit and keep initial decay rate
            //TODO implement 'bugged' behavior for EC? https://library.keqingmains.com/evidence/combat-mechanics/elemental-effects/transformative-reactions#ec-hydro-aura-electro-trigger-interaction-is-bugged
            sameAura.gaugeUnits = Math.max(sameAura.gaugeUnits, newElement.gaugeUnits * this.auraTax);

            // Since the aura is the same, no reaction occurs
            return [new Reaction("Same Element", [sameAura.element.name], [sameAura.element.name], 0)];
        }

        // React with existing aura and new aura
        let reactionLog = 'Reactions Occurred:';
        let i = 0;

        const reactions : Reaction[] = [];
        while (i < this.auras.length) {
            const aura = this.auras[i];
            i++; // Increment i before removing auras

            const reaction = elementalReactions.find(reaction =>
                reaction.auraElementName.includes(aura.element.name) &&
                reaction.appliedElementName.includes(newElement.element.name)
            );

            if (reaction) {
                reactions.push(reaction);
                reactionLog += `\n${reaction.name} (${reaction.coefficient}R), ${aura.element.name} (${aura.gaugeUnits}U) + ${newElement.element.name} (${newElement.gaugeUnits}U).`;

                // Do reaction
                const remaining = reaction.react(this, aura, newElement);

                // Remaining aura is gone.
                if (remaining <= floatPrecision) {
                    // Update reaction gauge for future reactions (Add a negative number)
                    if (reaction.coefficient != 0 && reaction.coefficient != Infinity) { //TODO: account for non strong and weak-side reactions like swirl
                        newElement.gaugeUnits += remaining / reaction.coefficient;
                    } else {
                        // Non strong and weak-side reactions
                        newElement.gaugeUnits += remaining;
                    }

                    this.auras = this.auras.filter(aura => aura.gaugeUnits > floatPrecision);
                    i = 0; // Reset i to restart for new auras
                } else {
                    // Only one reaction, reacting element couldn't react through the aura
                    break;
                }
            }
        }

        // Remove depleted auras
        this.auras = this.auras.filter(aura => aura.gaugeUnits > floatPrecision);

        // Logging
        reactionLog += `\nRemaining Gauges:`;
        this.auras.forEach(aura => {
            reactionLog += `\n${aura.element.name} (${aura.gaugeUnits}U)`;
        });
        console.log(reactionLog);

        return reactions;
    }
}
