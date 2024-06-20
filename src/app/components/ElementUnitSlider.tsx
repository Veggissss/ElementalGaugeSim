"use client";

import React, { Component } from 'react';
import { Box, Slider } from '@mui/material';

interface ElementUnitSliderProps {
    units: number;
    handleUnitsChange: (event: Event, value: number | number[], activeThumb: number) => void;
}

class ElementUnitSlider extends Component<ElementUnitSliderProps> {
    render() {
        const { units, handleUnitsChange } = this.props;

        return (
            <Box style={{ width: '50vw' }}>
                <Slider id="element-unit-slider"
                    value={units}
                    onChange={handleUnitsChange}
                    marks
                    min={0.5}
                    max={8}
                    step={0.5}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                />
            </Box>
        );
    }
}

export default ElementUnitSlider;
