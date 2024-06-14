import { Reaction } from "./Reaction";
import { ElementalGauge } from "../Elements/ElementalGauge";


export class ReactionLog extends Reaction {
	public auraElement : ElementalGauge;
    public appliedElement : ElementalGauge;

    constructor(reaction: Reaction, auraElement: ElementalGauge, appliedElement: ElementalGauge) {
        super(reaction.name, reaction.auraElementName, reaction.appliedElementName, reaction.coefficient);

        this.auraElement = auraElement;
        this.appliedElement = appliedElement;
    }
}
