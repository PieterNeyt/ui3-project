import { Box, Typography } from '@mui/material';
import type { Scene } from '../../../types/scene.ts';

interface SceneCardControlsProps {
    scene: Scene;
}

export const SceneCardControls = ({ scene }: SceneCardControlsProps) => {
    const getDeviceSummary = (): string => {
        const deviceTypes = scene.controls.map(control =>
            control.device?.type || 'device'
        );
        const uniqueTypes = [...new Set(deviceTypes)];
        return `${scene.controls.length} devices (${uniqueTypes.join(', ')})`;
    };

    const formatControlValue = (control: Scene['controls'][0]): string => {
        const values = Object.entries(control.waarde)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        return values;
    };

    return (
        <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {getDeviceSummary()}
            </Typography>

            {scene.omschrijving && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {scene.omschrijving}
                </Typography>
            )}

            {/* Control Preview */}
            <Box sx={{ mt: 'auto' }}>
                {scene.controls.slice(0, 3).map((control, index) => (
                    <Typography key={index} variant="caption" display="block" color="text.secondary">
                        • {control.device?.naam || `Device ${control.deviceId}`}: {formatControlValue(control)}
                    </Typography>
                ))}
                {scene.controls.length > 3 && (
                    <Typography variant="caption" color="text.secondary">
                        ... en {scene.controls.length - 3} meer
                    </Typography>
                )}
            </Box>
        </>
    );
};