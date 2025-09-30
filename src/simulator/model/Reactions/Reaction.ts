import { ElementalGauge } from "../Elements/ElementalGauge";
import { ElementName } from "../Elements/ElementName";
import { ReactionName } from "./ReactionName";
import { Target } from "../Target";

const floatPrecision = 1.0e-10;

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

        if (auraElement.element.name == 'Burning') {
            const pyroAura = target.getElement('Pyro');
            if (pyroAura) {
                pyroAura.react(this.coefficient, appliedElement.gaugeUnits);
            }

            // If burning aura is used up, reset dendro decay rate.
            if (remainingGaugeUnits < floatPrecision) {
                auraElement.gaugeUnits = 0;

                const dendroAura = target.getElement('Dendro');
                if (dendroAura) {
                    dendroAura.resetDecayRate();
                }
            }
        }

        return remainingGaugeUnits;
    }
}
