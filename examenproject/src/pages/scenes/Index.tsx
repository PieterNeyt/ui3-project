import { useState, useMemo, useEffect } from 'react';
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Button,
} from '@mui/material';
import {
    useScenes,
    useCreateScene,
    useUpdateScene,
    useDeleteScene,
    useActivateScene,
    useDeactivateScene
} from '../../hooks/useScenes.ts';
import { useAuth } from "../../hooks/useAuth.ts";
import type { Scene, SceneFormData } from '../../types/scene.ts';
import { ScenesHeader } from '../../components/scene/ScenesHeader.tsx';
import { SceneSection } from '../../components/scene/SceneSection.tsx';
import { SceneForm } from '../../components/scene/form/SceneForm.tsx';
import { useWindowEvent } from '../../hooks/useTimeSlots.ts'; // <— custom hook gebruiken

export default function Index() {
    const { isAdmin, isGebruiker, user } = useAuth();
    const { data: scenes = [], isLoading, error } = useScenes();
    const createSceneMutation = useCreateScene();
    const updateSceneMutation = useUpdateScene();
    const deleteSceneMutation = useDeleteScene();
    const activateSceneMutation = useActivateScene();
    const deactivateSceneMutation = useDeactivateScene();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingScene, setEditingScene] = useState<Scene | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [sceneToDelete, setSceneToDelete] = useState<string | null>(null);
    const [manuallyActivatedSceneId, setManuallyActivatedSceneId] = useState<string | null>(null);


    useEffect(() => {
        const lastManualScene = localStorage.getItem('lastManuallyActivatedScene');
        if (lastManualScene) {
            setManuallyActivatedSceneId(lastManualScene);
        }
    }, []);


    useWindowEvent<CustomEvent>('sceneManuallyActivated', (event) => {
        const sceneId = event.detail.sceneId;
        setManuallyActivatedSceneId(sceneId);
        localStorage.setItem('lastManuallyActivatedScene', sceneId);
    });

    useWindowEvent<CustomEvent>('sceneManuallyDeactivated', () => {
        setManuallyActivatedSceneId(null);
        localStorage.removeItem('lastManuallyActivatedScene');
    });

    const { globalScenes, personalScenes } = useMemo(() => {
        const allScenes = scenes || [];

        const global = allScenes.filter(scene => scene.isGlobal);
        const personal = isAdmin()
            ? allScenes.filter(scene => !scene.isGlobal)
            : allScenes.filter(scene => !scene.isGlobal && scene.createdBy === user?.id);

        return { globalScenes: global, personalScenes: personal };
    }, [scenes, isAdmin, user]);

    const canEditScene = (scene: Scene): boolean => {
        return isAdmin() || (!scene.isGlobal && scene.createdBy === user?.id);
    };

    const handleCreateScene = async (sceneData: SceneFormData) => {
        try {
            await createSceneMutation.mutateAsync(sceneData);
            setIsFormOpen(false);
        } catch (err) {
            console.error('Failed to create scene:', err);
        }
    };

    const handleUpdateScene = async (sceneData: SceneFormData) => {
        if (!editingScene) return;

        try {
            await updateSceneMutation.mutateAsync({ id: editingScene.id, data: sceneData });
            setEditingScene(null);
            setIsFormOpen(false);
        } catch (err) {
            console.error('Failed to update scene:', err);
        }
    };

    const handleDeleteScene = async () => {
        if (!sceneToDelete) return;

        try {
            await deleteSceneMutation.mutateAsync(sceneToDelete);
            setDeleteConfirmOpen(false);
            setSceneToDelete(null);
        } catch (err) {
            console.error('Failed to delete scene:', err);
        }
    };

    const handleActivateScene = async (sceneId: string) => {
        try {
            await activateSceneMutation.mutateAsync(sceneId);

            window.dispatchEvent(new CustomEvent('sceneManuallyActivated', {
                detail: { sceneId }
            }));

            const scene = scenes.find(s => s.id === sceneId);
            if (scene) {
                console.log(` Scene "${scene.naam}" geactiveerd!`);
            }
        } catch (err) {
            console.error('Failed to activate scene:', err);
        }
    };

    const handleDeactivateScene = async () => {
        try {
            await deactivateSceneMutation.mutateAsync();

            window.dispatchEvent(new CustomEvent('sceneManuallyDeactivated'));

            console.log(' Scene gedeactiveerd - terug naar tijdslot/default');
        } catch (err) {
            console.error('Failed to deactivate scene:', err);
        }
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

    if (isLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 12, mb: 4, py: 4 }}>
            <ScenesHeader
                isAdmin={isAdmin()}
                isGebruiker={isGebruiker()}
                manuallyActivatedSceneId={manuallyActivatedSceneId}
                onDeactivateScene={handleDeactivateScene}
                onAddScene={() => setIsFormOpen(true)}
            />

            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {(error as Error).message}
                </Alert>
            )}

            <SceneSection
                title="Globale Scenes"
                scenes={globalScenes}
                emptyMessage={
                    isAdmin()
                        ? "Er zijn nog geen globale scenes. Maak er een aan om te delen met alle gebruikers."
                        : "Er zijn momenteel geen globale scenes beschikbaar."
                }
                showCreateButton={isAdmin()}
                canEditScene={canEditScene}
                manuallyActivatedSceneId={manuallyActivatedSceneId}
                onEditScene={(scene) => {
                    setEditingScene(scene);
                    setIsFormOpen(true);
                }}
                onDeleteScene={(id) => {
                    setSceneToDelete(id);
                    setDeleteConfirmOpen(true);
                }}
                onActivateScene={handleActivateScene}
                onDeactivateScene={handleDeactivateScene}
                onAddScene={() => setIsFormOpen(true)}
            />

            <Divider sx={{ my: 4 }} />

            <SceneSection
                title={isAdmin() ? "Persoonlijke Scenes" : "Mijn Scenes"}
                scenes={personalScenes}
                emptyMessage={
                    isAdmin()
                        ? "Er zijn nog geen persoonlijke scenes aangemaakt door gebruikers."
                        : "Je hebt nog geen persoonlijke scenes aangemaakt. Maak je eerste scene aan!"
                }
                showCreateButton={true}
                canEditScene={canEditScene}
                manuallyActivatedSceneId={manuallyActivatedSceneId}
                onEditScene={(scene) => {
                    setEditingScene(scene);
                    setIsFormOpen(true);
                }}
                onDeleteScene={(id) => {
                    setSceneToDelete(id);
                    setDeleteConfirmOpen(true);
                }}
                onActivateScene={handleActivateScene}
                onDeactivateScene={handleDeactivateScene}
                onAddScene={() => setIsFormOpen(true)}
            />

            <SceneForm
                open={isFormOpen}
                scene={editingScene}
                onSave={editingScene ? handleUpdateScene : handleCreateScene}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingScene(null);
                }}
            />

            <DeleteConfirmationDialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={handleDeleteScene}
            />
        </Container>
    );
}

interface DeleteConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationDialog = ({ open, onClose, onConfirm }: DeleteConfirmationDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Scene Verwijderen</DialogTitle>
            <DialogContent>
                <Typography>
                    Weet je zeker dat je deze scene wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Annuleren</Button>
                <Button onClick={onConfirm} color="error">
                    Verwijderen
                </Button>
            </DialogActions>
        </Dialog>
    );
};
