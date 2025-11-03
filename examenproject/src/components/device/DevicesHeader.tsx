import { Box, Typography } from '@mui/material';
import type { Room } from '../../types/room.ts';

interface DevicesHeaderProps {
    currentRoom: Room;
}

export const DevicesHeader = ({ currentRoom }: DevicesHeaderProps) => {
    return (
        <Box mb={4}>
            <Typography variant="h4" component="h1" gutterBottom>
                Domotica Controls - {currentRoom.naam}
            </Typography>
            {currentRoom.omschrijving && (
                <Typography variant="body1" color="text.secondary">
                    {currentRoom.omschrijving}
                </Typography>
            )}
        </Box>
    );
};