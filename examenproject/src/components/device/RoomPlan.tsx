import React, { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import type {Room} from '../../types/room';
import type {Device, DeviceFormData} from '../../types/device';
import { DeviceVisualization } from './DeviceVisualizations';
import { DeviceForm } from './DeviceForm';
import { useCreateDevice } from '../../hooks/useDevices';

interface RoomPlanProps {
    room: Room;
    devices: Device[];
    onDeviceClick?: (device: Device) => void;
    onDeviceUpdate?: (device: Device) => void;
    scale?: number;
    rooms: Room[];
}

export const RoomPlan: React.FC<RoomPlanProps> = ({
                                                      room,
                                                      devices,
                                                      onDeviceClick,
                                                      scale = 1,
                                                      rooms,
                                                  }) => {
    const [showDeviceForm, setShowDeviceForm] = useState(false);
    const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
    const createDeviceMutation = useCreateDevice();

    const handleRoomClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        setClickPosition({ x, y });
        setShowDeviceForm(true);
    };

    const handleCreateDevice = (deviceData: DeviceFormData) => {
        createDeviceMutation.mutate(deviceData, {
            onSuccess: () => {
                setShowDeviceForm(false);
            },
        });
    };

    return (
        <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">
                    {room.naam} - Domotica Controls
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setShowDeviceForm(true)}
                >
                    Control Toevoegen
                </Button>
            </Box>

            <Box
                key={`room-${room.id}-devices-${devices.length}`}
                sx={{
                    position: 'relative',
                    width: room.width * scale,
                    height: room.height * scale,
                    border: '3px solid',
                    borderColor: 'text.primary',
                    bgcolor: 'grey.100',
                    overflow: 'hidden',
                    margin: '0 auto',
                    cursor: 'crosshair',
                }}
                onClick={handleRoomClick}
            >
                {/* Room background */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        bgcolor: 'background.paper',
                    }}
                />

                {/* Devices */}
                {devices.map((device) => (
                    <DeviceVisualization
                        key={device.id}
                        device={device}
                        onClick={onDeviceClick}
                        scale={scale * 0.8}
                    />
                ))}
            </Box>

            <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Klik ergens in de kamer om een control toe te voegen |
                    Aantal devices: {devices.length}
                </Typography>
            </Box>

            <DeviceForm
                open={showDeviceForm}
                onClose={() => setShowDeviceForm(false)}
                onSubmit={handleCreateDevice}
                rooms={rooms}
                isSubmitting={createDeviceMutation.isPending}
                initialX={clickPosition.x}
                initialY={clickPosition.y}
                initialKamerId={room.id}
                existingDevices={devices}
            />
        </Paper>
    );
};