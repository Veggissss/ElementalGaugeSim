"use client";

import { useState } from 'react';
import Image from 'next/image';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { ElementName, elementNames } from '../../../simulator/model/Elements/ElementName';
import { ElementalGauge } from '../../../simulator/model/Elements/ElementalGauge';
import { ElementType } from '../../../simulator/model/Elements/ElementType';
import { Target } from '../../../simulator/model/Target';
import { Reaction } from '../../../simulator/model/Reactions/Reaction';

export const TargetComponent = () => {
    const [units, setUnits] = useState(1 as number);
    const [time, setTime] = useState(1 as number);
    const [target, setTarget] = useState(new Target());
    const [reactions, setReactions] = useState([] as Reaction[]);

    const handleAddElement = (element: ElementName) => {
        const newTarget = new Target();
        Object.assign(newTarget, target); // Copy the current target's properties to the new target

        const reactions = newTarget.applyElement(new ElementalGauge(new ElementType(element), units));

        setTarget(newTarget);
        setReactions(reactions);
    };

    const handleTimeStep = () => {
        const newTarget = new Target();
        Object.assign(newTarget, target); // Copy the current target's properties to the new target

        newTarget.timeStep(time);

        setTarget(newTarget);
    };

    const renderElementImages = () => {
        let elementImages: { [key: string]: string } = {};
        for (const element of elementNames) {
            elementImages[element] = `/Element_${element}.png`;
        }

        return target.auras.map((aura, index) => (
            <div key={index}>
                <h3> {aura.element.name} x {aura.gaugeUnits.toFixed(2)}U</h3>
                <Image src={elementImages[aura.element.name]} alt={aura.element.name} height={50} width={50} />
            </div>
        ));
    };

    const handleUnitsChange = (event: { target: { value: string; }; }) => {
        setUnits(parseFloat(event.target.value));
    };

    const handleTimeChange = (event: { target: { value: string; }; }) => {
        setTime(parseFloat(event.target.value));
    }

    const renderReactionImages = () => {
        return reactions.map((reaction, index) => (
            <div key={index}>
                <h3> {reaction.name} ({reaction.coefficient}x)</h3>
            </div>
        ));
    };

    return (
        <div>
            <h1>Elemental Gauge Simulator</h1>
            <div>
                <h2>Applied Element Unit:</h2>
                <TextField
                    type="number"
                    inputProps={{ step: 0.5, min: 0, max: 10 }}
                    value={units}
                    helperText="Gauge Units"
                    onChange={handleUnitsChange}
                    variant="outlined"
                    size="small"
                    style={{ marginLeft: '4px', backgroundColor: 'DarkGrey' }}
                />
                {
                    elementNames.map((element) => (
                        <Button key={element} variant="contained" onClick={() =>
                            handleAddElement(element)}>ADD {element}
                        </Button>
                    ))

                }
                <div>
                    <h2>Simulate Time:</h2>
                    <TextField
                        type="number"
                        inputProps={{ step: 0.5, min: 0, max: 10 }}
                        value={time}
                        onChange={handleTimeChange}
                        helperText="Seconds"
                        variant="outlined"
                        size="small"
                        style={{ marginLeft: '4px', backgroundColor: 'DarkGrey' }}
                    />
                    <Button variant="contained" onClick={() =>
                        handleTimeStep()}>Time Step
                    </Button>
                </div>
            </div>
            <div>
                <h2>Elements Added:</h2>
                <div>{renderElementImages()}</div>
            </div>

            <div>
                <h2>Reactions Occurred:</h2>
                <div>{renderReactionImages()}</div>
            </div>
        </div>
    );
};