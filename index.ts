import { ElementalGauge } from "./model/Elements/ElementalGauge";
import { ElementType } from "./model/Elements/ElementType";
import { Target } from "./model/Target";

const target = new Target();
//target.applyElement(new ElementalGauge('Pyro', 1));
//target.applyElement(new ElementalGauge('Cryo', 1));
//target.applyElement(new ElementalGauge('Cryo', 1));

//target.applyElement(new ElementalGauge(new ElementType('Hydro'), 1));
//target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1));
//target.applyElement(new ElementalGauge(new ElementType('Hydro'), 1));

//target.applyElement(new ElementalGauge(new ElementType('Cryo'), 1));
//target.applyElement(new ElementalGauge(new ElementType('Hydro'), 2));

//target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1));
//target.timeStep(1);
//target.applyElement(new ElementalGauge(new ElementType('Electro'), 2));

target.applyElement(new ElementalGauge(new ElementType('Dendro'), 1.5));
target.applyElement(new ElementalGauge(new ElementType('Pyro'), 1));
target.timeStep(1);
target.timeStep(1);
target.timeStep(1);



console.log("\nResulting Target Auras:");
target.auras.forEach(aura => {
    console.log(`Element: ${aura.element.name}, Gauge: ${aura.gaugeUnits}`);
});