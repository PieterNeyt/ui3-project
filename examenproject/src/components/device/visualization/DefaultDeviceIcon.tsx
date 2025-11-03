import { Box, Typography, Tooltip } from '@mui/material';
import type { Device } from '../../../types/device.ts';
import React from "react";

interface DefaultDeviceIconProps {
    device: Device;
    baseStyle: React.CSSProperties;
    onClick?: () => void;
    scale: number;
}

export const DefaultDeviceIcon = ({ device, baseStyle, onClick, scale }: DefaultDeviceIconProps) => {
    return (
        <Tooltip title={`${device.naam} - ${device.type}`}>
            <Box
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    padding: scale,
                    border: '2px solid #666',
                    ...baseStyle,
                }}
                onClick={onClick}
            >
                <Typography variant="caption" sx={{ fontSize: 8 * scale }}>
                    {device.type}
                </Typography>
            </Box>
        </Tooltip>
    );
};