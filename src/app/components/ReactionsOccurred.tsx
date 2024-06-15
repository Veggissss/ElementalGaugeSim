"use client";

import React, { Component } from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';
import { ReactionLog } from '@/src/simulator/model/Reactions/ReactionLog';
import { elementNames } from '@/src/simulator/model/Elements/ElementName';

interface ReactionsOccurredProps {
    reactions: ReactionLog[];
}

class ReactionsOccurred extends Component<ReactionsOccurredProps> {
    getElementImages() {
        const elementImages: { [key: string]: string } = {};
        let filePath = "";
        if (process.env.GITHUB_PAGES_URL) {
            filePath = process.env.GITHUB_PAGES_URL;
        }
        elementNames.forEach((element) => elementImages[element] = filePath + `/images/Element_${element}.png`);
        return elementImages;
    }

    render() {
        const { reactions } = this.props;
        const elementImages = this.getElementImages();

        return (
            <Box minHeight={250} maxHeight={325}>
                <h2>Reactions Occurred:</h2>
                <div>
                    {reactions.map((reaction, index) => (
                        <div key={index}>
                            <h3>{reaction.name} ({reaction.coefficient}x)</h3>
                            <Box display="flex" alignItems="center">
                                <Image src={elementImages[reaction.auraElement.element.name]} alt={reaction.auraElement.element.name} height={50} width={50} />
                                X
                                <Image src={elementImages[reaction.appliedElement.element.name]} alt={reaction.appliedElement.element.name} height={50} width={50} />
                            </Box>
                        </div>
                    ))}
                </div>
            </Box>
        );
    }
}

export default ReactionsOccurred;
