import { ElementalGauge } from '../Elements/ElementalGauge';
import { Reaction } from './Reaction';
import { Target } from '../Target';

export class BloomReaction extends Reaction {

    override react(target: Target, auraElement: ElementalGauge, appliedElement: ElementalGauge): number {
        const remainingGaugeUnits = super.react(target, auraElement, appliedElement);

        // React with both quicken and dendro auras if they exist
        const quickenAura = target.getElement('Quicken');
        const dendroAura = target.getElement('Dendro');
        if (quickenAura && dendroAura) {
            // Quicken aura is already being consumed
            dendroAura.react(this.coefficient, appliedElement.gaugeUnits);
        }

        return remainingGaugeUnits;
    }
}