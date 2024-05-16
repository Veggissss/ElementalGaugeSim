import { GenshinElement } from "./GenshinElement";

export class Reaction {
    name: string;
    elements: GenshinElement[];
    coefficient: number;

    constructor(name: string, elements: GenshinElement[], coefficient: 0 | 0.5 | 1 | 2 | typeof Infinity) {
        this.name = name;
        this.elements = elements;
        this.coefficient = coefficient;
    }
}
