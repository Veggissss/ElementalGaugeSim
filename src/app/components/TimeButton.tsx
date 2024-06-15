"use client";

import React from 'react';
import { Button } from '@mui/material';

interface TimeButtonProps {
    time: number;
    handleTimeStep: () => void;
}

class TimeButton extends React.Component<TimeButtonProps> {
    render() {
        const { time, handleTimeStep } = this.props;

        return (
            <Button id="time-btn" variant="contained" onClick={() => handleTimeStep()}>
                Time Step {time.toFixed(1)} seconds
            </Button>
        );
    }
}

export default TimeButton;
