import { Box, Typography, Tooltip } from '@mui/material';
import { Thermostat } from '@mui/icons-material';
import type { HeatingDevice } from '../../../types/device.ts';
import React from "react";

interface HeatingIconProps {
    device: HeatingDevice;
    baseStyle: React.CSSProperties;
    onClick?: () => void;
    scale: number;
}

export const HeatingIcon = ({ device, baseStyle, onClick, scale }: HeatingIconProps) => {
    const temp = device.waarde.temperature;
    const tempColor = getTempColor(temp);

    return (
        <Tooltip title={`${device.naam} - ${temp}°C`}>
            <Box
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '50%',
                    padding: scale,
                    border: `2px solid ${tempColor}`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    ...baseStyle,
                }}
                onClick={onClick}
            >
                <Thermostat sx={{ fontSize: 20 * scale, color: tempColor }} />
                <Typography
                    variant="caption"
                    sx={{
                        ml: 0.5 * scale,
                        fontWeight: 'bold',
                        color: tempColor,
                        fontSize: 9 * scale,
                    }}
                >
                    {temp}°
                </Typography>
            </Box>
        </Tooltip>
    );
};

const getTempColor = (temp: number): string => {
    if (temp <= 16) return '#2196f3';
    if (temp <= 20) return '#4caf50';
    if (temp <= 24) return '#ff9800';
    return '#f44336';
};