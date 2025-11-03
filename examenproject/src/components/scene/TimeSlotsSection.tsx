import { Box, Alert, Typography } from '@mui/material';
import { TimeSlotList } from '../timeslot/TimeSlotList.tsx';
import type { Scene } from '../../types/scene.ts';
import type {TimeSlot} from "../../types/timeslot.ts";

interface TimeSlotsSectionProps {
    sceneId: string;
    scene: Scene;
    isAdmin: boolean;
    showTimeSlots: boolean;
    onAddTimeSlot: () => void;
    onEditTimeSlot: (timeslot: TimeSlot) => void;
    onDeleteTimeSlot: (timeslotId: string) => void;
}

export const TimeSlotsSection = ({
                                     sceneId,
                                     scene,
                                     isAdmin,
                                     showTimeSlots,
                                     onAddTimeSlot,
                                     onEditTimeSlot,
                                     onDeleteTimeSlot,
                                 }: TimeSlotsSectionProps) => {
    if (!showTimeSlots) {
        return (
            <Alert severity="info" sx={{ mb: 4 }}>
                <Typography variant="body2">
                    <strong>Persoonlijke scenes kunnen niet gekoppeld worden aan tijdsloten.</strong>
                    <br />
                    Alleen globale scenes kunnen automatisch geactiveerd worden via tijdsloten.
                    {isAdmin && " Als admin kun je deze scene converteren naar een globale scene om tijdsloten toe te voegen."}
                </Typography>
            </Alert>
        );
    }

    return (
        <Box sx={{ mb: 4 }}>
            <TimeSlotList
                sceneId={sceneId}
                onAddTimeSlot={onAddTimeSlot}
                onEditTimeSlot={onEditTimeSlot}
                onDeleteTimeSlot={onDeleteTimeSlot}
                isAdmin={isAdmin}
                isGlobalScene={scene.isGlobal}
            />
        </Box>
    );
};