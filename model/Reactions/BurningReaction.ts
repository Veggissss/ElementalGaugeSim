import { ElementalGauge } from '../Elements/ElementalGauge';
import { ElementType } from '../Elements/ElementType';
import { Reaction } from './Reaction';
import { Target } from '../Target';

// Burning removes 0.4U/s of dendro aura, so decay rate is since 1s / 0.4U/s = 2.5s
const removalDecay = 2.5;

export class BurningReaction extends Reaction {

    override react(target: Target, auraElement: ElementalGauge, appliedElement: ElementalGauge): number {
        // Add 2U of burning aura with 0 decay rate
        target.auras.unshift(new ElementalGauge(new ElementType('Burning'), 2, 0));

        // Add reacting element as aura, can be dendro or pyro
        target.addElementAsAura(appliedElement);
        
        // Set dendro aura to 0.4U/s decay rate
        const dendroAura = target.auras.find(aura => aura.element.name == 'Dendro');
        if (dendroAura){
            //TODO refresh dendro gauge?
            dendroAura.decayRate = removalDecay;
        }
        
        return auraElement.gaugeUnits;
    }
}