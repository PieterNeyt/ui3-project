import {
    Typography,
    Alert,
    Box,
    Card,
    CardContent,
    CardActions,
    IconButton,
} from '@mui/material';
import { Edit, Delete, Settings } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router';
import type { Room } from '../../types/room.ts';

interface RoomsGridProps {
    rooms?: Room[];
    isAdmin: boolean;
    onEditRoom: (room: Room) => void;
    onDeleteRoom: (id: string) => void;
    isSubmitting: boolean;
}

export const RoomsGrid = ({
                              rooms,
                              isAdmin,
                              onEditRoom,
                              onDeleteRoom,
                              isSubmitting
                          }: RoomsGridProps) => {
    if (!rooms || rooms.length === 0) {
        return (
            <Alert severity="info">
                Er zijn nog geen kamers op deze verdieping. Maak er een aan om te beginnen.
            </Alert>
        );
    }

    return (
        <>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Alle Kamers ({rooms.length})
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)'
                    },
                    gap: 3,
                    mt: 2
                }}
            >
                {rooms.map((room) => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        isAdmin={isAdmin}
                        onEditRoom={onEditRoom}
                        onDeleteRoom={onDeleteRoom}
                        isSubmitting={isSubmitting}
                    />
                ))}
            </Box>
        </>
    );
};

interface RoomCardProps {
    room: Room;
    isAdmin: boolean;
    onEditRoom: (room: Room) => void;
    onDeleteRoom: (id: string) => void;
    isSubmitting: boolean;
}

const RoomCard = ({ room, isAdmin, onEditRoom, onDeleteRoom, isSubmitting }: RoomCardProps) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {room.naam}
                </Typography>
                {room.omschrijving && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        {room.omschrijving}
                    </Typography>
                )}
                <Typography variant="body2">
                    Positie: ({room.x}, {room.y})
                </Typography>
                <Typography variant="body2">
                    Afmeting: {room.width} × {room.height}
                </Typography>
            </CardContent>
            <CardActions>
                {isAdmin && (
                    <IconButton
                        color="primary"
                        onClick={() => onEditRoom(room)}
                        disabled={isSubmitting}
                    >
                        <Edit />
                    </IconButton>
                )}
                <IconButton
                    color="secondary"
                    component={RouterLink}
                    to={`/rooms/${room.id}/devices`}
                    title="Domotica Controls Beheren"
                >
                    <Settings />
                </IconButton>
                {isAdmin && (
                    <IconButton
                        color="error"
                        onClick={() => onDeleteRoom(room.id)}
                        disabled={isSubmitting}
                    >
                        <Delete />
                    </IconButton>
                )}
            </CardActions>
        </Card>
    );
};