import { ElementalGauge } from '../Elements/ElementalGauge';
import { ElementType } from '../Elements/ElementType';
import { Reaction } from './Reaction';
import { Target } from '../Target';

export class BloomReaction extends Reaction {

    override react(target: Target, auraElement: ElementalGauge, appliedElement: ElementalGauge): number {
        const remainingGaugeUnits = super.react(target, auraElement, appliedElement);

        // React with both quicken and dendro auras if they exist
        const quickenAura = target.auras.find(aura => aura.element.name == 'Quicken');
        const dendroAura = target.auras.find(aura => aura.element.name == 'Dendro');
        if (quickenAura && dendroAura) {
            // Quicken aura is already being consumed
            dendroAura.react(this.coefficient, appliedElement.gaugeUnits);
        }

        return remainingGaugeUnits;
    }
}