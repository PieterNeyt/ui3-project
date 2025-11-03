import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import type { Floor } from '../../types/floor.ts';

interface RoomsHeaderProps {
    currentFloor: Floor;
    isAdmin: boolean;
    onAddRoom: () => void;
}

export const RoomsHeader = ({ currentFloor, isAdmin, onAddRoom }: RoomsHeaderProps) => {
    return (
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
            <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    Kamers Beheren - {currentFloor.naam}
                </Typography>
                {currentFloor.omschrijving && (
                    <Typography variant="body1" color="text.secondary">
                        {currentFloor.omschrijving}
                    </Typography>
                )}
            </Box>
            {isAdmin && (
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={onAddRoom}
                >
                    Nieuwe Kamer
                </Button>
            )}
        </Box>
    );
};