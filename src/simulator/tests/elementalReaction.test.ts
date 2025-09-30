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

    test('Adding 1U hydro to a target with a 1U cryo aura results a frozen aura.', () => {
        const target = new Target();
        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 1));
        const reactionLog = target.applyElement(new ElementalGauge(new ElementType('Hydro'), 1));

        // Consumed auras
        expect(target.getElement('Cryo')).not.toBeDefined();
        expect(target.getElement('Hydro')).not.toBeDefined();

        expect(reactionLog.find(reaction => reaction.name === 'Freeze')).toBeDefined();
        expect(target.getElement('Frozen')).toBeDefined();
    });

    test('Adding 1U pyro to a target with a frozen and underlying cryo aura will remove both.', () => {
        const target = new Target();
        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 2));
        target.applyElement(new ElementalGauge(new ElementType('Hydro'), 2));

        // Underlying 1U Cryo
        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 1));

        // Melt off the frozen aura; with normal guage calc it would be a remaining cryo aura, but melt is an exception
        target.applyElement(new ElementalGauge(new ElementType('Pyro'), 2));

        expect(target.getElement('Cryo')).not.toBeDefined()
        expect(target.getElement('Frozen')).not.toBeDefined()
    });

    test('Adding 1U geo/shatter to a target with a frozen and underlying cryo aura will only remove frozen.', () => {
        const target = new Target();
        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 2));
        target.applyElement(new ElementalGauge(new ElementType('Hydro'), 2));
        expect(target.getElement('Frozen')).toBeDefined();
        expect(target.getElement('Cryo')).not.toBeDefined();

        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 1));
        target.applyElement(new ElementalGauge(new ElementType('Geo'), 1));

        expect(target.getElement('Frozen')).not.toBeDefined();
        expect(target.getElement('Cryo')).toBeDefined();
    });

    test('Adding 2U hydro to a target that has 1U cryo, leaves only a frozen aura.', () => {
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 1));

        let cryoAura = target.auras[0];
        expect(cryoAura.gaugeUnits).toBeCloseTo(0.8);
        expect(cryoAura.decayRate).toBeCloseTo(11.875);

        target.applyElement(new ElementalGauge(new ElementType('Hydro'), 2));

        expect(target.auras[0].element.name).toBe('Frozen');
        expect(target.getElement('Hydro')).not.toBeDefined();
    });

    test('Adding 1U cryo to a target that has 2U hydro, leaves both a hydro and a frozen aura.', () => {
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Hydro'), 2));
        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 1));

        expect(target.getElement('Frozen')).toBeDefined();
        expect(target.getElement('Hydro')).toBeDefined();
    });

    test('Adding two instances of 1U pyro to a target that has both a frozen and a hydro aura will first melt and then vaporize.', () => {
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Hydro'), 2));
        const freezeReactionLog = target.applyElement(new ElementalGauge(new ElementType('Cryo'), 1));
        expect(freezeReactionLog.find(reaction => reaction.name === 'Freeze')).toBeDefined();

        expect(target.getElement('Cryo')).not.toBeDefined();

        const meltReactionLog = target.applyElement(new ElementalGauge(new ElementType('Pyro'), 1));
        expect(meltReactionLog.find(reaction => reaction.name === 'Melt')).toBeDefined();

        // Check auras
        expect(target.getElement('Frozen')).not.toBeDefined();
        expect(target.getElement('Hydro')).toBeDefined();

        const vaporizeReactionLog = target.applyElement(new ElementalGauge(new ElementType('Pyro'), 1));
        expect(vaporizeReactionLog.find(reaction => reaction.name === 'Reverse Vaporize')).toBeDefined()
    });

    test('Adding 1U hydro to a target with a 2U cryo aura and 1U dendro results in only a frozen aura.', () => {
        const target = new Target();
        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1));
        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 2));

        expect(target.getElement('Cryo')).toBeDefined();
        expect(target.getElement('Dendro')).toBeDefined();

        const reactionLog = target.applyElement(new ElementalGauge(new ElementType('Hydro'), 1));

        expect(reactionLog.find(reaction => reaction.name === 'Freeze')).toBeDefined();
        expect(reactionLog.find(reaction => reaction.name === 'Reverse Bloom')).not.toBeDefined();
    });

    test('Adding 1U hydro to a target with a 1U cryo aura and 1U dendro results in both a frozen aura and a bloom reaction.', () => {
        const target = new Target();
        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1));
        target.applyElement(new ElementalGauge(new ElementType('Cryo'), 1));

        expect(target.getElement('Cryo')).toBeDefined();
        expect(target.getElement('Dendro')).toBeDefined();

        const reactionLog = target.applyElement(new ElementalGauge(new ElementType('Hydro'), 1));

        expect(reactionLog.find(reaction => reaction.name === 'Freeze')).toBeDefined();
        expect(reactionLog.find(reaction => reaction.name === 'Reverse Bloom')).toBeDefined();
    });
});

