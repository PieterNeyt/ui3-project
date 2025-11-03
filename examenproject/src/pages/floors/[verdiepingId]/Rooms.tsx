import { useState } from 'react';
import {
    Container,
    Alert,
    CircularProgress,
    Box,
} from '@mui/material';
import { useParams } from 'react-router';
import { useRoomsByFloor, useCreateRoom, useUpdateRoom, useDeleteRoom } from '../../../hooks/useRooms.ts';
import { useFloors } from '../../../hooks/useFloors.ts';
import { useAuth } from '../../../hooks/useAuth.ts';
import type { Room, RoomFormData } from '../../../types/room.ts';
import { RoomsHeader } from '../../../components/room/RoomsHeader.tsx';
import { RoomsBreadcrumbs } from '../../../components/room/RoomsBreadcrumbs.tsx';
import { FloorPlanSection } from '../../../components/room/FloorPlanSection.tsx';
import { RoomsGrid } from '../../../components/room/RoomsGrid.tsx';
import { RoomForm } from '../../../components/room/RoomForm.tsx';

export default function Rooms() {
    const { isAdmin, isGebruiker } = useAuth();
    const { verdiepingId } = useParams<{ verdiepingId: string }>();

    const { data: floors } = useFloors();
    const { data: rooms, error, isLoading } = useRoomsByFloor(verdiepingId || '');
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
                { id: editingRoom.id, data },
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

    if (!isAdmin() && !isGebruiker()) {
        return (
            <Container sx={{ mt: 12, mb: 4 }}>
                <Alert severity="error">
                    Je hebt geen toegang tot deze pagina. Log in als gebruiker of admin.
                </Alert>
            </Container>
        );
    }

    if (!verdiepingId) {
        return (
            <Container sx={{ mt: 12, mb: 4 }}>
                <Alert severity="error">
                    Geen verdieping geselecteerd.
                </Alert>
            </Container>
        );
    }

    if (!currentFloor) {
        return (
            <Container sx={{ mt: 12, mb: 4 }}>
                <Alert severity="error">
                    Verdieping niet gevonden.
                </Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 12, mb: 4 }}>
            <RoomsBreadcrumbs currentFloor={currentFloor} />

            <RoomsHeader
                currentFloor={currentFloor}
                isAdmin={isAdmin()}
                onAddRoom={() => setFormOpen(true)}
            />

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Fout bij het laden van kamers: {(error as Error).message}
                </Alert>
            )}

            <FloorPlanSection
                currentFloor={currentFloor}
                rooms={rooms}
                onRoomClick={handleEditRoom}
            />

            {isLoading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            )}

            <RoomsGrid
                rooms={rooms}
                isAdmin={isAdmin()}
                onEditRoom={handleEditRoom}
                onDeleteRoom={handleDeleteRoom}
                isSubmitting={createRoomMutation.isPending || updateRoomMutation.isPending || deleteRoomMutation.isPending}
            />

            <RoomForm
                open={formOpen}
                onClose={handleCloseForm}
                onSubmit={editingRoom ? handleUpdateRoom : handleCreateRoom}
                room={editingRoom}
                floors={floors || []}
                isSubmitting={createRoomMutation.isPending || updateRoomMutation.isPending}
            />
        </Container>
    );
}