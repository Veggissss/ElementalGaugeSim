import { ElementalGauge } from '../Elements/ElementalGauge';
import { ElementType } from '../Elements/ElementType';
import { Reaction } from './Reaction';
import { Target } from '../Target';

// Burning removes 0.4U/s of dendro aura
const removalDecay = 0.4;

export class BurningReaction extends Reaction {

    override react(target: Target, auraElement: ElementalGauge, appliedElement: ElementalGauge): number {
        // Add 2U of burning aura with 0 decay rate
        target.auras.push(new ElementalGauge(new ElementType('Burning'), 2, 0));

        // Add reacting element as aura, can be dendro or pyro
        target.addElementAsAura(appliedElement);
        
        // Set dendro aura to 0.4U/s decay rate
        const dendroAura = target.auras.find(aura => aura.element.name == 'Dendro');
        if (dendroAura){
            dendroAura.decayRate = removalDecay;
        }
        
        return auraElement.gaugeUnits;
    }
}