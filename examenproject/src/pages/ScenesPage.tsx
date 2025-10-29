import React, { useState } from 'react';
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
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useScenes, useCreateScene, useUpdateScene, useDeleteScene, useActivateScene } from '../hooks/useScenes';
import { SceneCard } from '../components/scene/SceneCard';
import { SceneForm } from '../components/scene/SceneForm';
import type { Scene, SceneFormData } from '../types/scene';
import { useAuth } from "../context/useAuth.tsx";

export const ScenesPage: React.FC = () => {
    const { isAdmin, isGebruiker } = useAuth();
    const { data: scenes = [], isLoading, error } = useScenes();
    const createSceneMutation = useCreateScene();
    const updateSceneMutation = useUpdateScene();
    const deleteSceneMutation = useDeleteScene();
    const activateSceneMutation = useActivateScene();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingScene, setEditingScene] = useState<Scene | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [sceneToDelete, setSceneToDelete] = useState<string | null>(null);

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

    return (
        <Container maxWidth="lg" sx={{ mt: 12, mb: 4, py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Scenes
                </Typography>

                {isAdmin() && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setIsFormOpen(true)}
                    >
                        New Scene
                    </Button>
                )}
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {(error as Error).message}
                </Alert>
            )}

            {scenes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No scenes found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {isAdmin() ? 'Create your first scene to get started' : 'No scenes available'} {/* Functie aanroepen */}
                    </Typography>
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
                                onEdit={isAdmin() ? (scene) => {
                                    setEditingScene(scene);
                                    setIsFormOpen(true);
                                } : () => {}}
                                onDelete={isAdmin() ? (id) => {
                                    setSceneToDelete(id);
                                    setDeleteConfirmOpen(true);
                                } : () => {}}
                                isAdmin={isAdmin()}
                            />
                        </Box>
                    ))}
                </Box>
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
                <DialogTitle>Delete Scene</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this scene? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteScene} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};