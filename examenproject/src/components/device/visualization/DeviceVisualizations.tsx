import { Box } from '@mui/material';
import type { Device } from '../../../types/device.ts';
import { DeviceIcon } from './DeviceIcon.tsx';

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

    return (
        <Box
            sx={{
                position: 'absolute',
                left: device.x,
                top: device.y,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'translate(-50%, -50%)',
            }}
        >
            <DeviceIcon
                device={device}
                onClick={handleClick}
                scale={scale}
            />
        </Box>
    );
};