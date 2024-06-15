"use client";

import React, { Component } from 'react';
import Image from 'next/image';
import { Box } from '@mui/material';
import { elementNames } from '@/src/simulator/model/Elements/ElementName';
import { Target } from '@/src/simulator/model/Target';

interface ElementAurasProps {
    target: Target;
}

class ElementAuras extends Component<ElementAurasProps> {
    getElementImages(): { [key: string]: string } {
        const elementImages: { [key: string]: string } = {};
        let filePath = "";
        if (process.env.GITHUB_PAGES_URL) {
            filePath = process.env.GITHUB_PAGES_URL;
        }
        elementNames.forEach((element) => elementImages[element] = filePath + `/images/Element_${element}.png`);
        return elementImages;
    }

    render() {
        const { target } = this.props;
        const elementImages = this.getElementImages();

        return (
            <Box minHeight={250} maxHeight={325}>
                <h2>Element Auras:</h2>
                <div id='element-auras'>
                    {target.auras.map((aura, index) => (
                        <div key={index}>
                            <h3>{aura.gaugeUnits.toFixed(2)}U {aura.element.name} Decay: {aura.decayRate.toFixed(3)}s/U</h3>
                            <Image src={elementImages[aura.element.name]} alt={aura.element.name} height={50} width={50} />
                        </div>
                    ))}
                </div>
            </Box>
        );
    }
}

export default ElementAuras;