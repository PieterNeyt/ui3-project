import { Button } from '@mui/material';
import type { TimeSlot } from '../../types/timeslot';

interface TimeSlotFormActionsProps {
    onClose: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    timeslot?: TimeSlot | null;
}

export const TimeSlotFormActions = ({
                                        onClose,
                                        onSubmit,
                                        isSubmitting,
                                        timeslot,
                                    }: TimeSlotFormActionsProps) => {
    return (
        <>
            <Button onClick={onClose}>Annuleren</Button>
            <Button
                onClick={onSubmit}
                variant="contained"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Bezig...' : timeslot ? 'Bijwerken' : 'Aanmaken'}
            </Button>
        </>
    );
};