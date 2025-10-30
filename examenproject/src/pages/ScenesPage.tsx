import React, { useState, useMemo } from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useScenes, useCreateScene, useUpdateScene, useDeleteScene, useActivateScene } from '../hooks/useScenes';
import { SceneCard } from '../components/scene/SceneCard';
import { SceneForm } from '../components/scene/SceneForm';
import type { Scene, SceneFormData } from '../types/scene';
import { useAuth } from "../context/useAuth.tsx";

export const ScenesPage: React.FC = () => {
    const { isAdmin, isGebruiker, user } = useAuth();
    const { data: scenes = [], isLoading, error } = useScenes();
    const createSceneMutation = useCreateScene();
    const updateSceneMutation = useUpdateScene();
    const deleteSceneMutation = useDeleteScene();
    const activateSceneMutation = useActivateScene();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingScene, setEditingScene] = useState<Scene | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [sceneToDelete, setSceneToDelete] = useState<string | null>(null);

    // Filter scenes
    const { globalScenes, personalScenes } = useMemo(() => {
        const allScenes = scenes || [];

        const global = allScenes.filter(scene => scene.isGlobal);
        const personal = isAdmin()
            ? allScenes.filter(scene => !scene.isGlobal)
            : allScenes.filter(scene => !scene.isGlobal && scene.createdBy === user?.id);

        return { globalScenes: global, personalScenes: personal };
    }, [scenes, isAdmin, user]);

    // Bepaal of gebruiker scenes kan bewerken/verwijderen
    const canEditScene = (scene: Scene): boolean => {
        return isAdmin() || (!scene.isGlobal && scene.createdBy === user?.id);
    };

    const handleCreateScene = async (sceneData: SceneFormData) => {
        try {
            sceneData.userId= user?.id as string;
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
        } catch (err) {
            console.error('Failed to activate scene:', err);
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

    const renderSceneSection = (
        title: string,
        scenes: Scene[],
        emptyMessage: string,
        showCreateButton: boolean = false
    ) => (
        <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2">
                    {title} ({scenes.length})
                </Typography>
                {showCreateButton && (
                    <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => setIsFormOpen(true)}
                        size="small"
                    >
                        Scene Toevoegen
                    </Button>
                )}
            </Box>

            {scenes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'background.default', borderRadius: 2 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        {emptyMessage}
                    </Typography>
                    {showCreateButton && (
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setIsFormOpen(true)}
                        >
                            Eerste Scene Aanmaken
                        </Button>
                    )}
                </Box>
            ) : (
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                    {scenes.map((scene) => (
                        <Box key={scene.id} sx={{ width: { xs: '100%', sm: 345 } }}>
                            <SceneCard
                                scene={scene}
                                onActivate={handleActivateScene}
                                onEdit={canEditScene(scene) ? (scene) => {
                                    setEditingScene(scene);
                                    setIsFormOpen(true);
                                } : () => {}}
                                onDelete={canEditScene(scene) ? (id) => {
                                    setSceneToDelete(id);
                                    setDeleteConfirmOpen(true);
                                } : () => {}}
                                isAdmin={isAdmin()}
                            />
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 12, mb: 4, py: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Scenes
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Beheer je globale en persoonlijke scenes
                    </Typography>
                </Box>

                {(isAdmin() || isGebruiker()) && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setIsFormOpen(true)}
                        size="large"
                    >
                        Nieuwe Scene
                    </Button>
                )}
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {(error as Error).message}
                </Alert>
            )}

            {/* Globale Scenes Sectie */}
            {renderSceneSection(
                "Globale Scenes",
                globalScenes,
                isAdmin()
                    ? "Er zijn nog geen globale scenes. Maak er een aan om te delen met alle gebruikers."
                    : "Er zijn momenteel geen globale scenes beschikbaar.",
                isAdmin() // Alleen admin kan globale scenes aanmaken
            )}

            <Divider sx={{ my: 4 }} />

            {/* Persoonlijke Scenes Sectie */}
            {renderSceneSection(
                isAdmin() ? "Persoonlijke Scenes" : "Mijn Scenes",
                personalScenes,
                isAdmin()
                    ? "Er zijn nog geen persoonlijke scenes aangemaakt door gebruikers."
                    : "Je hebt nog geen persoonlijke scenes aangemaakt. Maak je eerste scene aan!",
                true // Altijd knop tonen voor persoonlijke scenes
            )}

            {/* Scene Form Dialog */}
            <SceneForm
                open={isFormOpen}
                scene={editingScene}
                onSave={editingScene ? handleUpdateScene : handleCreateScene}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingScene(null);
                }}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Scene Verwijderen</DialogTitle>
                <DialogContent>
                    <Typography>
                        Weet je zeker dat je deze scene wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Annuleren</Button>
                    <Button onClick={handleDeleteScene} color="error">
                        Verwijderen
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};