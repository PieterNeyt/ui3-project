import { Alert, Typography } from '@mui/material';
import type { Scene } from '../../../types/scene.ts';

interface SceneInfoAlertsProps {
    isAdmin: boolean;
    scene?: Scene | null;
}

export const SceneInfoAlerts = ({ isAdmin, scene }: SceneInfoAlertsProps) => {
    if (!isAdmin) {
        return (
            <Alert severity="info">
                <Typography variant="body2">
                    <strong>Je maakt een persoonlijke scene aan.</strong>
                    <br />
                    Deze scene is alleen zichtbaar voor jou en kan niet gekoppeld worden aan tijdsloten.
                </Typography>
            </Alert>
        );
    }

    if (isAdmin && scene && scene.isGlobal) {
        return (
            <Alert severity="warning">
                <Typography variant="body2">
                    <strong>Dit is een globale scene.</strong>
                    <br />
                    Wijzigingen zijn zichtbaar voor alle gebruikers.
                </Typography>
            </Alert>
        );
    }

    if (isAdmin && !scene) {
        return (
            <Alert severity="info">
                <Typography variant="body2">
                    Als admin kun je kiezen tussen een <strong>globale scene</strong> (zichtbaar voor alle gebruikers)
                    of een <strong>persoonlijke scene</strong> (alleen zichtbaar voor jou).
                </Typography>
            </Alert>
        );
    }

    return null;
};