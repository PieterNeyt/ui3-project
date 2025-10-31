import { Box, Typography, Tooltip } from '@mui/material';
import { Lightbulb, Thermostat, Lock, LockOpen, VolumeUp } from '@mui/icons-material';
import type {Device, LightDevice, HeatingDevice, DoorLockDevice, AudioDevice} from '../../types/device';

interface DeviceVisualizationProps {
    device: Device;
    onClick?: (device: Device) => void;
    scale?: number;
}

export const DeviceVisualization = ({
                                                                            device,
                                                                            onClick,
                                                                            scale = 1,
                                                                        }: DeviceVisualizationProps) => {
    const handleClick = () => {
        onClick?.(device);
    };

    // Helper functie voor betere zichtbaarheid lampen
    const getLightVisualProps = ( brightness: number) => {
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

    const renderDeviceIcon = () => {
        const baseStyle = {
            cursor: onClick ? 'pointer' : 'default',
            transform: `scale(${scale})`,
            transition: 'all 0.3s ease',
        };

        // Type guard voor device type
        const deviceType = device.type;

        switch (deviceType) {
            case 'licht':
            {
                const lightDevice = device as LightDevice;
                const isOn = lightDevice.waarde.on_off === 'on';
                const brightness = lightDevice.waarde.brightness;
                const visualProps = getLightVisualProps( brightness);

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
                            onClick={handleClick}
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
            }

            case 'verwarming':
            {
                const heatingDevice = device as HeatingDevice;
                const temp = heatingDevice.waarde.temperature;
                const getTempColor = (temp: number) => {
                    if (temp <= 16) return '#2196f3';
                    if (temp <= 20) return '#4caf50';
                    if (temp <= 24) return '#ff9800';
                    return '#f44336';
                };

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
                                padding: 1 * scale,
                                border: `2px solid ${tempColor}`,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                ...baseStyle,
                            }}
                            onClick={handleClick}
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
            }

            case 'deurslot':
            {
                const lockDevice = device as DoorLockDevice;
                const isLocked = lockDevice.waarde.locked;
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
                                padding: 1 * scale,
                                border: `2px solid ${statusColor}`,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                ...baseStyle,
                            }}
                            onClick={handleClick}
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
            }

            case 'audio':
            {
                const audioDevice = device as AudioDevice;
                const volume = audioDevice.waarde.volume;
                const playlist = audioDevice.waarde.playlist;
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
                                padding: 1 * scale,
                                border: `2px solid ${statusColor}`,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                position: 'relative',
                                ...baseStyle,
                            }}
                            onClick={handleClick}
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
            }

            default:
                // Fallback voor onbekende device types - gebruik de base Device type
                { const fallbackDevice = device as Device;
                return (
                    <Tooltip title={`${fallbackDevice.naam} - ${fallbackDevice.type}`}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '50%',
                                padding: 1 * scale,
                                border: '2px solid #666',
                                ...baseStyle,
                            }}
                            onClick={handleClick}
                        >
                            <Typography variant="caption" sx={{ fontSize: 8 * scale }}>
                                {fallbackDevice.type}
                            </Typography>
                        </Box>
                    </Tooltip>
                ); }
        }
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                left: device.x,
                top: device.y,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'translate(-50%, -50%)', // Center the icon on the position
            }}
        >
            {renderDeviceIcon()}
        </Box>
    );
};

