import { ElementalGauge } from '../Elements/ElementalGauge';
import { ElementType } from '../Elements/ElementType';
import { Reaction } from './Reaction';
import { Target } from '../Target';

// Burning removes 0.4U/s of dendro aura, so decay rate is since 1s / 0.4U/s = 2.5s
const removalDecay = 2.5;

export class BurningReaction extends Reaction {

    override react(target: Target, auraElement: ElementalGauge, appliedElement: ElementalGauge): number {
        // Add 2U of burning aura with 0 decay rate
        target.addElementAsAura(new ElementalGauge(new ElementType('Burning'), (2 / target.auraTax), 0), true);

        // Add reacting element as aura, can be dendro or pyro
        target.addElementAsAura(appliedElement);

        // Set dendro and or quicken aura to 0.4U/s decay rate
        ['Dendro', 'Quicken'].forEach(elementName => {
            const aura = target.auras.find(aura => aura.element.name == elementName);
            if (aura) {
                aura.decayRate = removalDecay;
            }
        });

        return auraElement.gaugeUnits;
    }

    /**
     * Burning aura generates pyro aura and is removed if dendro is gone
     * @param target target with burning aura
     */
    public static step(target: Target) {
        const burningAura = target.auras.find(aura => aura.element.name == 'Burning');

        if (burningAura) {
            const dendroAura = target.auras.find(aura => aura.element.name == 'Dendro' || aura.element.name == 'Quicken');
            if (dendroAura) {
                // Reapply pyro aura every 2s
                if (burningAura.time >= 2) {
                    burningAura.time = 0;

                    const pyroAura = target.auras.find(aura => aura.element.name == 'Pyro');
                    if (pyroAura) {
                        pyroAura.gaugeUnits = pyroAura.originalGaugeUnits * target.auraTax;
                        console.log(pyroAura.gaugeUnits);
                    } else {
                        console.error('Pyro aura not found.');
                    }
                }
            } else {
                // Remove burning aura if dendro is gone
                burningAura.gaugeUnits = 0;
            }
        }
    }
}