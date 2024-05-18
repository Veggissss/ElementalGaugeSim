import { ElementalGauge } from "./Elements/ElementalGauge";
import { elementalReactions } from "../data/elementalReactions";
import { ElementType } from "./Elements/ElementType";

// When an element is applied to a target, a tax is applied to the gauge unit
const auraTax = 0.8;

export class Target {
    auras: ElementalGauge[] = [];
    freezeResist: number;

    constructor(freezeResist: number = 0) {
        this.freezeResist = freezeResist;
    }

    public applyElement(newElement: ElementalGauge): ElementalGauge[] {
        // Check for elemental reaction
        const reactionFound = this.applyReaction(newElement);
        if (reactionFound) {
            //(TODO Quicken can have underlying electro aura applied)
            return this.auras;
        }

        // Since no reaction occurred, add the new element as an aura
        if (newElement.gaugeUnits > 0) {
            this.addElementAsAura(newElement);
        }
        else{
            console.log(`Element ${newElement.element.name} has no gauge units.`);
        }

        return this.auras;
    }

    public timeStep(seconds: number): ElementalGauge[] {
        // Decay all auras
        this.auras.forEach(aura => {
            aura.decay(seconds);
            aura.time += seconds;

            console.log(`Decayed ${aura.element.name} to ${aura.gaugeUnits} with decay rate ${aura.decayRate}.`)
        });
        
        // Burning aura generates pyro aura and is removed if dendro is gone
        const burningAura = this.auras.find(aura => aura.element.name == 'Burning');
        if (burningAura) {
            const dendroAura = this.auras.find(aura => aura.element.name == 'Dendro');
            if (dendroAura){
                if (burningAura.time >= 2){
                    // Add 1U of pyro aura every 2s
                    this.addElementAsAura(new ElementalGauge(new ElementType('Pyro'), 1));
                    burningAura.time = 0;
                }
            }
            else{
                // Remove burning aura if dendro is gone
                burningAura.gaugeUnits = 0;
            }
        }

        // Electro-charged aura removes 0.4U/s of electro and hydro auras
        const electroAura = this.auras.find(aura => aura.element.name == 'Electro');
        const hydroAura = this.auras.find(aura => aura.element.name == 'Hydro');
        if (electroAura && hydroAura){
            if (electroAura.time >= 1){
                electroAura.gaugeUnits -= 0.4;
            }
            if (hydroAura.time >= 1){
                hydroAura.gaugeUnits -= 0.4;
            }
        }

        // Remove depleted auras
        this.auras = this.auras.filter(aura => aura.gaugeUnits > 0);
        
        return this.auras;
    }

    public addElementAsAura(newElement: ElementalGauge): void {
        // Apply aura tax
        newElement.gaugeUnits *= auraTax;

        // Add to target if no reaction occurred and is not an element that can not be applied
        if (!newElement.element.canBeAura) {
            return;
        }

        console.log(`Adding ${newElement.element.name} with gauge ${newElement.gaugeUnits} to target.`)
        this.auras.push(newElement);
    }

    private applyReaction(newElement: ElementalGauge): boolean {
        let reactionFound = false;
        if (this.auras.length < 1) {
            console.log('No sufficient auras for reaction');
            return reactionFound;
        }

        // Remove duplicate auras
        const sameAura = this.auras.find(aura => aura.element.name == newElement.element.name);
        if (sameAura) {
            console.log(`Same aura ${sameAura.element.name} found.`);
            // Keep the aura with the highest gauge unit and keep initial decay rate
            //TODO implement 'bugged' behavior for EC? https://library.keqingmains.com/evidence/combat-mechanics/elemental-effects/transformative-reactions#ec-hydro-aura-electro-trigger-interaction-is-bugged
            sameAura.gaugeUnits = Math.max(sameAura.gaugeUnits, newElement.gaugeUnits * auraTax);
            reactionFound = true;

            // Since the aura is the same, no reaction occurs
            return reactionFound;
        }

        // React with existing aura and new aura
        let reactionLog = 'Reactions Occurred:';
        this.auras.forEach(aura => {
            const reaction = elementalReactions.find(reaction => reaction.auraElementName.includes(aura.element.name) && reaction.appliedElementName.includes(newElement.element.name));
            if (reaction) {
                reactionLog += ` ${reaction.name} (${reaction.coefficient}),`;
                reactionFound = true;
                
                // Do reaction
                let remaining = reaction.react(this, aura, newElement);

                // Update reaction gauge for future reactions
                if (remaining <= 0) {
                    newElement.gaugeUnits += remaining;
                } else {
                    // Only one reaction, reacting element couldn't react through the aura
                    return;
                }
            }
        });

        // Remove depleted auras
        this.auras = this.auras.filter(aura => aura.gaugeUnits > 0);

        // Logging
        reactionLog += `\nRemaining Gauges:`;
        this.auras.forEach(aura => {
            reactionLog += ` ${aura.element.name}: ${aura.gaugeUnits},`;
        });
        console.log(reactionLog);

        return reactionFound;
    }
}
