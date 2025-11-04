import { Box, Alert } from '@mui/material';
import { DeviceCard } from './DeviceCard.tsx';
import type { Device,  DeviceValue } from '../../types/device.ts';
import type {Room} from "../../types/room.ts";
import type {Floor} from "../../types/floor.ts";

interface AllDevicesTabProps {
    devices: Device[];
    rooms: Room[];
    floors: Floor[];
    favorites: Set<string>;
    isAdmin: boolean;
    onToggleFavorite: (deviceId: string) => void;
    onDeviceControl: (device: Device, newValue: DeviceValue) => void;
    isUpdating: boolean;
}

export const AllDevicesTab = ({
                                  devices,
                                  rooms,
                                  floors,
                                  favorites,
                                  isAdmin,
                                  onToggleFavorite,
                                  onDeviceControl,
                                  isUpdating,
                              }: AllDevicesTabProps) => {
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
                    rooms={rooms}
                    floors={floors}
                    favorites={favorites}
                    isAdmin={isAdmin}
                    onToggleFavorite={onToggleFavorite}
                    onDeviceControl={onDeviceControl}
                    isUpdating={isUpdating}
                    showRoomInfo={true}
                />
            ))}
            {devices.length === 0 && (
                <Alert severity="info">
                    Geen devices gevonden met de huidige filters.
                </Alert>
            )}
        </Box>
    );
};