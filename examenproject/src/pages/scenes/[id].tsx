import { useState } from 'react';
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router';
import { useScene } from '../../hooks/useScenes.ts';
import { useCreateTimeSlot, useUpdateTimeSlot, useDeleteTimeSlot } from '../../hooks/useTimeSlots.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import type { TimeSlot, TimeSlotFormData } from '../../types/timeslot.ts';
import { SceneBreadcrumbs } from '../../components/scene/SceneBreadcrumbs.tsx';
import { SceneHeader } from '../../components/scene/SceneHeader.tsx';
import { SceneInfo } from '../../components/scene/SceneInfo.tsx';
import { TimeSlotsSection } from '../../components/scene/TimeSlotsSection.tsx';
import { DeviceControlsSection } from '../../components/device/DeviceControlsSection.tsx';
import { TimeSlotForm } from '../../components/timeslot/TimeSlotForm.tsx';

export default function Id() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAdmin, user } = useAuth();

    const { data: scene, isLoading: sceneLoading, error: sceneError } = useScene(id || '');
    const createTimeSlotMutation = useCreateTimeSlot();
    const updateTimeSlotMutation = useUpdateTimeSlot();
    const deleteTimeSlotMutation = useDeleteTimeSlot();

    const [isTimeSlotFormOpen, setIsTimeSlotFormOpen] = useState(false);
    const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [timeSlotToDelete, setTimeSlotToDelete] = useState<string | null>(null);

    const hasAccess = scene && (isAdmin() || scene.isGlobal || scene.createdBy === user?.id);
    const showTimeSlots = isAdmin() || (scene?.isGlobal ?? false);

    const handleAddTimeSlot = () => {
        if (!scene?.isGlobal) {
            alert('Tijdsloten kunnen alleen worden toegevoegd aan globale scenes');
            return;
        }
        setEditingTimeSlot(null);
        setIsTimeSlotFormOpen(true);
    };

    const handleEditTimeSlot = (timeslot: TimeSlot) => {
        if (!scene?.isGlobal) {
            alert('Tijdsloten kunnen alleen worden bewerkt voor globale scenes');
            return;
        }
        setEditingTimeSlot(timeslot);
        setIsTimeSlotFormOpen(true);
    };

    const handleDeleteTimeSlot = (timeslotId: string) => {
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
            <SceneBreadcrumbs scene={scene} navigate={navigate} />

            <SceneHeader scene={scene} navigate={navigate} />

            <SceneInfo scene={scene} />

            <TimeSlotsSection
                sceneId={id!}
                scene={scene}
                isAdmin={isAdmin()}
                showTimeSlots={showTimeSlots}
                onAddTimeSlot={handleAddTimeSlot}
                onEditTimeSlot={handleEditTimeSlot}
                onDeleteTimeSlot={handleDeleteTimeSlot}
            />

            <DeviceControlsSection scene={scene} />

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

            <DeleteConfirmationDialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                isDeleting={deleteTimeSlotMutation.isPending}
            />
        </Container>
    );
}

interface DeleteConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
}

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, isDeleting }: DeleteConfirmationDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Tijdslot Verwijderen</DialogTitle>
            <DialogContent>
                <Typography>
                    Weet je zeker dat je dit tijdslot wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Annuleren</Button>
                <Button
                    onClick={onConfirm}
                    color="error"
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Verwijderen...' : 'Verwijderen'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};