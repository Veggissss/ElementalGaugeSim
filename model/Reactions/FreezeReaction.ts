import { ElementalGauge } from '../Elements/ElementalGauge';
import { ElementType } from '../Elements/ElementType';
import { Reaction } from './Reaction';
import { Target } from '../Target';

export class FreezeReaction extends Reaction {

    override react(target: Target, auraElement: ElementalGauge, appliedElement: ElementalGauge): number {
        // https://library.keqingmains.com/evidence/combat-mechanics/elemental-effects/transformative-reactions#freeze-resistance-correction
        const frozenGauge = 2 * Math.min(auraElement.gaugeUnits, appliedElement.gaugeUnits);
        const frozenDurationSeconds = 2 * Math.sqrt(5 * frozenGauge * (1 - target.freezeResist) + 4) - 4;

        // Add frozen aura and apply reacting element as an aura
        target.auras.unshift(new ElementalGauge(new ElementType('Frozen'), frozenGauge, (frozenGauge / frozenDurationSeconds)));
        target.addElementAsAura(appliedElement);

        // Remove hydro if aura: https://library.keqingmains.com/evidence/combat-mechanics/elemental-effects/transformative-reactions#simultaneous-hydrofrozen-application
        if (auraElement.element.name == 'Hydro') {
            auraElement.gaugeUnits = 0;
        }

        // Replace cryo aura with frozen aura
        const cryoAura = target.auras.find(aura => aura.element.name == 'Cryo');
        if (cryoAura) {
            cryoAura.gaugeUnits = 0;
        }

        return auraElement.gaugeUnits;
    }
}