import { ElementalGauge } from "../model/Elements/ElementalGauge";
import { ElementType } from "../model/Elements/ElementType";
import { Target } from "../model/Target";

describe('superconduct elemental reaction', () => {
    const target = new Target();
    test('applying 2U of cryo', () => {
        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 2))
    
        let aura = target.auras[0];
        expect(aura.gaugeUnits).toBeCloseTo(1.6); // 2U * 0.8 = 1.6U
    });

    test('applying 1U of electro', () => {
        target.applyElement(new ElementalGauge(new ElementType('Electro'), 1));

        let aura = target.auras[0];
        expect(aura.gaugeUnits).toBeCloseTo(0.6);
    });
});

describe('same applied element inherits decay rate and updates gauge', () => {
    const target = new Target();
    test('applying 1U of cryo and then 2U of cryo', () => {
        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 1));

        let aura = target.auras[0];
        expect(aura.gaugeUnits).toBeCloseTo(0.8);
        expect(aura.decayRate).toBeCloseTo(11.875);

        // New cryo aura should inherit the decay rate of the existing aura
        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 2));

        let updatedAura = target.auras[0];
        expect(updatedAura.gaugeUnits).toBeCloseTo(1.6);
        expect(updatedAura.decayRate).toBeCloseTo(11.875);
    });
});

describe('Adding hydro and cryo to a target causes a freeze reaction', () => {
    const target = new Target();

    test('Adding 2U hydro to a target that has 1U cryo, leaves both a frozen and a hydro aura.', () => {
        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 1));

        let cryoAura = target.auras[0];
        expect(cryoAura.gaugeUnits).toBeCloseTo(0.8);
        expect(cryoAura.decayRate).toBeCloseTo(11.875);

        target.applyElement(new ElementalGauge(new ElementType('Hydro'), 2));

        expect(target.auras[0].element.name).toBe('Frozen');
        expect(target.auras[1].element.name).toBe('Hydro');

        expect(target.auras[1].gaugeUnits).toBeCloseTo(1.6);
    });

    test('Adding 1U cryo to a target that has 2U hydro, leaves only a frozen aura.', () => {
        target.applyElement(new ElementalGauge(new ElementType('Hydro'), 2));
        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 1));

        expect(target.auras[0].element.name).toBe('Frozen');
        expect(target.auras.find(aura => aura.element.name == 'Hydro')).not.toBeDefined();
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

    test('A burning aura with 2U and the underlying dendro aura should have a decay rate of 2.5s/U', () => {
        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1))
        target.applyElement(new ElementalGauge(new ElementType('Pyro'), 1))

        const burningAura = target.auras.find(aura => aura.element.name == 'Burning');
        expect(burningAura).toBeDefined();
        expect(burningAura?.gaugeUnits).toBe(2);

        const dendroAura = target.auras.find(aura => aura.element.name == 'Dendro');
        expect(dendroAura).toBeDefined()
        expect(dendroAura?.decayRate).toBe(2.5)
    })

    test('A burning aura caused by adding 1.5U dendro and 1U pyro should last for 3 seconds.', () => {
        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1.5))
        target.applyElement(new ElementalGauge(new ElementType('Pyro'), 1))

        // Last for at least 3 seconds
        target.timeStep(2);

        let burningAura = target.auras.find(aura => aura.element.name == 'Burning');
        expect(burningAura).toBeDefined();

        // Reapplied underlying pyro should be 1U * 0.8 = 0.8U
        let pyroAura = target.auras.find(aura => aura.element.name == 'Pyro');
        expect(pyroAura?.gaugeUnits).toBe(0.8); 

        // Burning expire after 2+1=3 seconds
        target.timeStep(1);
        // Dendro used up
        const dendroAura = target.auras.find(aura => aura.element.name == 'Dendro');
        expect(dendroAura).not.toBeDefined();

        burningAura = target.auras.find(aura => aura.element.name == 'Burning');
        expect(burningAura).not.toBeDefined();

        // Pyro aura decays completely 9.5s after refresh 
        target.timeStep(8.4);
        pyroAura = target.auras.find(aura => aura.element.name == 'Pyro');
        expect(pyroAura).toBeDefined();

        // Pyro expired
        target.timeStep(0.1);
        pyroAura = target.auras.find(aura => aura.element.name == 'Pyro');
        expect(pyroAura).not.toBeDefined();
    })

    test('An extinguished burning aura results in dendro which can be reached by a strong reactor', () => {
        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1))
        target.applyElement(new ElementalGauge(new ElementType('Pyro'), 1))

        target.timeStep(1);
        
        // Extinguish burning aura and react with underlying dendro
        const reactions = target.applyElement(new ElementalGauge(new ElementType('Hydro'), 2))
        
        // See burning reacted
        expect(reactions.find(reaction => reaction.name === "Vaporize")).toBeTruthy();

        // Check that reverse bloom occurred through the burning aura
        expect(reactions.find(reaction => reaction.name === "Reverse Bloom")).toBeTruthy();
    })

})