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
            <Box style={{ width: '20vw' }}>
                <h2>Applied Element Unit:</h2>
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
        );
    }
}

export default ElementUnitSlider;
