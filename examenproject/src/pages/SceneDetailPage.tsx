// src/pages/SceneDetailPage.tsx
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
    Chip,
} from '@mui/material';
import { NavigateNext, ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router';
import { useScene } from '../hooks/useScenes';
import { useCreateTimeSlot, useUpdateTimeSlot, useDeleteTimeSlot } from '../hooks/useTimeSlots';
import { TimeSlotList } from '../components/timeslot/TimeSlotList';
import { TimeSlotForm } from '../components/timeslot/TimeSlotForm';
import type { TimeSlot, TimeSlotFormData } from '../types/timeslot';
import { useAuth } from '../context/useAuth';

export const SceneDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAdmin, user } = useAuth();

    const { data: scene, isLoading: sceneLoading, error: sceneError } = useScene(id || '');

    // Check toegangsrechten
    const hasAccess = scene && (isAdmin() || scene.isGlobal || scene.createdBy === user?.id);

    // Check of tijdsloten getoond mogen worden (alleen voor globale scenes of admin)
    const showTimeSlots = isAdmin() || (scene?.isGlobal ?? false);

    const createTimeSlotMutation = useCreateTimeSlot();
    const updateTimeSlotMutation = useUpdateTimeSlot();
    const deleteTimeSlotMutation = useDeleteTimeSlot();

    const [isTimeSlotFormOpen, setIsTimeSlotFormOpen] = useState(false);
    const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [timeSlotToDelete, setTimeSlotToDelete] = useState<string | null>(null);

    const handleAddTimeSlot = () => {
        // VOEG DEZE CHECK TOE - voorkom toevoegen voor persoonlijke scenes
        if (!scene?.isGlobal) {
            alert('Tijdsloten kunnen alleen worden toegevoegd aan globale scenes');
            return;
        }
        setEditingTimeSlot(null);
        setIsTimeSlotFormOpen(true);
    };

    const handleEditTimeSlot = (timeslot: TimeSlot) => {
        // VOEG DEZE CHECK TOE - voorkom bewerken voor persoonlijke scenes
        if (!scene?.isGlobal) {
            alert('Tijdsloten kunnen alleen worden bewerkt voor globale scenes');
            return;
        }
        setEditingTimeSlot(timeslot);
        setIsTimeSlotFormOpen(true);
    };

    const handleDeleteTimeSlot = (timeslotId: string) => {
        // VOEG DEZE CHECK TOE - voorkom verwijderen voor persoonlijke scenes
        if (!scene?.isGlobal) {
            alert('Tijdsloten kunnen alleen worden verwijderd van globale scenes');
            return;
        }
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

    if (sceneError || !scene || !hasAccess) {
        return (
            <Container sx={{ mt: 12, mb: 4 }}>
                <Alert severity="error">
                    {!hasAccess ? 'Je hebt geen toegang tot deze scene.' : 'Scene niet gevonden of fout bij laden.'}
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
                    sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                    Scenes
                </Link>
                <Typography color="text.primary">{scene.naam}</Typography>
            </Breadcrumbs>

            {/* Scene Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h4" component="h1">
                            {scene.naam}
                        </Typography>
                        <Chip
                            label={scene.isGlobal ? "Globale Scene" : "Persoonlijke Scene"}
                            color={scene.isGlobal ? "primary" : "success"}
                            variant="outlined"
                        />
                    </Box>
                    {scene.omschrijving && (
                        <Typography variant="body1" color="text.secondary">
                            {scene.omschrijving}
                        </Typography>
                    )}
                </Box>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/scenes')}
                    variant="outlined"
                >
                    Terug
                </Button>
            </Box>

            {/* Scene Info */}
            <Box sx={{ mb: 4, p: 3, bgcolor: 'background.default', borderRadius: 2, border: 1, borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Scene Informatie
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2">
                        <strong>Aantal devices:</strong> {scene.controls.length}
                    </Typography>
                    <Typography variant="body2" color={scene.isGlobal ? "primary.main" : "success.main"}>
                        <strong>Type:</strong> {scene.isGlobal ? "Globale scene (zichtbaar voor alle gebruikers)" : "Persoonlijke scene (alleen zichtbaar voor jou)"}
                    </Typography>
                    {!scene.isGlobal && (
                        <Typography variant="caption" color="text.secondary">
                            Persoonlijke scenes kunnen niet gekoppeld worden aan tijdsloten
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* TimeSlots Section - alleen voor globale scenes */}

            {showTimeSlots ? (
                <Box sx={{ mb: 4 }}>
                    <TimeSlotList
                        sceneId={id!}
                        onAddTimeSlot={handleAddTimeSlot}
                        onEditTimeSlot={handleEditTimeSlot}
                        onDeleteTimeSlot={handleDeleteTimeSlot}
                        isAdmin={isAdmin()}
                        isGlobalScene={scene?.isGlobal}
                    />
                </Box>
            ) : (
                <Alert severity="info" sx={{ mb: 4 }}>
                    <Typography variant="body2">
                        <strong>Persoonlijke scenes kunnen niet gekoppeld worden aan tijdsloten.</strong>
                        <br />
                        Alleen globale scenes kunnen automatisch geactiveerd worden via tijdsloten.
                        {isAdmin() && " Als admin kun je deze scene converteren naar een globale scene om tijdsloten toe te voegen."}
                    </Typography>
                </Alert>
            )}

            {/* Device Controls Overzicht */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Device Instellingen
                </Typography>
                {scene.controls.length === 0 ? (
                    <Alert severity="info">
                        Deze scene heeft geen devices geconfigureerd.
                    </Alert>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {scene.controls.map((control, index) => (
                            <Box
                                key={index}
                                sx={{
                                    p: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    backgroundColor: 'background.default'
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    {control.device?.naam || `Device ${control.deviceId}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Type: {control.device?.type || 'Onbekend'}
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2">
                                        <strong>Instellingen:</strong>
                                    </Typography>
                                    {Object.entries(control.waarde).map(([key, value]) => (
                                        <Typography key={key} variant="body2" color="text.secondary">
                                            • {key}: {String(value)}
                                        </Typography>
                                    ))}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

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