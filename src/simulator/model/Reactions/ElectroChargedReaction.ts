import { ElementalGauge } from '../Elements/ElementalGauge';
import { ElementType } from '../Elements/ElementType';
import { Reaction } from './Reaction';
import { Target } from '../Target';

const floatPrecision = 1.0e-10;

const electroChargeTickAmount = 0.4;

export class ElectroChargedReaction extends Reaction {

    override react(target: Target, auraElement: ElementalGauge, appliedElement: ElementalGauge): number {
        // Add electro or hydro as aura
        target.addElementAsAura(appliedElement);

        // Remove 0.4U of electro or hydro aura when applied. Then -0.4U/s when both auras are present
        target.auras.map(aura => {
            if (aura.element.name == 'Electro' || aura.element.name == 'Hydro') {
                aura.gaugeUnits -= electroChargeTickAmount;
            }
        });

        return auraElement.gaugeUnits;
    }

    /**
     * Electro charged ticks every second as long as both Electro and Hydro auras are present.
     * When either the Electro or Hydro gauge completely decays, the next Electro-Charged tick will prematurely occur at the moment when the gauge is completely decayed. 
     * However, if one of the gauges empties within 0.5s of the last Electro-Charged tick, there will not be another tick of Electro-Charged.
     * @param target target to step electro charged reaction on
     */
    public static step(target: Target){
        const electroAura = target.auras.find(aura => aura.element.name === 'Electro');
        const hydroAura = target.auras.find(aura => aura.element.name === 'Hydro');

        if (electroAura && hydroAura) {
            if (electroAura.time >= 1 || hydroAura.time >= 1) {
                this.tick(electroAura, hydroAura);
            }
            else if ((electroAura.gaugeUnits < floatPrecision && electroAura.time >= 0.5) || (hydroAura.gaugeUnits < floatPrecision && hydroAura.time >= 0.5)) {
                this.tick(electroAura, hydroAura);
            }
        }
    }

    /**
     * EC will tick once per second so long as enough Electro and Hydro gauge remain, -0.4U from both gauges each tick
     * @param electroAura Electro aura
     * @param hydroAura Hydro aura
     */
    private static tick(electroAura : ElementalGauge, hydroAura : ElementalGauge){
        electroAura.gaugeUnits -= electroChargeTickAmount;
        hydroAura.gaugeUnits -= electroChargeTickAmount;

        // Reset aura timer
        electroAura.time = 0;
        hydroAura.time = 0;
    }
}