import { calculateDecayRate } from "../model/ElementalGauge";

// Test the calculateDecayRate function
// Known values: https://library.keqingmains.com/resources/compendiums/elemental-gauges
describe('Testing decay calculation for known gauge unit values', () => {
    test('Decay rate of 1U', () => {
        expect(calculateDecayRate(1)).toBeCloseTo(11.875);
    });

    test('Decay rate of 1.5U', () => {
        expect(calculateDecayRate(1.5)).toBeCloseTo(8.9583);
    });

    test('Decay rate of 2U', () => {
        expect(calculateDecayRate(2)).toBeCloseTo(7.5);
    });

    test('Decay rate of 4U', () => {
        expect(calculateDecayRate(4)).toBeCloseTo(5.3125);
    });

    test('Decay rate of 8U', () => {
        expect(calculateDecayRate(8)).toBeCloseTo(4.21875);
    });
});