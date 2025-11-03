import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth.tsx';

interface RoomHeaderProps {
    roomName: string;
    deviceCount: number;
    onAdd: () => void;
}

export function RoomHeader({ roomName, onAdd }: RoomHeaderProps) {
    const { isAdmin } = useAuth();

    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">
                {roomName} - Domotica Controls
            </Typography>

            {isAdmin() && (
                <Button variant="outlined" startIcon={<Add />} onClick={onAdd}>
                    Control Toevoegen
                </Button>
            )}
        </Box>
    );
}
