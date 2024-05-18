import { ElementalGauge } from "../model/Elements/ElementalGauge";
import { ElementType } from "../model/Elements/ElementType";
import { Target } from "../model/Target";

describe('superconduct elemental reaction', () => {
    const target = new Target();
    test('applying 2U of cryo', () => {
        // 2U * 0.8 = 1.6U
        expect(target.applyElement(new ElementalGauge(new ElementType('Cryo'), 2))[0].gaugeUnits).toBeCloseTo(1.6);
    });

    test('applying 1U of electro', () => {
        expect(target.applyElement(new ElementalGauge(new ElementType('Electro'), 1))[0].gaugeUnits).toBeCloseTo(0.6);
    });
});

describe('same applied element inherits decay rate and updates gauge', () => {
    const target = new Target();
    test('applying 1U of cryo and then 2U of cryo', () => {
        let aura = target.applyElement(new ElementalGauge(new ElementType('Cryo'), 1))[0];
        expect(aura.gaugeUnits).toBeCloseTo(0.8);
        expect(aura.decayRate).toBeCloseTo(11.875);

        // New cryo aura should inherit the decay rate of the existing aura
        let updatedAura = target.applyElement(new ElementalGauge(new ElementType('Cryo'), 2))[0];
        expect(updatedAura.gaugeUnits).toBeCloseTo(1.6);
        expect(updatedAura.decayRate).toBeCloseTo(11.875);
    });
});

describe('Adding hydro and cryo to a target causes a freeze reaction', () => {
    const target = new Target();

    test('Adding 2U hydro to a target that has 1U cryo, leaves both a frozen and a hydro aura.', () => {
        let cryoAura = target.applyElement(new ElementalGauge(new ElementType('Cryo'), 1))[0];
        expect(cryoAura.gaugeUnits).toBeCloseTo(0.8);
        expect(cryoAura.decayRate).toBeCloseTo(11.875);


        let auras = target.applyElement(new ElementalGauge(new ElementType('Hydro'), 2));
        expect(auras[0].element.name).toBe('Frozen');
        expect(auras[1].element.name).toBe('Hydro');
    });

    test('Adding 1U cryo to a target that has 2U hydro, leaves only a frozen aura.', () => {
        target.applyElement(new ElementalGauge(new ElementType('Hydro'), 2))[0];

        let auras = target.applyElement(new ElementalGauge(new ElementType('Cryo'), 1));
        expect(auras[0].element.name).toBe('Frozen');

        expect(auras.find(aura => aura.element.name == 'Hydro')).not.toBeDefined();
    });

});

describe('Adding electro and dendro to a target causes a quicken reaction', () => {
    const target = new Target();

    test('Adding 2U electro to a target with 1U dendro causes a spread quicken reaction', () => {
        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1))

        // Apply electro
        target.applyElement(new ElementalGauge(new ElementType('Electro'), 2))

        expect(target.auras.find(aura => aura.element.name == "Quicken")).toBeDefined();

        // The underlying auras should stay
        expect(target.auras.find(aura => aura.element.name == "Electro")).toBeDefined();
        expect(target.auras.find(aura => aura.element.name == "Dendro")).toBeDefined();
    })
})

describe('Adding pyro to a target with dendro causes burning reaction', () => {
    const target = new Target();

    test('A burning aura with 2U and the underlying dendro aura should have a decay rate of 0.4U/s', () => {
        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1))
        target.applyElement(new ElementalGauge(new ElementType('Pyro'), 1))

        const burningAura = target.auras.find(aura => aura.element.name == 'Burning');
        expect(burningAura).toBeDefined();
        expect(burningAura?.gaugeUnits).toBe(2);

        const dendroAura = target.auras.find(aura => aura.element.name == 'Dendro');
        expect(dendroAura).toBeDefined()
        expect(dendroAura?.decayRate).toBe(2.5)
    })

    //TODO simulate extinguish burning aura and react with underlying auras in same reaction.
})