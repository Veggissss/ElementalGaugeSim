import { ElementalGauge } from "../model/Elements/ElementalGauge";
import { ElementType } from "../model/Elements/ElementType";

// Test the calculateDecayRate function
// Known values: https://library.keqingmains.com/resources/compendiums/elemental-gauges
describe('Testing decay calculation for known gauge unit values', () => {
    const elementalGauge = new ElementalGauge(new ElementType('Anemo'), 0, 0);

    test('Decay rate of 1U', () => {
        expect(elementalGauge.calculateDecayRate(1)).toBeCloseTo(11.875);
    });

    test('Decay rate of 1.5U', () => {
        expect(elementalGauge.calculateDecayRate(1.5)).toBeCloseTo(8.9583);
    });

    test('Decay rate of 2U', () => {
        expect(elementalGauge.calculateDecayRate(2)).toBeCloseTo(7.5);
    });

    test('Decay rate of 4U', () => {
        expect(elementalGauge.calculateDecayRate(4)).toBeCloseTo(5.3125);
    });

    test('Decay rate of 8U', () => {
        expect(elementalGauge.calculateDecayRate(8)).toBeCloseTo(4.21875);
    });
});