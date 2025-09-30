import { ElementalGauge } from '../Elements/ElementalGauge';
import { Reaction } from './Reaction';
import { Target } from '../Target';

export class MeltReaction extends Reaction {

    override react(target: Target, auraElement: ElementalGauge, appliedElement: ElementalGauge): number {
        const remainingGaugeUnits = auraElement.react(this.coefficient, appliedElement.gaugeUnits);

        // Remove possibly underlying cryo aura
        const cryoAura = target.getElement('Cryo');
        if (cryoAura && auraElement.element.name === "Frozen") {
            // Still not known for sure if the guage is affected directly or just set to 0.
            cryoAura.gaugeUnits -= (this.coefficient * appliedElement.gaugeUnits);
        }

        return remainingGaugeUnits;
    }
}