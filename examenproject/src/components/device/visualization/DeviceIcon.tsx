import type { Device, LightDevice, HeatingDevice, DoorLockDevice, AudioDevice } from '../../../types/device.ts';
import { LightIcon } from './LightIcon.tsx';
import { HeatingIcon } from './HeatingIcon.tsx';
import { DoorLockIcon } from './DoorLockIcon.tsx';
import { AudioIcon } from './AudioIcon.tsx';
import { DefaultDeviceIcon } from './DefaultDeviceIcon.tsx';

interface DeviceIconProps {
    device: Device;
    onClick?: () => void;
    scale?: number;
}

export const DeviceIcon = ({ device, onClick, scale = 1 }: DeviceIconProps) => {
    const baseStyle = {
        cursor: onClick ? 'pointer' : 'default',
        transform: `scale(${scale})`,
        transition: 'all 0.3s ease',
    };

    const renderDeviceIcon = () => {
        switch (device.type) {
            case 'licht':
                return (
                    <LightIcon
                        device={device as LightDevice}
                        baseStyle={baseStyle}
                        onClick={onClick}
                        scale={scale}
                    />
                );
            case 'verwarming':
                return (
                    <HeatingIcon
                        device={device as HeatingDevice}
                        baseStyle={baseStyle}
                        onClick={onClick}
                        scale={scale}
                    />
                );
            case 'deurslot':
                return (
                    <DoorLockIcon
                        device={device as DoorLockDevice}
                        baseStyle={baseStyle}
                        onClick={onClick}
                        scale={scale}
                    />
                );
            case 'audio':
                return (
                    <AudioIcon
                        device={device as AudioDevice}
                        baseStyle={baseStyle}
                        onClick={onClick}
                        scale={scale}
                    />
                );
            default:
                return (
                    <DefaultDeviceIcon
                        device={device}
                        baseStyle={baseStyle}
                        onClick={onClick}
                        scale={scale}
                    />
                );
        }
    };

    return renderDeviceIcon();
};