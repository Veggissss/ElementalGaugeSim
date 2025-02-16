import { ElementalGauge } from '../Elements/ElementalGauge';
import { Reaction } from './Reaction';
import { Target } from '../Target';

export class CatalyzeReaction extends Reaction {

    override react(target: Target, auraElement: ElementalGauge, appliedElement: ElementalGauge): number {
        // Add applied element (electro or dendro) to target
        target.addElementAsAura(appliedElement);

        return auraElement.gaugeUnits;
    }
}