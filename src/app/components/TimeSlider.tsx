"use client";

import React from 'react';
import { Box, Slider } from '@mui/material';

interface TimeSliderProps {
    time: number;
    handleTimeChange: (event: Event, value: number | number[], activeThumb: number) => void;
}

class TimeSlider extends React.Component<TimeSliderProps> {
    render() {
        const { time, handleTimeChange } = this.props;

        return (
            <Box style={{ width: '32vw' }}>
                <Slider
                    value={time}
                    onChange={handleTimeChange}
                    min={0.1}
                    max={8}
                    step={0.1}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                />
            </Box>
        );
    }
}

export default TimeSlider;
