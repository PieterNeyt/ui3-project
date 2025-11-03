import { Box, Typography, Tooltip } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import type { DoorLockDevice } from '../../../types/device.ts';
import React from "react";

interface DoorLockIconProps {
    device: DoorLockDevice;
    baseStyle: React.CSSProperties;
    onClick?: () => void;
    scale: number;
}

export const DoorLockIcon = ({ device, baseStyle, onClick, scale }: DoorLockIconProps) => {
    const isLocked = device.waarde.locked;
    const statusColor = isLocked ? '#f44336' : '#4caf50';
    const statusText = isLocked ? 'Vergrendeld' : 'Ontgrendeld';

    return (
        <Tooltip title={`${device.naam} - ${statusText}`}>
            <Box
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '50%',
                    padding: scale,
                    border: `2px solid ${statusColor}`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    ...baseStyle,
                }}
                onClick={onClick}
            >
                {isLocked ? (
                    <Lock sx={{ fontSize: 20 * scale, color: statusColor }} />
                ) : (
                    <LockOpen sx={{ fontSize: 20 * scale, color: statusColor }} />
                )}
                <Typography
                    variant="caption"
                    sx={{
                        position: 'absolute',
                        bottom: -10 * scale,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: 7 * scale,
                        fontWeight: 'bold',
                        color: statusColor,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: '0 2px',
                        borderRadius: 1,
                    }}
                >
                    {isLocked ? 'DICHT' : 'OPEN'}
                </Typography>
            </Box>
        </Tooltip>
    );
};