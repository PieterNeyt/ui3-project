import { CardMedia, Box } from '@mui/material';
import type { Scene } from '../../../types/scene.ts';

interface SceneCardImageProps {
    scene: Scene;
    navigate: (path: string) => void;
}

export const SceneCardImage = ({ scene, navigate }: SceneCardImageProps) => {
    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (scene.image) {
        return (
            <CardMedia
                component="img"
                height="140"
                image={scene.image}
                alt={scene.naam}
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/scenes/${scene.id}`)}
            />
        );
    }

    return (
        <Box
            sx={{
                height: 140,
                bgcolor: scene.isGlobal ? 'primary.main' : 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 48,
                fontWeight: 'bold',
                cursor: 'pointer'
            }}
            onClick={() => navigate(`/scenes/${scene.id}`)}
        >
            {getInitials(scene.naam)}
        </Box>
    );
};