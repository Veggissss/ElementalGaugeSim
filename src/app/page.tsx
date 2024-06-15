"use client";

import "./globals.css";

import React, { useState } from 'react';
import { Typography } from '@mui/material';

import ElementAuras from './components/ElementAuras';
import ElementButtons from './components/ElementButtons';
import ElementUnitSlider from './components/ElementUnitSlider';
import FreezeResistSlider from './components/FreezeResistSlider';
import ReactionsOccurred from './components/ReactionsOccurred';
import RemoveAurasButton from './components/RemoveAurasButton';
import TimeSlider from './components/TimeSlider';

import { ElementalGauge } from '../simulator/model/Elements/ElementalGauge';
import { ElementName } from '../simulator/model/Elements/ElementName';
import { ElementType } from '../simulator/model/Elements/ElementType';
import { ReactionLog } from '../simulator/model/Reactions/ReactionLog';
import { Target } from '../simulator/model/Target';

export default function Page() {
    const [units, setUnits] = useState(1);
    const [freezeRes, setFreezeRes] = useState(0);
    const [time, setTime] = useState(1);
    const [target, setTarget] = useState(new Target());
    const [reactions, setReactions] = useState<ReactionLog[]>([]);
    const elementColorMap = new Map<ElementName, string>([
        ['Pyro', 'red'],
        ['Hydro', 'brightblue'],
        ['Electro', 'purple'],
        ['Cryo', 'SkyBlue'],
        ['Dendro', 'green'],
        ['Anemo', 'SpringGreen'],
        ['Geo', 'Coral'],
    ]);

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
                style={{ fontSize: 'calc(1.2em + 2vw)' }}
            >
                Elemental Gauge Simulator
            </Typography>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: "1em" }}>
                <ElementAuras target={target} />
                <ReactionsOccurred reactions={reactions} />
            </div>

            <div style={{ paddingLeft: "1em", paddingRight: "1em" }}>
                <ElementUnitSlider units={units} handleUnitsChange={handleUnitsChange} />
                <ElementButtons units={units} elementColorMap={elementColorMap} handleAddElement={handleAddElement} />
                <br />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <TimeSlider time={time} handleTimeChange={handleTimeChange} handleTimeStep={handleTimeStep} />
                    <FreezeResistSlider freezeRes={freezeRes} handleFreezeChange={handleFreezeChange} />
                </div>
            </div>

            <RemoveAurasButton handleRemoveAuras={handleRemoveAuras} />

            <footer id='footer' style={{ textAlign: "center" }}>
                <p><a href="https://github.com/Veggissss/ElementalGaugeSim">GitHub Repository</a></p>
                <p><a href="https://github.com/Veggissss/ElementalGaugeSim/blob/main/LICENSE">&copy; MIT 2024</a></p>
            </footer>
        </div>
    );
}