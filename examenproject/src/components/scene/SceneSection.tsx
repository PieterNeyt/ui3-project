import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { SceneCard } from './card/SceneCard.tsx';
import type { Scene } from '../../types/scene.ts';

interface SceneSectionProps {
    title: string;
    scenes: Scene[];
    emptyMessage: string;
    showCreateButton: boolean;
    canEditScene: (scene: Scene) => boolean;
    manuallyActivatedSceneId: string | null;
    onEditScene: (scene: Scene) => void;
    onDeleteScene: (id: string) => void;
    onActivateScene: (sceneId: string) => void;
    onDeactivateScene: () => void;
    onAddScene: () => void;
}

export const SceneSection = ({
                                 title,
                                 scenes,
                                 emptyMessage,
                                 showCreateButton,
                                 canEditScene,
                                 manuallyActivatedSceneId,
                                 onEditScene,
                                 onDeleteScene,
                                 onActivateScene,
                                 onDeactivateScene,
                                 onAddScene,
                             }: SceneSectionProps) => {
    return (
        <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2">
                    {title} ({scenes.length})
                </Typography>
                {showCreateButton && (
                    <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={onAddScene}
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
                            onClick={onAddScene}
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
                                onActivate={onActivateScene}
                                onDeactivate={onDeactivateScene}
                                onEdit={canEditScene(scene) ? onEditScene : () => {}}
                                onDelete={canEditScene(scene) ? onDeleteScene : () => {}}
                                isAdmin={canEditScene(scene)}
                                isCurrentlyActive={scene.id === manuallyActivatedSceneId}
                            />
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};