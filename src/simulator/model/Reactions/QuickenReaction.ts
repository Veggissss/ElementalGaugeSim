import { ElementalGauge } from '../Elements/ElementalGauge';
import { ElementType } from '../Elements/ElementType';
import { Reaction } from './Reaction';
import { Target } from '../Target';

export class QuickenReaction extends Reaction {

    override react(target: Target, auraElement: ElementalGauge, appliedElement: ElementalGauge): number {
        // https://library.keqingmains.com/combat-mechanics/elemental-effects/additive-reactions#quicken
        const quickenGauge = Math.min(auraElement.gaugeUnits, appliedElement.gaugeUnits);
        const quickenDurationSeconds = quickenGauge * 5 + 6;
        console.log("Seconds of quicken: " + quickenDurationSeconds +"s U:"+ quickenGauge);

        const excisingQuickenAura = target.auras.find(aura => aura.element.name === 'Quicken');
        
        // Apply element as underlying aura
        if (excisingQuickenAura) {
            excisingQuickenAura.gaugeUnits = quickenGauge;
            target.addElementAsAura(appliedElement);
        }
        else{
            // Initial catalyze removes electro aura
            target.auras.unshift(new ElementalGauge(new ElementType('Quicken'), quickenGauge, (quickenDurationSeconds / quickenGauge)));

            target.auras = target.auras.filter(aura => aura.element.name !== 'Electro');
        }

        // Remove dendro aura as dendro is consumed by quicken
        target.auras = target.auras.filter(aura => aura.element.name !== 'Dendro');

        return auraElement.gaugeUnits;
    }
}