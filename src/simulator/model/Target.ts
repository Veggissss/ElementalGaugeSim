import { ElementalGauge } from "./Elements/ElementalGauge";
import { BurningReaction } from "./Reactions/BurningReaction";
import { ElectroChargedReaction } from "./Reactions/ElectroChargedReaction";
import { Reaction } from "./Reactions/Reaction";
import { ReactionLog } from "./Reactions/ReactionLog";
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

    public applyElement(newElement: ElementalGauge): ReactionLog[] {
        // Check for elemental reaction
        const reactionsFound = this.applyReaction(newElement);
        if (reactionsFound.length > 0) {
            return reactionsFound;
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

    private applyReaction(newElement: ElementalGauge): ReactionLog[] {
        const reactions: ReactionLog[] = [];

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
            return [new ReactionLog(new Reaction("Same Element", [sameAura.element.name], [sameAura.element.name], 0), sameAura, newElement)];
        }

        // React with existing aura and new aura
        let reaction = elementalReactions.find(reaction =>
            this.auras.filter(aura =>
                reaction.auraElementName.includes(aura.element.name) &&
                reaction.appliedElementName.includes(newElement.element.name)).length > 0
        );

        while (reaction != undefined) {
            console.log(reaction);
            const aura = this.auras.find(aura => {
                if (!reaction) {
                    return false;
                }
                return reaction.auraElementName.includes(aura.element.name) && reaction.appliedElementName.includes(newElement.element.name)
            });
            if (!aura) {
                break;
            }
            reactions.push(new ReactionLog(reaction, aura, newElement));

            // Do reaction with aura and new element that was applied
            const remaining = reaction.react(this, aura, newElement);

            // Remaining aura is gone and there is still more units to react with.
            if (remaining <= floatPrecision && newElement.gaugeUnits > floatPrecision) {
                // Update reaction gauge for future reactions
                if (reaction.coefficient == Infinity) {
                    newElement.gaugeUnits = 0;
                }
                else if (reaction.coefficient != 0) {
                    // Add a negative number
                    newElement.gaugeUnits += remaining / reaction.coefficient;
                }
                else {
                    // Non strong and weak-side reactions (Add a negative number)
                    newElement.gaugeUnits += remaining;
                }
            }
            else {
                // Only one reaction, reacting element couldn't react through the aura
                break;
            }

            // Find possibly next reaction or end while loop
            reaction = elementalReactions.find(reaction =>
                // Prevent same reaction from happening multiple times on same application
                reactions.filter(reactionLog => reactionLog.name == reaction.name).length == 0 &&

                this.auras.filter(aura =>
                    reaction.auraElementName.includes(aura.element.name) &&
                    reaction.appliedElementName.includes(newElement.element.name)
                ).length > 0
            );
        }

        // Remove depleted auras
        this.auras = this.auras.filter(aura => aura.gaugeUnits > floatPrecision);

        return reactions;
    }
}
