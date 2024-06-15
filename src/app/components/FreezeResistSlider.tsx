"use client";

import React from 'react';
import { Box, Slider } from '@mui/material';

interface FreezeResistSliderProps {
    freezeRes: number;
    handleFreezeChange: (event: Event, value: number | number[], activeThumb: number) => void;
}

class FreezeResistSlider extends React.Component<FreezeResistSliderProps> {
    render() {
        const { freezeRes, handleFreezeChange } = this.props;

        return (
            <div>
                <h2>Freeze Resistance:</h2>
                <Box style={{ width: '20vw' }}>
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
        );
    }
}

export default FreezeResistSlider;
