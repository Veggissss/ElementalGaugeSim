import { ElementalGauge } from '../Elements/ElementalGauge';
import { ElementType } from '../Elements/ElementType';
import { Reaction } from './Reaction';
import { Target } from '../Target';

export class QuickenReaction extends Reaction {

    override react(target: Target, auraElement: ElementalGauge, appliedElement: ElementalGauge): number {
        // https://library.keqingmains.com/combat-mechanics/elemental-effects/additive-reactions#quicken
        const quickenGauge = Math.min(auraElement.gaugeUnits, appliedElement.gaugeUnits * target.auraTax);
        const quickenDurationSeconds = quickenGauge * 5 + 6;
        console.log("Seconds of quicken: " + quickenDurationSeconds + "s U:" + quickenGauge);

        // Add quicken aura to target
        const quickenAura = target.auras.find(aura => aura.element.name == 'Quicken');
        if (quickenAura) {
            if (quickenAura.gaugeUnits < quickenGauge) {
                quickenAura.gaugeUnits = quickenGauge;
                quickenAura.decayRate = quickenDurationSeconds / quickenGauge;
                quickenAura.originalGaugeUnits = quickenGauge;
                quickenAura.time = 0;
            }
        } else {
            target.auras.unshift(new ElementalGauge(new ElementType('Quicken'), quickenGauge, (quickenDurationSeconds / quickenGauge)));
        }
        // Remove gauge units from auras
        auraElement.react(this.coefficient, quickenGauge);
        appliedElement.react(this.coefficient, quickenGauge);

        return auraElement.gaugeUnits;
    }
}