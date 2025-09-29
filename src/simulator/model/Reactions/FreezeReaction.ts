import { ElementalGauge } from '../Elements/ElementalGauge';
import { ElementType } from '../Elements/ElementType';
import { Reaction } from './Reaction';
import { Target } from '../Target';

export class FreezeReaction extends Reaction {

    override react(target: Target, auraElement: ElementalGauge, appliedElement: ElementalGauge): number {
        // https://library.keqingmains.com/evidence/combat-mechanics/elemental-effects/transformative-reactions#freeze-resistance-correction
        const frozenGauge = 2 * Math.min(auraElement.gaugeUnits, appliedElement.gaugeUnits);
        const frozenDurationSeconds = 2 * Math.sqrt(5 * frozenGauge * (1 - target.freezeResist) + 4) - 4;

        // Remaining aura after reaction for "fridge"/Bloom+Freeze reaction
        // 2U taxed cryo aura (1.6U) - 1U hydro applied = 0.6U cryo aura does not get reacted through
        // 1U taxed cryo aura (0.8U) - 1U hydro applied = -0.2U gets reacted through
        const remainingGaugeUnits = auraElement.react(this.coefficient, appliedElement.gaugeUnits);

        // Add frozen aura and apply reacting element as an aura
        const existingFrozenAura = target.getElement('Frozen');
        if (existingFrozenAura) {
            existingFrozenAura.gaugeUnits = frozenGauge;
            existingFrozenAura.decayRate = (frozenDurationSeconds / frozenGauge);
        }
        else {
            target.auras.unshift(new ElementalGauge(new ElementType('Frozen'), frozenGauge, (frozenDurationSeconds / frozenGauge)));
        }

        // Replace cryo aura with frozen aura
        const cryoAura = target.getElement('Cryo');
        if (cryoAura) {
            cryoAura.gaugeUnits = 0;
        }

        return remainingGaugeUnits;
    }
}