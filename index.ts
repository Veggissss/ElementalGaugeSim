import { ElementalGauge } from "./model/ElementalGauge";
import { Target } from "./model/Target";

const target = new Target();
//target.applyElement(new ElementalGauge('Pyro', 1));
//target.applyElement(new ElementalGauge('Cryo', 1));
//target.applyElement(new ElementalGauge('Cryo', 1));

target.applyElement(new ElementalGauge('Hydro', 1));
target.applyElement(new ElementalGauge('Dendro', 1));
target.applyElement(new ElementalGauge('Hydro', 1));

console.log("\nResulting Target Auras:");
target.auras.forEach(aura => {
    console.log(`Element: ${aura.element}, Gauge: ${aura.gaugeUnits}`);
});