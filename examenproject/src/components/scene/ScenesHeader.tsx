import { Box, Typography, Button } from '@mui/material';
import { Add, Stop } from '@mui/icons-material';

interface ScenesHeaderProps {
    isAdmin: boolean;
    isGebruiker: boolean;
    manuallyActivatedSceneId: string | null;
    onDeactivateScene: () => void;
    onAddScene: () => void;
}

export const ScenesHeader = ({
                                 isAdmin,
                                 isGebruiker,
                                 manuallyActivatedSceneId,
                                 onDeactivateScene,
                                 onAddScene,
                             }: ScenesHeaderProps) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    Scenes
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Beheer je globale en persoonlijke scenes
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {manuallyActivatedSceneId && (
                    <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<Stop />}
                        onClick={onDeactivateScene}
                    >
                        Alle Scenes Deactiveren
                    </Button>
                )}

                {(isAdmin || isGebruiker) && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={onAddScene}
                        size="large"
                    >
                        Nieuwe Scene
                    </Button>
                )}
            </Box>
        </Box>
    );
};