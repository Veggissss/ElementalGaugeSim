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
                <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Element Auras:</h2>
                <div id='element-auras'>
                    {target.auras.map((aura, index) => (
                        <div key={index}>
                            <h3>{aura.element.name} {aura.gaugeUnits.toFixed(2)}U ({aura.decayRate.toFixed(3)}s/U {(aura.gaugeUnits * aura.decayRate).toFixed(1)}s)</h3>
                            <Image
                                src={elementImages[aura.element.name]}
                                alt={aura.element.name}
                                height={50}
                                width={50}
                                loading="eager"
                                unoptimized={false}
                            />
                        </div>
                    ))}
                </div>
            </Box>
        );
    }
}

export default ElementAuras;