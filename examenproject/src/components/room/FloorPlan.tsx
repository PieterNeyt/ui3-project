import { Box, Paper, Typography } from '@mui/material';
import type {Floor} from '../../types/floor';
import type {Room} from '../../types/room';
import {useAuth} from "../../context/useAuth.tsx";
import {useNavigate} from "react-router";

interface FloorPlanProps {
    floor: Floor;
    rooms: Room[];
    onRoomClick?: (room: Room) => void;
    scale?: number;
}

export const FloorPlan= ({
                                                        floor,
                                                        rooms,
                                                        onRoomClick,
                                                        scale = 1,
                                                    }:FloorPlanProps) => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Grondplan: {floor.naam}
            </Typography>
            {floor.omschrijving && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {floor.omschrijving}
                </Typography>
            )}

            <Box
                sx={{
                    position: 'relative',
                    width: floor.width * scale,
                    height: floor.height * scale,
                    border: '3px solid',
                    borderColor: 'text.primary',
                    bgcolor: 'background.default',
                    overflow: 'hidden',
                    margin: '0 auto',
                }}
            >
                {/* Verdieping achtergrond */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        bgcolor: 'grey.100',
                    }}
                />

                {/* Kamers */}
                {rooms.map((room) => (
                    <Box
                        key={room.id}
                        sx={{
                            position: 'absolute',
                            left: room.x * scale,
                            top: room.y * scale,
                            width: room.width * scale,
                            height: room.height * scale,
                            bgcolor: 'primary.main',
                            opacity: 0.7,
                            border: '2px solid',
                            borderColor: 'primary.dark',
                            cursor: onRoomClick ? 'pointer' : 'default',
                            '&:hover': onRoomClick ? {
                                bgcolor: 'primary.dark',
                                opacity: 0.9,
                            } : {},
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: `${Math.max(12, 14 * scale)}px`,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            p: 1,
                        }}
                        onClick={() => {
                            if (isAdmin()) {
                                onRoomClick?.(room);
                            }else {
                                navigate(`/rooms/${room.id}/devices`);
                            }
                        }}
                    >
                        {room.naam}
                    </Box>
                ))}
            </Box>

            <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Afmeting verdieping: {floor.width} × {floor.height} |
                    Aantal kamers: {rooms.length}
                </Typography>
            </Box>
        </Paper>
    );
};