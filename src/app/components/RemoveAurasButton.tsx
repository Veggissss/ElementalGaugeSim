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
            <div style={{ display: "flex", justifyContent: "center", padding: "1em" }}>
                <Button variant="outlined" color='error' onClick={() => handleRemoveAuras()}>
                    Remove Auras
                </Button>
            </div>
        );
    }
}

export default RemoveAurasButton;
