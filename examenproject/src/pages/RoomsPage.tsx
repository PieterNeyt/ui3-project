import React, {useState} from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    Alert,
    CircularProgress,
    IconButton,
    Card,
    CardContent,
    CardActions,
    Breadcrumbs,
    Link,
} from '@mui/material';
import {Edit, Delete, Add, Home, Settings} from '@mui/icons-material';
import {Link as RouterLink, useParams} from 'react-router';
import {useRoomsByFloor, useCreateRoom, useUpdateRoom, useDeleteRoom} from '../hooks/useRooms';
import {useFloors} from '../hooks/useFloors';
import {RoomForm} from '../components/room/RoomForm';
import {FloorPlan} from '../components/room/FloorPlan';
import type {Room, RoomFormData} from '../types/room';
import {useAuth} from '../context/useAuth';

export const RoomsPage: React.FC = () => {
    const {isAdmin, isGebruiker} = useAuth();
    const {verdiepingId} = useParams<{ verdiepingId: string }>();

    const {data: floors} = useFloors();
    const {data: rooms, error, isLoading} = useRoomsByFloor(verdiepingId || '');
    const createRoomMutation = useCreateRoom();
    const updateRoomMutation = useUpdateRoom();
    const deleteRoomMutation = useDeleteRoom();

    const [formOpen, setFormOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    const currentFloor = floors?.find(floor => floor.id === verdiepingId);

    const handleCreateRoom = (data: RoomFormData) => {
        createRoomMutation.mutate(data, {
            onSuccess: () => {
                setFormOpen(false);
            },
        });
    };

    const handleUpdateRoom = (data: RoomFormData) => {
        if (editingRoom) {
            updateRoomMutation.mutate(
                {id: editingRoom.id, data},
                {
                    onSuccess: () => {
                        setFormOpen(false);
                        setEditingRoom(null);
                    },
                }
            );
        }
    };

    const handleDeleteRoom = (id: string) => {
        if (window.confirm('Weet je zeker dat je deze kamer wilt verwijderen?')) {
            deleteRoomMutation.mutate(id);
        }
    };

    const handleEditRoom = (room: Room) => {
        setEditingRoom(room);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditingRoom(null);
    };

    if (!isAdmin() && !isGebruiker) {
        return (
            <Container sx={{mt: 12, mb: 4}}>
                <Alert severity="error">
                    Je hebt geen toegang tot deze pagina. Log in als admin.
                </Alert>
            </Container>
        );
    }

    if (!verdiepingId) {
        return (
            <Container sx={{mt: 12, mb: 4}}>
                <Alert severity="error">
                    Geen verdieping geselecteerd.
                </Alert>
            </Container>
        );
    }

    if (!currentFloor) {
        return (
            <Container sx={{mt: 12, mb: 4}}>
                <Alert severity="error">
                    Verdieping niet gevonden.
                </Alert>
            </Container>
        );
    }

    return (
        <Container sx={{mt: 12, mb: 4}}>

            <Breadcrumbs sx={{mb: 3}}>
                <Link component={RouterLink} to="/" color="inherit" underline="hover">
                    <Home sx={{mr: 0.5}} fontSize="inherit"/>
                    Home
                </Link>
                <Link component={RouterLink} to="/floors" color="inherit" underline="hover">
                    Verdiepingen
                </Link>
                <Typography color="text.primary">{currentFloor.naam}</Typography>
            </Breadcrumbs>

            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
                <Box>
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                    >
                        Kamers Beheren - {currentFloor.naam}
                    </Typography>
                    {currentFloor.omschrijving && (
                        <Typography variant="body1" color="text.secondary">
                            {currentFloor.omschrijving}
                        </Typography>
                    )}
                </Box>
                {isAdmin() && (
                    <Button
                        variant="contained"
                        startIcon={<Add/>}
                        onClick={() => setFormOpen(true)}
                    >
                        Nieuwe Kamer
                    </Button>)}
            </Box>

            {error && (
                <Alert severity="error" sx={{mb: 2}}>
                    Fout bij het laden van kamers: {(error as Error).message}
                </Alert>
            )}


            {currentFloor && rooms && (
                <Box mb={4}>
                    <FloorPlan
                        floor={currentFloor}
                        rooms={rooms}
                        onRoomClick={handleEditRoom}
                        scale={0.8}
                    />
                </Box>
            )}

            {isLoading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress/>
                </Box>
            )}


            <Typography
                variant="h5"
                gutterBottom
                sx={{mt: 4}}
            >
                Alle Kamers ({rooms?.length || 0})
            </Typography>

            {rooms && rooms.length === 0 && (
                <Alert severity="info">
                    Er zijn nog geen kamers op deze verdieping. Maak er een aan om te beginnen.
                </Alert>
            )}

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
                {rooms?.map((room) => (
                    <Card key={room.id}>
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
                            {isAdmin() && (
                            <IconButton
                                color="primary"
                                onClick={() => handleEditRoom(room)}
                                disabled={createRoomMutation.isPending || updateRoomMutation.isPending}
                            >
                                <Edit/>
                            </IconButton>)}
                            <IconButton
                                color="secondary"
                                component={RouterLink}
                                to={`/rooms/${room.id}/devices`}
                                title="Domotica Controls Beheren"
                            >
                                <Settings/>
                            </IconButton>
                            {isAdmin() && (
                            <IconButton
                                color="error"
                                onClick={() => handleDeleteRoom(room.id)}
                                disabled={deleteRoomMutation.isPending}
                            >
                                <Delete/>
                            </IconButton>)}
                        </CardActions>
                    </Card>
                ))}
            </Box>

            <RoomForm
                open={formOpen}
                onClose={handleCloseForm}
                onSubmit={editingRoom ? handleUpdateRoom : handleCreateRoom}
                room={editingRoom}
                floors={floors || []}
                isSubmitting={
                    createRoomMutation.isPending || updateRoomMutation.isPending
                }
            />
        </Container>
    );
};