describe('Adding electro and dendro to a target causes a quicken reaction', () => {

    test('Adding 2U electro to a target with 1U dendro causes a spread quicken reaction without resulting electro aura', () => {
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1));

        // Apply electro
        target.applyElement(new ElementalGauge(new ElementType('Electro'), 2));

        // Leads to a quicken aura
        expect(target.getElement('Quicken')).toBeDefined();

        expect(target.getElement('Electro')).not.toBeDefined();
        expect(target.getElement('Dendro')).not.toBeDefined();

        target.applyElement(new ElementalGauge(new ElementType('Electro'), 2));
        expect(target.getElement('Electro')).toBeDefined();
        expect(target.getElement('Quicken')).toBeDefined();
    })

    test('Adding 1U dendro to a target with 2U electro causes a spread quicken reaction with resulting electro aura', () => {
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Electro'), 2));
        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1));

        // Leads to a quicken aura
        expect(target.getElement('Quicken')).toBeDefined();
        expect(target.getElement('Electro')).toBeDefined();

        // No underlying dendro aura
        expect(target.getElement('Dendro')).not.toBeDefined();
    })

    test('Triggering a second quicken reaction refreshes the quicken aura if the gauge is larger', () => {
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Electro'), 1));
        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1));
        expect(target.getElement('Quicken')).toBeDefined();
        let quickenAura = target.getElement('Quicken');
        expect(quickenAura?.gaugeUnits).toBeCloseTo(0.8);

        // Larger aura will refresh the quicken aura
        target.applyElement(new ElementalGauge(new ElementType('Electro'), 2));
        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 2));
        quickenAura = target.getElement('Quicken');
        expect(quickenAura?.gaugeUnits).toBeCloseTo(1.6);

        // Smaller aura will not refresh the quicken aura
        target.applyElement(new ElementalGauge(new ElementType('Electro'), 1));
        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1));
        expect(target.getElement('Quicken')).toBeDefined();
        quickenAura = target.getElement('Quicken');
        expect(quickenAura?.gaugeUnits).toBeCloseTo(1.6);
    })

    test('Applying 2U with hydro to a quicken aura with underlying dendro results in a two bloom', () => {
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 2));
        target.applyElement(new ElementalGauge(new ElementType('Electro'), 1));

        // Leads to a quicken aura with underlying dendro aura
        expect(target.getElement('Quicken')).toBeDefined();
        expect(target.getElement('Dendro')).toBeDefined();

        target.applyElement(new ElementalGauge(new ElementType('Hydro'), 1));
        let quickenAura = target.getElement('Quicken');
        let dendroAura = target.getElement('Dendro');
        expect(quickenAura).toBeDefined();
        expect(dendroAura).toBeDefined();

        // Should have the same gauge units in this scenario
        expect(quickenAura?.gaugeUnits ?? 0).toBeCloseTo(dendroAura?.gaugeUnits ?? 0);

        target.applyElement(new ElementalGauge(new ElementType('Hydro'), 1));
        quickenAura = target.getElement('Quicken');
        dendroAura = target.getElement('Dendro');
        expect(quickenAura).not.toBeDefined();
        expect(dendroAura).not.toBeDefined();
    })
})

describe('Adding electro and hydro to a target causes an electro-charge reaction', () => {

    test('Adding 1U electro to a target with 1U hydro removes 0.4U/s. Ticking immediately once applied and then once every second.', () => {
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Hydro'), 1));

        // Apply electro
        target.applyElement(new ElementalGauge(new ElementType('Electro'), 1));

        let electroAura = target.getElement('Electro');
        let hydroAura = target.getElement('Hydro');

        expect(electroAura).toBeDefined();
        expect(hydroAura).toBeDefined();

        // 1U * 0.8-tax = 0.8U - 0.4U EC Tick = 0.4U
        expect(electroAura?.gaugeUnits).toBeCloseTo(0.4);
        expect(hydroAura?.gaugeUnits).toBeCloseTo(0.4);

        // Remove 0.4U of electro and hydro auras = 0U
        target.timeStep(1);

        // Check that both auras are removed
        electroAura = target.getElement('Electro');
        hydroAura = target.getElement('Hydro');

        expect(electroAura).not.toBeDefined();
        expect(hydroAura).not.toBeDefined();
    })
})

describe('Adding pyro to a target with dendro causes burning reaction', () => {

    test('A burning aura with 2U and the underlying dendro aura should have a decay rate of 2.5s/U', () => {
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1));
        target.applyElement(new ElementalGauge(new ElementType('Pyro'), 1));

        const burningAura = target.getElement('Burning');
        expect(burningAura).toBeDefined();
        expect(burningAura?.gaugeUnits).toBe(2);

        const dendroAura = target.getElement('Dendro');
        expect(dendroAura).toBeDefined();
        expect(dendroAura?.decayRate).toBe(2.5);
    })

    test('A burning aura caused by adding 1.5U dendro and 1U pyro should last for 3 seconds.', () => {
        const target = new Target();

        target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1.5));
        target.applyElement(new ElementalGauge(new ElementType('Pyro'), 1));

        // Last for at least 3 seconds
        target.timeStep(2);

        let burningAura = target.getElement('Burning');
        expect(burningAura).toBeDefined();

        // Reapplied underlying pyro should be 1U * 0.8 = 0.8U
        let pyroAura = target.getElement('Pyro');
        expect(pyroAura?.gaugeUnits).toBe(0.8);

        // Burning expire after 2+1=3 seconds
        target.timeStep(1);
        // Dendro used up
        const dendroAura = target.getElement('Dendro');
        expect(dendroAura).not.toBeDefined();

        burningAura = target.getElement('Burning');
        expect(burningAura).not.toBeDefined();

        // Pyro aura decays completely 9.5s after refresh 
        target.timeStep(8.4);
        pyroAura = target.getElement('Pyro');
        expect(pyroAura).toBeDefined();

        // Pyro expired
        target.timeStep(0.1);
        pyroAura = target.getElement('Pyro');
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