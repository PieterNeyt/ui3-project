import React, { useState } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import type { Room } from '../../types/room';
import type { Device, DeviceFormData } from '../../types/device';
import { DeviceForm } from './DeviceForm';
import { RoomHeader } from './RoomHeader';
import { RoomCanvas } from './RoomCanvas';
import { useCreateDevice } from '../../hooks/useDevices';
import { useAuth } from '../../hooks/useAuth.tsx';

interface RoomPlanProps {
    room: Room;
    devices: Device[];
    rooms: Room[];
    onDeviceClick?: (device: Device) => void;
    scale?: number;
}

export function RoomPlan({ room, devices, rooms, onDeviceClick, scale = 1 }: RoomPlanProps) {
    const [showDeviceForm, setShowDeviceForm] = useState(false);
    const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
    const createDeviceMutation = useCreateDevice();
    const { isAdmin } = useAuth();

    const handleRoomClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isAdmin()) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        setClickPosition({ x, y });
        setShowDeviceForm(true);
    };

    const handleCreateDevice = (deviceData: DeviceFormData) => {
        createDeviceMutation.mutate(deviceData, {
            onSuccess: () => setShowDeviceForm(false),
        });
    };

    return (
        <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
            <RoomHeader roomName={room.naam} deviceCount={devices.length} onAdd={() => setShowDeviceForm(true)} />

            <RoomCanvas
                room={room}
                devices={devices}
                scale={scale}
                onRoomClick={handleRoomClick}
                onDeviceClick={onDeviceClick}
            />

            <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Klik ergens in de kamer om een control toe te voegen | Aantal devices: {devices.length}
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
}
