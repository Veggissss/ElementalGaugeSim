import { ElementalGauge } from '../Elements/ElementalGauge';
import { ElementType } from '../Elements/ElementType';
import { Reaction } from './Reaction';
import { Target } from '../Target';


export class ElectroChargedReaction extends Reaction {

    override react(target: Target, auraElement: ElementalGauge, appliedElement: ElementalGauge): number {
        // Add electro or hydro as aura
        target.addElementAsAura(appliedElement);

        // Remove 0.4U of electro or hydro aura when applied. Then -0.4U/s when both auras are present
        target.auras.map(aura => {
            if (aura.element.name == 'Electro' || aura.element.name == 'Hydro') {
                aura.gaugeUnits -= 0.4;
            }
        });

        return auraElement.gaugeUnits;
    }
}