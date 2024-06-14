"use client";

import { useState } from 'react';
import Image from 'next/image';
import Button from '@mui/material/Button';

import { ElementName, elementNames } from '../../simulator/model/Elements/ElementName';
import { ElementalGauge } from '../../simulator/model/Elements/ElementalGauge';
import { ElementType } from '../../simulator/model/Elements/ElementType';
import { Target } from '../../simulator/model/Target';
import { ReactionLog } from '../../simulator/model/Reactions/ReactionLog';

import Slider from '@mui/material/Slider';
import { Box, Grid, Typography } from '@mui/material';


export const TargetComponent = () => {
    const [units, setUnits] = useState(1 as number);
    const [freezeRes, setFreezeRes] = useState(0 as number);
    const [time, setTime] = useState(1 as number);
    const [target, setTarget] = useState(new Target());
    const [reactions, setReactions] = useState([] as ReactionLog[]);

    const elementColorMap: { [key: string]: string } = {
        'Pyro': 'red',
        'Hydro': 'brightblue',
        'Electro': 'purple',
        'Cryo': 'SkyBlue',
        'Dendro': 'green',
        'Anemo': 'SpringGreen',
        'Geo': 'Coral',
    };

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
        const elementImages: { [key: string]: string } = {};
        elementNames.forEach((element) => elementImages[element] = `/Element_${element}.png`);

        return target.auras.map((aura, index) => (
            <div key={index}>
                <h3>{aura.gaugeUnits.toFixed(2)}U {aura.element.name} Decay: {aura.decayRate.toFixed(3)}U/s</h3>
                <Image src={elementImages[aura.element.name]} alt={aura.element.name} height={50} width={50} />
            </div>
        ));
    };

    const handleUnitsChange = (event: Event, value: number | number[], activeThumb: number) => {
        if (typeof value === 'number') {
            setUnits(value);
        } else if (Array.isArray(value)) {
            setUnits(value[0]);
        }
    };

    const handleTimeChange = (event: Event, value: number | number[], activeThumb: number) => {
        if (typeof value === 'number') {
            setTime(value);
        } else if (Array.isArray(value)) {
            setTime(value[0]);
        }
    }

    const handleFreezeChange = (event: Event, value: number | number[], activeThumb: number) => {
        if (typeof value === 'number') {
            setFreezeRes(value);
        } else if (Array.isArray(value)) {
            setFreezeRes(value[0]);
        }

        const newTarget = new Target();
        Object.assign(newTarget, target);
        newTarget.freezeResist = freezeRes;

        setTarget(newTarget);
    }

    const renderReactionImages = () => {
        const elementImages: { [key: string]: string } = {};
        elementNames.forEach((element) => elementImages[element] = `/Element_${element}.png`);

        return reactions.map((reaction, index) => (
            <div key={index}>
                <h3> {reaction.name} ({reaction.coefficient}x)</h3>
                <Box display="flex" alignItems="center">
                    <Image src={elementImages[reaction.auraElement.element.name]} alt={reaction.auraElement.element.name} height={50} width={50} />
                    X
                    <Image src={elementImages[reaction.appliedElement.element.name]} alt={reaction.appliedElement.element.name} height={50} width={50} />
                </Box>
            </div>
        ));
    };

    const handleRemoveAuras = () => {
        const newTarget = new Target();
        Object.assign(newTarget, target); // Copy the current target's properties to the new target
        newTarget.auras = [];


        setReactions([]);
        setTarget(newTarget);
    }

    return (
        <div>
            <Typography
                variant="h1"
                gutterBottom
                style={{ fontSize: 'calc(1.5em + 2vw)' }} // Adjust the value as needed
            >
                Elemental Gauge Simulator
            </Typography>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box minHeight={250} maxHeight={325}>
                    <h2>Element Auras:</h2>
                    <div>{renderElementImages()}</div>
                </Box>

                <Box minHeight={250} maxHeight={325}>
                    <h2>Reactions Occurred:</h2>
                    <div>{renderReactionImages()}</div>
                </Box>
            </div>


            <div>
                <h2>Applied Element Unit:</h2>
                <Box style={{ width: 200 }}>
                    <Slider
                        value={units}
                        onChange={handleUnitsChange}
                        min={0}
                        max={8}
                        step={0.5}
                        aria-label="Default"
                        valueLabelDisplay="auto"
                        style={{ marginLeft: '8px' }}
                    />
                </Box>
                <Grid container spacing={1}>
                    {
                        elementNames.slice(0, 7).map((element, index) => (
                            <Grid item xs={5} sm={4} md={3} lg={0} key={index}>
                                <Button key={element} variant="contained" style={{ textShadow: "5", background: elementColorMap[element], justifySelf: "center" }} onClick={() => handleAddElement(element)}>
                                    {element} {units.toFixed(1)}U
                                </Button>
                            </Grid>
                        ))
                    }
                </Grid>

                <br />
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <div>
                        <h2>Simulate Time:</h2>
                        <Box style={{ width: 200 }}>
                            <Slider
                                value={time}
                                onChange={handleTimeChange}
                                min={0}
                                max={8}
                                step={0.1}
                                aria-label="Default"
                                valueLabelDisplay="auto"
                                style={{ marginLeft: '8px' }}
                            />
                        </Box>
                        <Button variant="contained" onClick={() =>
                            handleTimeStep()}>Time Step {time.toFixed(1)} seconds
                        </Button>
                    </div>

                    <div>
                        <h2>Enemy Freeze Resistance:</h2>
                        <Box style={{ width: 200 }}>
                            <Slider
                                value={freezeRes}
                                onChange={handleFreezeChange}
                                min={0}
                                max={1}
                                step={0.1}
                                aria-label="Default"
                                valueLabelDisplay="auto"
                                style={{ marginLeft: '8px' }}
                            />
                        </Box>
                    </div>
                </div>
            </div>


            <div style={{ display: "flex", justifyContent: "center", padding: "2em" }}>
                <Button variant="outlined" color='error' onClick={() =>
                    handleRemoveAuras()}>Remove Auras
                </Button>
            </div>
        </div>
    );
};