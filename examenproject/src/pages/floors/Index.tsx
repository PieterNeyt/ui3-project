import { useState } from 'react';
import {
    Container,
    Alert,
    CircularProgress,
    Box,
} from '@mui/material';
import { useFloors, useCreateFloor, useUpdateFloor, useDeleteFloor } from '../../hooks/useFloors.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import type { Floor, FloorFormData } from '../../types/floor.ts';
import { FloorsHeader } from '../../components/floor/FloorsHeader.tsx';
import { FloorsGrid } from '../../components/floor/FloorsGrid.tsx';
import { FloorForm } from '../../components/floor/form/FloorForm.tsx';

export default function Index() {
    const { isAdmin, isGebruiker } = useAuth();
    const { data: floors, error, isLoading } = useFloors();
    const createFloorMutation = useCreateFloor();
    const updateFloorMutation = useUpdateFloor();
    const deleteFloorMutation = useDeleteFloor();

    const [formOpen, setFormOpen] = useState(false);
    const [editingFloor, setEditingFloor] = useState<Floor | null>(null);

    const handleCreateFloor = (data: FloorFormData) => {
        createFloorMutation.mutate(data, {
            onSuccess: () => {
                setFormOpen(false);
            },
        });
    };

    const handleUpdateFloor = (data: FloorFormData) => {
        if (editingFloor) {
            updateFloorMutation.mutate(
                { id: editingFloor.id, data },
                {
                    onSuccess: () => {
                        setFormOpen(false);
                        setEditingFloor(null);
                    },
                }
            );
        }
    };

    const handleDeleteFloor = (id: string) => {
        if (window.confirm('Weet je zeker dat je deze verdieping wilt verwijderen?')) {
            deleteFloorMutation.mutate(id);
        }
    };

    const handleEditFloor = (floor: Floor) => {
        setEditingFloor(floor);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditingFloor(null);
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

    return (
        <Container
            sx={{
                mt: 12,
                mb: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            <FloorsHeader
                isAdmin={isAdmin()}
                onAddFloor={() => setFormOpen(true)}
            />

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Fout bij het laden van verdiepingen: {(error as Error).message}
                </Alert>
            )}

            {isLoading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            )}

            <FloorsGrid
                floors={floors}
                isAdmin={isAdmin()}
                onEditFloor={handleEditFloor}
                onDeleteFloor={handleDeleteFloor}
                isSubmitting={createFloorMutation.isPending || updateFloorMutation.isPending || deleteFloorMutation.isPending}
            />

            <FloorForm
                open={formOpen}
                onClose={handleCloseForm}
                onSubmit={editingFloor ? handleUpdateFloor : handleCreateFloor}
                floor={editingFloor}
                isSubmitting={
                    createFloorMutation.isPending || updateFloorMutation.isPending
                }
            />
        </Container>
    );
}