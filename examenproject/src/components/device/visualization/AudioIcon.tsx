import { Box, Typography, Tooltip } from '@mui/material';
import { VolumeUp } from '@mui/icons-material';
import type { AudioDevice } from '../../../types/device.ts';
import React from "react";

interface AudioIconProps {
    device: AudioDevice;
    baseStyle: React.CSSProperties;
    onClick?: () => void;
    scale: number;
}

export const AudioIcon = ({ device, baseStyle, onClick, scale }: AudioIconProps) => {
    const volume = device.waarde.volume;
    const playlist = device.waarde.playlist;
    const isPlaying = volume > 0;
    const statusColor = isPlaying ? '#4caf50' : '#666';

    return (
        <Tooltip title={`${device.naam} - Volume: ${volume}, Playlist: ${playlist}`}>
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
                    position: 'relative',
                    ...baseStyle,
                }}
                onClick={onClick}
            >
                <VolumeUp
                    sx={{
                        fontSize: 20 * scale,
                        color: statusColor,
                    }}
                />
                {isPlaying && (
                    <>
                        <Typography
                            variant="caption"
                            sx={{
                                position: 'absolute',
                                top: -5 * scale,
                                right: -5 * scale,
                                fontSize: 8 * scale,
                                fontWeight: 'bold',
                                color: '#4caf50',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                width: 12 * scale,
                                height: 12 * scale,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #4caf50',
                            }}
                        >
                            {volume}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                position: 'absolute',
                                bottom: -10 * scale,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: 7 * scale,
                                fontWeight: 'bold',
                                color: '#4caf50',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                padding: '0 2px',
                                borderRadius: 1,
                                maxWidth: 40 * scale,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {playlist}
                        </Typography>
                    </>
                )}
                {!isPlaying && (
                    <Typography
                        variant="caption"
                        sx={{
                            position: 'absolute',
                            bottom: -10 * scale,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: 7 * scale,
                            fontWeight: 'bold',
                            color: '#666',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            padding: '0 2px',
                            borderRadius: 1,
                        }}
                    >
                        STIL
                    </Typography>
                )}
            </Box>
        </Tooltip>
    );
};