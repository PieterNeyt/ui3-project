import { DialogActions, Button } from '@mui/material';
import type {Floor} from '../../types/floor';

interface FloorFormActionsProps {
    onClose: () => void;
    isSubmitting: boolean;
    floor?: Floor | null;
}

export function FloorFormActions({ onClose, isSubmitting, floor }: FloorFormActionsProps) {
    return (
        <DialogActions>
            <Button onClick={onClose}>Annuleren</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Bezig...' : floor ? 'Bijwerken' : 'Aanmaken'}
            </Button>
        </DialogActions>
    );
}
