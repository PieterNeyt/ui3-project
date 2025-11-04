import { Box, Alert } from '@mui/material';
import { DeviceCard } from './DeviceCard.tsx';
import type { Device, DeviceValue } from '../../types/device.ts';

interface FavoritesTabProps {
    devices: Device[];
    favorites: Set<string>;
    onToggleFavorite: (deviceId: string) => void;
    onDeviceControl: (device: Device, newValue: DeviceValue) => void;
    isUpdating: boolean;
}

export const FavoritesTab = ({
                                 devices,
                                 favorites,
                                 onToggleFavorite,
                                 onDeviceControl,
                                 isUpdating,
                             }: FavoritesTabProps) => {
    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)'
            },
            gap: 3
        }}>
            {devices.map((device: Device) => (
                <DeviceCard
                    key={device.id}
                    device={device}
                    favorites={favorites}
                    onToggleFavorite={onToggleFavorite}
                    onDeviceControl={onDeviceControl}
                    isUpdating={isUpdating}
                    showRoomInfo={false}
                />
            ))}
            {devices.length === 0 && (
                <Alert severity="info">
                    Je hebt nog geen favoriete devices. Klik op het hartje om devices toe te voegen.
                </Alert>
            )}
        </Box>
    );
};