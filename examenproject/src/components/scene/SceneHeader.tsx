import { Box, Typography, Button, Chip } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import type { Scene } from '../../types/scene.ts';

interface SceneHeaderProps {
    scene: Scene;
    navigate: (path: string) => void;
}

export const SceneHeader = ({ scene, navigate }: SceneHeaderProps) => {
    return (
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
    );
};