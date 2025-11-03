import { Box, Typography, Alert } from '@mui/material';
import type { Scene } from '../../types/scene.ts';

interface DeviceControlsSectionProps {
    scene: Scene;
}

export const DeviceControlsSection = ({ scene }: DeviceControlsSectionProps) => {
    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
                Device Instellingen
            </Typography>
            {scene.controls.length === 0 ? (
                <Alert severity="info">
                    Deze scene heeft geen devices geconfigureerd.
                </Alert>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {scene.controls.map((control, index) => (
                        <Box
                            key={index}
                            sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                backgroundColor: 'background.default'
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                {control.device?.naam || `Device ${control.deviceId}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Type: {control.device?.type || 'Onbekend'}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="body2">
                                    <strong>Instellingen:</strong>
                                </Typography>
                                {Object.entries(control.waarde).map(([key, value]) => (
                                    <Typography key={key} variant="body2" color="text.secondary">
                                        • {key}: {String(value)}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};