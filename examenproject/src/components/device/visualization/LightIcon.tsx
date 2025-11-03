import {Box, Tooltip, Typography} from '@mui/material';
import { Lightbulb } from '@mui/icons-material';
import type { LightDevice } from '../../../types/device.ts';
import React from "react";

interface LightIconProps {
    device: LightDevice;
    baseStyle: React.CSSProperties;
    onClick?: () => void;
    scale: number;
}

export const LightIcon = ({ device, baseStyle, onClick, scale }: LightIconProps) => {
    const isOn = device.waarde.on_off === 'on';
    const brightness = device.waarde.brightness;
    const visualProps = getLightVisualProps(brightness, scale);

    return (
        <Tooltip title={`${device.naam} - ${isOn ? `Aan (${brightness}%)` : 'Uit'}`}>
            <Box
                sx={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...baseStyle,
                }}
                onClick={onClick}
            >
                {/* Outer glow effect */}
                {isOn && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: visualProps.outerGlow.width,
                            height: visualProps.outerGlow.height,
                            borderRadius: '50%',
                            backgroundColor: '#ffeb3b',
                            opacity: visualProps.outerGlow.opacity,
                            animation: 'pulse 2s infinite',
                            filter: `blur(${visualProps.outerGlow.blur}px)`,
                        }}
                    />
                )}

                {/* Middle glow */}
                {isOn && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: visualProps.middleGlow.width,
                            height: visualProps.middleGlow.height,
                            borderRadius: '50%',
                            backgroundColor: '#ffeb3b',
                            opacity: visualProps.middleGlow.opacity,
                        }}
                    />
                )}

                {/* Inner glow and icon */}
                <Box
                    sx={{
                        position: 'relative',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: visualProps.baseSize,
                        height: visualProps.baseSize,
                        borderRadius: '50%',
                        backgroundColor: isOn ? '#ffeb3b' : 'rgba(255, 255, 255, 0.9)',
                        border: `2px solid ${isOn ? '#ff9800' : '#666'}`,
                        boxShadow: isOn ? `0 0 ${brightness / 5}px #ffeb3b, 0 0 ${brightness / 10}px #ff9800` : '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                >
                    <Lightbulb
                        sx={{
                            fontSize: visualProps.iconSize,
                            color: isOn ? '#ff5722' : '#666',
                            filter: isOn ? 'drop-shadow(0 0 2px rgba(255, 87, 34, 0.7))' : 'none',
                        }}
                    />
                </Box>

                {/* Brightness indicator */}
                {isOn && brightness < 100 && (
                    <Typography
                        variant="caption"
                        sx={{
                            position: 'absolute',
                            bottom: -12 * scale,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: visualProps.fontSize,
                            fontWeight: 'bold',
                            color: '#ff5722',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            padding: '1px 4px',
                            borderRadius: 1,
                            border: '1px solid #ff5722',
                            minWidth: 20 * scale,
                            textAlign: 'center',
                        }}
                    >
                        {brightness}%
                    </Typography>
                )}

                {/* Status indicator voor uit staat */}
                {!isOn && (
                    <Typography
                        variant="caption"
                        sx={{
                            position: 'absolute',
                            bottom: -12 * scale,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: visualProps.fontSize - 1,
                            fontWeight: 'bold',
                            color: '#666',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            padding: '1px 4px',
                            borderRadius: 1,
                            border: '1px solid #666',
                        }}
                    >
                        UIT
                    </Typography>
                )}
            </Box>
        </Tooltip>
    );
};

const getLightVisualProps = (brightness: number, scale: number) => {
    const baseSize = 32 * scale;
    const glowSize = (brightness / 3 + 20) * scale;

    return {
        baseSize,
        glowSize,
        outerGlow: {
            width: glowSize,
            height: glowSize,
            opacity: brightness / 200 + 0.2,
            blur: brightness / 30,
        },
        middleGlow: {
            width: (brightness / 4 + 15) * scale,
            height: (brightness / 4 + 15) * scale,
            opacity: brightness / 150 + 0.3,
        },
        iconSize: 18 * scale,
        fontSize: 8 * scale,
    };
};