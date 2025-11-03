import { Breadcrumbs, Typography, Link } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import type { Scene } from '../../types/scene.ts';

interface SceneBreadcrumbsProps {
    scene: Scene;
    navigate: (path: string) => void;
}

export const SceneBreadcrumbs = ({ scene, navigate }: SceneBreadcrumbsProps) => {
    return (
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
            <Link
                component="button"
                variant="body1"
                onClick={() => navigate('/scenes')}
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
                Scenes
            </Link>
            <Typography color="text.primary">{scene.naam}</Typography>
        </Breadcrumbs>
    );
};