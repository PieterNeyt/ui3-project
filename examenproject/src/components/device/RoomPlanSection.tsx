import { Box } from '@mui/material';
import { RoomPlan } from './display/RoomPlan.tsx';
import type { Room } from '../../types/room.ts';
import type {Device} from "../../types/device.ts";

interface RoomPlanSectionProps {
    currentRoom: Room;
    rooms: Room[];
    devices: Device[];
    refreshing: boolean;
    onDeviceClick: (device: Device) => void;
}

export const RoomPlanSection = ({
                                    currentRoom,
                                    rooms,
                                    devices,
                                    refreshing,
                                    onDeviceClick,
                                }: RoomPlanSectionProps) => {
    if (refreshing) return null;

    return (
        <Box mb={4}>
            <RoomPlan
                room={currentRoom}
                devices={devices}
                onDeviceClick={onDeviceClick}
                scale={0.8}
                rooms={rooms}
            />
        </Box>
    );
};