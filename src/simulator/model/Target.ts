import { ElementName } from "./Elements/ElementName";
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
            console.log("No reaction occurred, adding element as aura.");
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
        this.auras = this.auras.filter(aura => aura.gaugeUnits > floatPrecision);

        return this.auras;
    }

    public addElementAsAura(newElement: ElementalGauge, insertAtBeginning = false): ReactionLog | undefined {
        // Apply aura tax
        newElement.gaugeUnits *= this.auraTax;

        // Add to target if no reaction occurred and is not an element that can not be applied
        if (!newElement.element.canBeAura) {
            return;
        }

        const sameAura = this.auras.find(aura => aura.element.name == newElement.element.name);
        if (sameAura) {
            // Keep the aura with the highest gauge unit and keep initial decay rate
            //TODO implement 'bugged' behavior for EC? https://library.keqingmains.com/evidence/combat-mechanics/elemental-effects/transformative-reactions#ec-hydro-aura-electro-trigger-interaction-is-bugged
            sameAura.gaugeUnits = Math.max(sameAura.gaugeUnits, newElement.gaugeUnits);

            console.log(`Refreshing aura ${sameAura.element.name} to ${sameAura.gaugeUnits}U.`);
        }
        else {
            if (insertAtBeginning) {
                this.auras.unshift(newElement);
            }
            else {
                this.auras.push(newElement);
            }
            console.log(`Adding ${newElement.element.name} with gauge ${newElement.gaugeUnits} to target.`)
        }
    }

    public getElement(elementName: ElementName): ElementalGauge | undefined {
        return this.auras.find(aura => aura.element.name == elementName);
    }

    private applyReaction(newElement: ElementalGauge): ReactionLog[] {
        if (this.auras.length < 1) {
            console.log('No sufficient auras for reaction');
            return [];
        }

        const reactions: ReactionLog[] = [];
        for (const reaction of elementalReactions) {
            if (!reaction.appliedElementName.includes(newElement.element.name)) {
                continue;
            }

            // Find an aura that matches the reaction requirements
            const matchingAuras = this.auras.filter(a =>
                reaction.auraElementName.includes(a.element.name)
            );
            if (matchingAuras.length === 0) {
                continue;
            }

            if (this.shouldSkipReaction(reaction, reactions)) {
                break;
            }

            // Sort by priority in auraElementName and take first
            const aura = matchingAuras.sort((a, b) =>
                reaction.auraElementName.indexOf(a.element.name) -
                reaction.auraElementName.indexOf(b.element.name)
            )[0];

            reactions.push(new ReactionLog(reaction, aura, newElement));
            const remaining = reaction.react(this, aura, newElement);
            console.log(`Reaction '${reaction.name}' occurred with '${aura.element.name}' and '${newElement.element.name}'. Remaining gauge units: '${remaining}' ${newElement.gaugeUnits}.`);

            // If the reaction consumed all gauge units, stop checking for more reactions
            if (remaining < 0 && newElement.gaugeUnits > 0) {
                // Remaining gauge is a negative value so add it to the new element
                if (reaction.coefficient == Infinity) {
                    newElement.gaugeUnits = 0;
                }
                else if (reaction.coefficient != 0) {
                    newElement.gaugeUnits += remaining / reaction.coefficient;
                }
                else {
                    newElement.gaugeUnits += remaining;
                }
            }
            else {
                break;
            }
        }

        // Remove depleted auras
        this.auras = this.auras.filter(aura => aura.gaugeUnits > floatPrecision);

        return reactions;
    }

    private shouldSkipReaction(reaction: Reaction, reactions: ReactionLog[]) {
        // https://genshin-impact.fandom.com/wiki/Elemental_Gauge_Theory/Simultaneous_Reaction_Priority
        if (reaction.name == "Reverse Vaporize" && reactions.find(reaction => reaction.name === "Melt") != undefined) {
            return true
        }
        if (reaction.name == "Electro-Charged" && reactions.find(reaction => reaction.name === "Superconduct") != undefined) {
            return true
        }
        if (reaction.name == "Freeze" && reactions.find(reaction => reaction.name === "Superconduct") != undefined) {
            return true
        }
        return false
    }
}
