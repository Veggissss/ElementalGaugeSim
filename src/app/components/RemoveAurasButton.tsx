"use client";

import React from 'react';
import { Button } from '@mui/material';

interface RemoveAurasButtonProps {
    handleRemoveAuras: () => void;
}

class RemoveAurasButton extends React.Component<RemoveAurasButtonProps> {
    render() {
        const { handleRemoveAuras } = this.props;

        return (
            <Button variant="outlined" color='error' onClick={() => handleRemoveAuras()}>
                Remove Auras
            </Button>
        );
    }
}

export default RemoveAurasButton;
