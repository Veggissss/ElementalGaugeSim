"use client";

import { useState } from 'react';
import Image from 'next/image';

import { ElementName, elementNames } from '../../../simulator/model/Elements/ElementName';
import { ElementalGauge } from '../../../simulator/model/Elements/ElementalGauge';
import { ElementType } from '../../../simulator/model/Elements/ElementType'; 
import { Target } from '../../../simulator/model/Target';

export const TargetComponent = () => {
    const [target, setTarget] = useState(new Target());

    const handleAddElement = (element: ElementName) => {
        const newTarget = new Target();
        Object.assign(newTarget, target); // Copy the current target's properties to the new target

        const reactions = newTarget.applyElement(new ElementalGauge(new ElementType(element), 1));

        console.log(newTarget.auras);
        console.log(reactions);

        setTarget(newTarget);
    };

    const renderElementImages = () => {
        let elementImages: { [key: string]: string } = {};
        for (const element of elementNames) {
            elementImages[element] = `/Element_${element}.png`;
        }
        
        return target.auras.map((aura, index) => (
            <Image key={index} src={elementImages[aura.element.name]} alt={aura.element.name} height={50} width={50}/>
        ));
    };

    return (
        <div>
            <h1>Elemental Gauge Simulator</h1>
            <div>
                {
                    elementNames.map((element) => (
                        <button key={element} onClick={() =>
                            handleAddElement(element)}>
                                ADD {element}   .
                        </button>
                    ))
                }
            </div>
            <div>
                <h2>Elements Added:</h2>
                <div>{renderElementImages()}</div>
            </div>
        </div>
    );
};