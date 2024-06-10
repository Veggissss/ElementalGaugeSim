import * as readline from 'readline';
import { ElementalGauge } from "./model/Elements/ElementalGauge";
import { ElementType } from "./model/Elements/ElementType";
import { Target } from "./model/Target";
import { ElementName, elementNames } from './model/Elements/ElementName';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Question function that wraps readline in a promise
const question = (query: string): Promise<string> => {
    return new Promise(resolve => rl.question(query, resolve));
}

// Async function to use await for readline
const main = async () => {
    // Define a target to apply elements to
    const target = new Target();

    // Show available element names
    console.log("ElementNames:\n" + elementNames);

    while (true) {
        const input = await question("Enter an element name followed by gauge units (int). Example: 'Pyro 2' ('q' to quit): ");
        if (input.toLowerCase() === 'q') {
            console.log("Goodbye! :)");
            break;
        }

        const [elementType, gaugeUnits] = input.split(' ');
        if (elementType as ElementName === undefined || isNaN(Number(gaugeUnits))) {
            console.error("Invalid input. Please enter an ElementName and an integer.");
        }
        else{
            const reactions = target.applyElement(new ElementalGauge(new ElementType(elementType as ElementName), Number(gaugeUnits)));
            console.log(reactions.map(reaction => reaction.name));

            console.log("\nResulting Target Auras:");
            target.auras.forEach(aura => {
                console.log(`Element: ${aura.element.name}, Gauge: ${aura.gaugeUnits}`);
            });

            target.timeStep(1);
        }
    }
    rl.close();
}

main();