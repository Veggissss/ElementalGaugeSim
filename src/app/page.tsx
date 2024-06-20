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
import TimeButton from "./components/TimeButton";

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
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ flex: 1 }}>
                <Typography
                    variant="h1"
                    gutterBottom
                    style={{ fontSize: 'calc(1.2em + 2vw)', paddingTop: "1wv" }}
                >
                    Elemental Gauge Simulator
                </Typography>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: "1em" }}>
                    <ElementAuras target={target} />
                    <ReactionsOccurred reactions={reactions} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: "2em", paddingRight: "2em" }}>
                    <h2>Gauge Unit:</h2>
                    <ElementUnitSlider units={units} handleUnitsChange={handleUnitsChange} />
                </div>

                <div style={{ paddingLeft: "1em", paddingRight: "1em" }}>
                    <ElementButtons units={units} elementColorMap={elementColorMap} handleAddElement={handleAddElement} />
                </div>
                
                <br />
                
                <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "2em", paddingRight: "2em" }}>
                    <div>
                        <h2>Simulate Time:</h2>
                        <TimeSlider time={time} handleTimeChange={handleTimeChange} />
                    </div>
                    <div>
                        <h2>Freeze Res:</h2>
                        <FreezeResistSlider freezeRes={freezeRes} handleFreezeChange={handleFreezeChange} />
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center" }}>
                    <TimeButton time={time} handleTimeStep={handleTimeStep} />
                </div>

                <div style={{ display: "flex", justifyContent: "center", padding: "1em" }}>
                    <RemoveAurasButton handleRemoveAuras={handleRemoveAuras} />
                </div>
            </div>

            <footer id='footer' style={{ textAlign: "center", marginTop: "auto" }}>
                <p><a href="https://github.com/Veggissss/ElementalGaugeSim">GitHub Repository</a></p>
                <p><a href="https://github.com/Veggissss/ElementalGaugeSim/blob/main/LICENSE">&copy; MIT 2024</a></p>
            </footer>
        </div>
    );
}