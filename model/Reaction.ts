import { GenshinElement } from "./GenshinElement";

export class Reaction {
    name: string;
    elements: GenshinElement[];
    coefficient: 0 | 0.5 | 1 | 2;

    constructor(name: string, elements: GenshinElement[], coefficient: 0 | 0.5 | 1 | 2) {
        this.name = name;
        this.elements = elements;
        this.coefficient = coefficient;
    }
}
