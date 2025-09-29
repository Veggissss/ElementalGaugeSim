"use client";

import React, { Component } from 'react';
import { Box } from '@mui/material';
import Image, { StaticImageData } from 'next/image';
import { ReactionLog } from '@/src/simulator/model/Reactions/ReactionLog';
import { ElementName, elementNames } from '@/src/simulator/model/Elements/ElementName';

const elementImages: Record<ElementName, StaticImageData> = {} as Record<ElementName, StaticImageData>;
elementNames.forEach((element: ElementName) => {
    elementImages[element] = require(`/public/images/Element_${element}.png`);
});

interface ReactionsOccurredProps {
    reactions: ReactionLog[];
}

class ReactionsOccurred extends Component<ReactionsOccurredProps> {
    render() {
        const { reactions } = this.props;

        return (
            <Box minHeight={250} maxHeight={325}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Reactions Occurred:</h2>
                <div id='element-reactions'>
                    {reactions.map((reaction, index) => (
                        <div key={index}>
                            <h3>{reaction.name} ({reaction.coefficient}x)</h3>
                            <Box display="flex" alignItems="center">
                                <Image
                                    src={elementImages[reaction.auraElement.element.name]}
                                    alt={reaction.auraElement.element.name}
                                    height={50}
                                    width={50}
                                />
                                X
                                <Image
                                    src={elementImages[reaction.appliedElement.element.name]}
                                    alt={reaction.appliedElement.element.name}
                                    height={50}
                                    width={50}
                                />
                            </Box>
                        </div>
                    ))}
                </div>
            </Box>
        );
    }
}

export default ReactionsOccurred;
