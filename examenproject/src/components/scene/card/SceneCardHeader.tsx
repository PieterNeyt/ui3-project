import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import type { Scene } from '../../../types/scene.ts';

interface SceneCardHeaderProps {
    scene: Scene;
    navigate: (path: string) => void;
    isAdmin: boolean;
    isOwner: boolean;
    onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

export const SceneCardHeader = ({
                                    scene,
                                    navigate,
                                    isAdmin,
                                    isOwner,
                                    onMenuOpen,
                                }: SceneCardHeaderProps) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography
                variant="h6"
                component="h2"
                noWrap
                sx={{
                    cursor: 'pointer',
                    '&:hover': { color: 'primary.main' }
                }}
                onClick={() => navigate(`/scenes/${scene.id}`)}
            >
                {scene.naam}
            </Typography>

            {(isAdmin || isOwner) && (
                <IconButton size="small" onClick={onMenuOpen}>
                    <MoreVert />
                </IconButton>
            )}
        </Box>
    );
};