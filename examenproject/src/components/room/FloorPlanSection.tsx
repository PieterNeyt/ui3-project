import { Box } from '@mui/material';
import { FloorPlan } from './FloorPlan.tsx';
import type {  Room } from '../../types/room.ts';
import type {Floor} from "../../types/floor.ts";

interface FloorPlanSectionProps {
    currentFloor: Floor;
    rooms?: Room[];
    onRoomClick: (room: Room) => void;
}

export const FloorPlanSection = ({ currentFloor, rooms, onRoomClick }: FloorPlanSectionProps) => {
    if (!rooms) return null;

    return (
        <Box mb={4}>
            <FloorPlan
                floor={currentFloor}
                rooms={rooms}
                onRoomClick={onRoomClick}
                scale={0.8}
            />
        </Box>
    );
};