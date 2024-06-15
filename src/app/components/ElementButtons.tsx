"use client";

import React from 'react';
import { Grid, Button } from '@mui/material';
import { ElementName, elementNames } from '@/src/simulator/model/Elements/ElementName';

interface ElementButtonsProps {
    units: number;
    elementColorMap: Map<ElementName, string>;
    handleAddElement: (element: ElementName) => void;
}

class ElementButtons extends React.Component<ElementButtonsProps> {
    render() {
        const { units, elementColorMap, handleAddElement } = this.props;

        return (
            <Grid container spacing={1} justifyContent="center">
                {elementNames.slice(0, 7).map((element, index) => (
                    <Grid item xs={5} sm={3} md={2} lg={true} key={index}>
                        <Button key={element} variant="contained" style={{ background: elementColorMap.get(element), minWidth: 140 }} onClick={() => handleAddElement(element)}>
                            {element} {units.toFixed(1)}U
                        </Button>
                    </Grid>
                ))}
            </Grid>
        );
    }
}

export default ElementButtons;
