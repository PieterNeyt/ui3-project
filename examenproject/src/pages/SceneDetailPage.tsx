import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Breadcrumbs,
    Link,
} from '@mui/material';
import { NavigateNext, ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router';
import { useScene } from '../hooks/useScenes';
import {useCreateTimeSlot, useUpdateTimeSlot, useDeleteTimeSlot } from '../hooks/useTimeSlots';
import { TimeSlotList } from '../components/timeslot/TimeSlotList';
import { TimeSlotForm } from '../components/timeslot/TimeSlotForm';
import type { TimeSlot, TimeSlotFormData } from '../types/timeslot';
import { useAuth } from '../context/useAuth';

export const SceneDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    const { data: scene, isLoading: sceneLoading, error: sceneError } = useScene(id || '');


    const createTimeSlotMutation = useCreateTimeSlot();
    const updateTimeSlotMutation = useUpdateTimeSlot();
    const deleteTimeSlotMutation = useDeleteTimeSlot();

    const [isTimeSlotFormOpen, setIsTimeSlotFormOpen] = useState(false);
    const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [timeSlotToDelete, setTimeSlotToDelete] = useState<string | null>(null);

    const handleAddTimeSlot = () => {
        setEditingTimeSlot(null);
        setIsTimeSlotFormOpen(true);
    };

    const handleEditTimeSlot = (timeslot: TimeSlot) => {
        setEditingTimeSlot(timeslot);
        setIsTimeSlotFormOpen(true);
    };

    const handleDeleteTimeSlot = (timeslotId: string) => {
        setTimeSlotToDelete(timeslotId);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!timeSlotToDelete) return;

        try {
            await deleteTimeSlotMutation.mutateAsync(timeSlotToDelete);
            setDeleteConfirmOpen(false);
            setTimeSlotToDelete(null);
        } catch (err) {
            console.error('Failed to delete timeslot:', err);
        }
    };

    const handleSaveTimeSlot = async (timeSlotData: TimeSlotFormData) => {
        try {
            if (editingTimeSlot) {
                await updateTimeSlotMutation.mutateAsync({
                    id: editingTimeSlot.id,
                    data: timeSlotData
                });
            } else {
                await createTimeSlotMutation.mutateAsync({
                    ...timeSlotData,
                    sceneId: id!,
                });
            }
            setIsTimeSlotFormOpen(false);
            setEditingTimeSlot(null);
        } catch (err) {
            console.error('Failed to save timeslot:', err);
        }
    };

    if (sceneLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (sceneError || !scene) {
        return (
            <Container sx={{ mt: 12, mb: 4 }}>
                <Alert severity="error">
                    Scene niet gevonden of fout bij laden.
                </Alert>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/scenes')}
                    sx={{ mt: 2 }}
                >
                    Terug naar Scenes
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 12, mb: 4, py: 4 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
                <Link
                    component="button"
                    variant="body1"
                    onClick={() => navigate('/scenes')}
                    color="inherit"
                >
                    Scenes
                </Link>
                <Typography color="text.primary">{scene.naam}</Typography>
            </Breadcrumbs>

            {/* Scene Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {scene.naam}
                    </Typography>
                    {scene.omschrijving && (
                        <Typography variant="body1" color="text.secondary">
                            {scene.omschrijving}
                        </Typography>
                    )}
                </Box>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/scenes')}
                >
                    Terug
                </Button>
            </Box>

            {/* Scene Info */}
            <Box sx={{ mb: 4, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                    Scene Informatie
                </Typography>
                <Typography variant="body2">
                    Aantal devices: {scene.controls.length}
                </Typography>
                {scene.isGlobal && (
                    <Typography variant="body2" color="primary">
                        Globale scene
                    </Typography>
                )}
            </Box>

            {/* TimeSlots Section */}
            <TimeSlotList
                sceneId={id!}
                onAddTimeSlot={handleAddTimeSlot}
                onEditTimeSlot={handleEditTimeSlot}
                onDeleteTimeSlot={handleDeleteTimeSlot}
                isAdmin={isAdmin()}
            />

            {/* TimeSlot Form Dialog */}
            <TimeSlotForm
                open={isTimeSlotFormOpen}
                timeslot={editingTimeSlot}
                onSave={handleSaveTimeSlot}
                onClose={() => {
                    setIsTimeSlotFormOpen(false);
                    setEditingTimeSlot(null);
                }}
                isSubmitting={createTimeSlotMutation.isPending || updateTimeSlotMutation.isPending}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Tijdslot Verwijderen</DialogTitle>
                <DialogContent>
                    <Typography>
                        Weet je zeker dat je dit tijdslot wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Annuleren</Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        disabled={deleteTimeSlotMutation.isPending}
                    >
                        {deleteTimeSlotMutation.isPending ? 'Verwijderen...' : 'Verwijderen'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};