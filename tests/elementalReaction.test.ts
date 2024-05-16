import { ElementalGauge } from "../model/ElementalGauge";
import { Target } from "../model/Target";

describe('superconduct elemental reaction', () => {
    const target = new Target();
    test('applying 2U of cryo', () => {
        // 2U * 0.8 = 1.6U
        expect(target.applyElement(new ElementalGauge('Cryo', 2))[0].gaugeUnits).toBeCloseTo(1.6); 
    });

    test('applying 1U of electro', () => {
        expect(target.applyElement(new ElementalGauge('Electro', 1))[0].gaugeUnits).toBeCloseTo(0.6);
    });
});

describe('same applied element inherits decay rate and updates gauge', () => {
    const target = new Target();
    test('applying 1U of cryo and then 2U of cryo', () => {
        let aura = target.applyElement(new ElementalGauge('Cryo', 1))[0];
        expect(aura.gaugeUnits).toBeCloseTo(0.8); 
        expect(aura.decayRate).toBeCloseTo(11.875);

        // New cryo aura should inherit the decay rate of the existing aura
        let updatedAura = target.applyElement(new ElementalGauge('Cryo', 2))[0];
        expect(updatedAura.gaugeUnits).toBeCloseTo(1.6);
        expect(updatedAura.decayRate).toBeCloseTo(11.875);
    });
});