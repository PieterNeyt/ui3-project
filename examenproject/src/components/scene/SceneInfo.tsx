import { Box, Typography } from '@mui/material';
import type { Scene } from '../../types/scene.ts';

interface SceneInfoProps {
    scene: Scene;
}

export const SceneInfo = ({ scene}: SceneInfoProps) => {
    return (
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
    );
};