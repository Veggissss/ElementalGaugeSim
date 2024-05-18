import { ElementalGauge } from "../Elements/ElementalGauge";
import { ElementName } from "../Elements/ElementName";
import { ReactionName } from "./ReactionName";
import { Target } from "../Target";

export class Reaction {
    name: ReactionName;
    auraElementName: ElementName[];
    appliedElementName: ElementName[];
    coefficient: number;

    constructor(name: ReactionName, auraElementName: ElementName[], appliedElementName: ElementName[], coefficient: 0 | 0.5 | 1 | 2 | typeof Infinity) {
        this.name = name;
        this.auraElementName = auraElementName;
        this.appliedElementName = appliedElementName;
        this.coefficient = coefficient;
    }

    public react(target: Target, auraElement: ElementalGauge, appliedElement: ElementalGauge): number {
        const remainingGaugeUnits = auraElement.react(this.coefficient, appliedElement.gaugeUnits);

        // Change dendro if burning aura is gone
        if (auraElement.element.name == 'Burning' && remainingGaugeUnits == 0) {
            // Remove burning aura if dendro is gone
            auraElement.gaugeUnits = 0;
            
            const dendroAura = target.auras.find(aura => aura.element.name == 'Dendro');
            if (dendroAura){
                dendroAura.resetDecayRate();
            }
        }

        return remainingGaugeUnits;
    }
}
