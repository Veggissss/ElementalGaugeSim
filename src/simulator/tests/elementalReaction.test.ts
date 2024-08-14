import { ElementalGauge } from '../model/Elements/ElementalGauge';
import { ElementType } from '../model/Elements/ElementType';
import { Target } from '../model/Target';

describe('same applied element inherits decay rate and updates gauge', () => {
    test('applying 1U of cryo and then 2U of cryo', () => {
        const target = new Target();
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

describe('superconduct elemental reaction', () => {
    test('applying 2U of cryo and applying 1U of electro', () => {
        const target = new Target();
        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 2));

        let cryoAura = target.auras[0];
        expect(cryoAura.gaugeUnits).toBeCloseTo(1.6); // 2U * 0.8 = 1.6U

        target.applyElement(new ElementalGauge(new ElementType('Electro'), 1));

        let electroAura = target.auras[0];
        expect(electroAura.gaugeUnits).toBeCloseTo(0.6);
    });
});


describe('Adding hydro and cryo to a target causes a freeze reaction', () => {

    test('Adding 2U hydro to a target that has 1U cryo, leaves only a frozen aura.', () => {
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 1));

        let cryoAura = target.auras[0];
        expect(cryoAura.gaugeUnits).toBeCloseTo(0.8);
        expect(cryoAura.decayRate).toBeCloseTo(11.875);

        target.applyElement(new ElementalGauge(new ElementType('Hydro'), 2));

        expect(target.auras[0].element.name).toBe('Frozen');
        expect(target.auras.find(aura => aura.element.name == 'Hydro')).not.toBeDefined();
    });

    test('Adding 1U cryo to a target that has 2U hydro, leaves both a hydro and a frozen aura.', () => {
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Hydro'), 2));
        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 1));

        expect(target.auras.find(aura => aura.element.name == 'Frozen')).toBeDefined();
        expect(target.auras.find(aura => aura.element.name == 'Hydro')).toBeDefined();
    });

    test('Adding 1U hydro to a target with a 2U cryo aura and 1U dendro results in only a frozen aura.', () => {
        const target = new Target();
        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1));
        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 2));

        expect(target.auras.find(aura => aura.element.name == 'Cryo')).toBeDefined();
        expect(target.auras.find(aura => aura.element.name == 'Dendro')).toBeDefined();

        const reactionLog = target.applyElement(new ElementalGauge(new ElementType('Hydro'), 1));

        expect(reactionLog.find(reaction => reaction.name == 'Freeze')).toBeDefined();
        expect(reactionLog.find(reaction => reaction.name == 'Reverse Bloom')).not.toBeDefined();
    });

    test('Adding 1U hydro to a target with a 1U cryo aura and 1U dendro results in both a frozen aura and a bloom reaction.', () => {
        const target = new Target();
        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1));
        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 1));

        expect(target.auras.find(aura => aura.element.name == 'Cryo')).toBeDefined();
        expect(target.auras.find(aura => aura.element.name == 'Dendro')).toBeDefined();

        const reactionLog = target.applyElement(new ElementalGauge(new ElementType('Hydro'), 1));

        expect(reactionLog.find(reaction => reaction.name == 'Freeze')).toBeDefined();
        expect(reactionLog.find(reaction => reaction.name == 'Reverse Bloom')).toBeDefined();
    });
});

describe('Adding electro and dendro to a target causes a quicken reaction', () => {

    test('Adding 2U electro to a target with 1U dendro causes a spread quicken reaction', () => {
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1));

        // Apply electro
        target.applyElement(new ElementalGauge(new ElementType('Electro'), 2));

        // Leads to a quicken aura
        expect(target.auras.find(aura => aura.element.name == 'Quicken')).toBeDefined();

        expect(target.auras.find(aura => aura.element.name == 'Electro')).not.toBeDefined();
        expect(target.auras.find(aura => aura.element.name == 'Dendro')).not.toBeDefined();

        target.applyElement(new ElementalGauge(new ElementType('Electro'), 2));
        expect(target.auras.find(aura => aura.element.name == 'Electro')).toBeDefined();
        expect(target.auras.find(aura => aura.element.name == 'Quicken')).toBeDefined();
    })
})

describe('Adding electro and hydro to a target causes an electro-charge reaction', () => {

    test('Adding 1U electro to a target with 1U hydro removes 0.4U/s. Ticking immediately once applied and then once every second.', () => {
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Hydro'), 1));

        // Apply electro
        target.applyElement(new ElementalGauge(new ElementType('Electro'), 1));

        let electroAura = target.auras.find(aura => aura.element.name == 'Electro');
        let hydroAura = target.auras.find(aura => aura.element.name == 'Hydro');

        expect(electroAura).toBeDefined();
        expect(hydroAura).toBeDefined();

        // 1U * 0.8-tax = 0.8U - 0.4U EC Tick = 0.4U
        expect(electroAura?.gaugeUnits).toBeCloseTo(0.4);
        expect(hydroAura?.gaugeUnits).toBeCloseTo(0.4);

        // Remove 0.4U of electro and hydro auras = 0U
        target.timeStep(1);

        // Check that both auras are removed
        electroAura = target.auras.find(aura => aura.element.name == 'Electro');
        hydroAura = target.auras.find(aura => aura.element.name == 'Hydro');

        expect(electroAura).not.toBeDefined();
        expect(hydroAura).not.toBeDefined();
    })
})

describe('Adding pyro to a target with dendro causes burning reaction', () => {

    test('A burning aura with 2U and the underlying dendro aura should have a decay rate of 2.5s/U', () => {
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1));
        target.applyElement(new ElementalGauge(new ElementType('Pyro'), 1));

        const burningAura = target.auras.find(aura => aura.element.name == 'Burning');
        expect(burningAura).toBeDefined();
        expect(burningAura?.gaugeUnits).toBe(2);

        const dendroAura = target.auras.find(aura => aura.element.name == 'Dendro');
        expect(dendroAura).toBeDefined();
        expect(dendroAura?.decayRate).toBe(2.5);
    })

    test('A burning aura caused by adding 1.5U dendro and 1U pyro should last for 3 seconds.', () => {
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1.5));
        target.applyElement(new ElementalGauge(new ElementType('Pyro'), 1));

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
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1));
        target.applyElement(new ElementalGauge(new ElementType('Pyro'), 1));

        target.timeStep(1);

        // Extinguish burning aura and react with underlying dendro
        const reactions = target.applyElement(new ElementalGauge(new ElementType('Hydro'), 2));

        // See burning reacted
        expect(reactions.find(reaction => reaction.name === 'Vaporize')).toBeTruthy();

        // Check that reverse bloom occurred through the burning aura
        expect(reactions.find(reaction => reaction.name === 'Reverse Bloom')).toBeTruthy();
    })

    test('An extinguished burning aura results in dendro which can NOT be reached by a weak reactor element (1U)', () => {
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1));
        target.applyElement(new ElementalGauge(new ElementType('Pyro'), 1));

        target.timeStep(1);

        // Extinguish burning aura and react with underlying dendro
        const reactions = target.applyElement(new ElementalGauge(new ElementType('Hydro'), 1));

        // See burning reacted
        expect(reactions.find(reaction => reaction.name === 'Vaporize')).toBeTruthy();

        // Check that reverse bloom occurred through the burning aura
        expect(reactions.find(reaction => reaction.name === 'Reverse Bloom')).not.toBeTruthy();
    })
})