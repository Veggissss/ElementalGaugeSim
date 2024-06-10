import { ElementalGauge } from '../Elements/ElementalGauge';
import { ElementType } from '../Elements/ElementType';
import { Reaction } from './Reaction';
import { Target } from '../Target';

export class QuickenReaction extends Reaction {

    override react(target: Target, auraElement: ElementalGauge, appliedElement: ElementalGauge): number {
        // https://library.keqingmains.com/combat-mechanics/elemental-effects/additive-reactions#quicken
        const quickenGauge = Math.min(auraElement.gaugeUnits, appliedElement.gaugeUnits);
        const quickenDurationSeconds = quickenGauge * 5 + 6;

        // Remove excising quicken aura, (if any)
        target.auras = target.auras.filter(aura => aura.element.name !== 'Quicken');

        // Add quicken aura and apply reacting element as an aura
        target.auras.unshift(new ElementalGauge(new ElementType('Quicken'), quickenGauge, (quickenGauge / quickenDurationSeconds)));

        // Apply element as underlying aura
        target.addElementAsAura(appliedElement);

        return auraElement.gaugeUnits;
    }
}