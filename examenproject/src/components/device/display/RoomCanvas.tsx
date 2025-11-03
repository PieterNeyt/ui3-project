import { Box } from '@mui/material';
import type { Room } from '../../../types/room.ts';
import type { Device } from '../../../types/device.ts';
import { DeviceVisualization } from '../visualization/DeviceVisualizations.tsx';
import React from "react";

interface RoomCanvasProps {
    room: Room;
    devices: Device[];
    scale?: number;
    onRoomClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onDeviceClick?: (device: Device) => void;
}

export function RoomCanvas({
                               room,
                               devices,
                               scale = 1,
                               onRoomClick,
                               onDeviceClick,
                           }: RoomCanvasProps) {
    return (
        <Box
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
            onClick={onRoomClick}
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
    );
}
