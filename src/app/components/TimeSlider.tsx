"use client";

import React from 'react';
import { Box, Slider, Button } from '@mui/material';

interface TimeSliderProps {
    time: number;
    handleTimeChange: (event: Event, value: number | number[], activeThumb: number) => void;
    handleTimeStep: () => void;
}

class TimeSlider extends React.Component<TimeSliderProps> {
    render() {
        const { time, handleTimeChange, handleTimeStep } = this.props;

        return (
            <div>
                <h2>Simulate Time:</h2>
                <Box style={{ width: '20vw' }}>
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
                <Button variant="contained" onClick={() => handleTimeStep()}>
                    Time Step {time.toFixed(1)} seconds
                </Button>
            </div>
        );
    }
}

export default TimeSlider;
