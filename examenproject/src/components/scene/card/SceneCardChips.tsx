import { Box, Chip } from '@mui/material';
import type { Scene } from '../../../types/scene.ts';

interface SceneCardChipsProps {
    scene: Scene;
    isSceneActiveViaTimeSlot: boolean;
    isCurrentlyActive: boolean;
}

export const SceneCardChips = ({
                                   scene,
                                   isSceneActiveViaTimeSlot,
                                   isCurrentlyActive,
                               }: SceneCardChipsProps) => {
    return (
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            {scene.isGlobal ? (
                <Chip
                    label="Globale Scene"
                    size="small"
                    color="primary"
                    variant="outlined"
                />
            ) : (
                <Chip
                    label="Eigen Scene"
                    size="small"
                    color="success"
                    variant="outlined"
                />
            )}

            {isSceneActiveViaTimeSlot && (
                <Chip
                    label="Actief via tijdslot"
                    size="small"
                    color="success"
                />
            )}

            {isCurrentlyActive && (
                <Chip
                    label="Handmatig geactiveerd"
                    size="small"
                    color="warning"
                />
            )}
        </Box>
    );
};