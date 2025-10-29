import React, { useState } from 'react';
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
} from '@mui/material';
import {Edit, Delete, Add} from '@mui/icons-material';
import { useFloors, useCreateFloor, useUpdateFloor, useDeleteFloor } from '../hooks/useFloors';
import { FloorForm } from '../components/floor/FloorForm';
import { FloorPreview } from '../components/floor/FloorPreview';
import type { Floor, FloorFormData } from '../types/floor';
import { useAuth } from '../context/useAuth';


export const FloorsPage: React.FC = () => {
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

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
                sx={{
                    pb: 1,
                    gap: 2,
                    width: '100%',
                    maxWidth: 1200,
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    color="text.primary"
                    sx={{ fontWeight: 600 }}
                >
                    Verdiepingen Beheren
                </Typography>

                {isAdmin() && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setFormOpen(true)}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        Nieuwe Verdieping
                    </Button>
                )}
            </Box>

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

            {floors && floors.length === 0 && (
                <Alert severity="info">
                    Er zijn nog geen verdiepingen. Maak er een aan om te beginnen.
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
                    width: '100%',
                    maxWidth: 1200
                }}
            >
                {floors?.map((floor) => (
                    <Card key={floor.id}>
                        <CardContent>
                            <FloorPreview floor={floor} />
                        </CardContent>
                        {isAdmin() && (
                        <CardActions>
                            <IconButton
                                color="primary"
                                onClick={() => handleEditFloor(floor)}
                                disabled={createFloorMutation.isPending || updateFloorMutation.isPending}
                            >
                                <Edit />
                            </IconButton>
                            <IconButton
                                color="error"
                                onClick={() => handleDeleteFloor(floor.id)}
                                disabled={deleteFloorMutation.isPending}
                            >
                                <Delete />
                            </IconButton>
                        </CardActions>)}
                    </Card>
                ))}
            </Box>

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
};