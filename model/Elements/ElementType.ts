import { ElementName } from "./ElementName";

export class ElementType{
    name: ElementName;
    canBeAura: boolean;

    constructor(name: ElementName){
        this.name = name;
        this.canBeAura = name != 'Anemo' && name != 'Geo';
    }
}
