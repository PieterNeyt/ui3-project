import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
    Chip,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import { MoreVert, PlayArrow, Edit, Delete } from '@mui/icons-material';
import type { Scene } from '../../types/scene';

interface SceneCardProps {
    scene: Scene;
    onActivate: (sceneId: string) => void;
    onEdit: (scene: Scene) => void;
    onDelete: (sceneId: string) => void;
    isAdmin: boolean;
}

export const SceneCard: React.FC<SceneCardProps> = ({
                                                        scene,
                                                        onActivate,
                                                        onEdit,
                                                        onDelete,
                                                        isAdmin,
                                                    }) => {
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

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
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Scene Image of Initials */}
            {scene.image ? (
                <CardMedia
                    component="img"
                    height="140"
                    image={scene.image}
                    alt={scene.naam}
                />
            ) : (
                <Box
                    sx={{
                        height: 140,
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 48,
                        fontWeight: 'bold',
                    }}
                >
                    {getInitials(scene.naam)}
                </Box>
            )}

            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2" noWrap>
                        {scene.naam}
                    </Typography>

                    {isAdmin && (
                        <IconButton size="small" onClick={handleMenuOpen}>
                            <MoreVert />
                        </IconButton>
                    )}
                </Box>

                {scene.isGlobal && (
                    <Chip
                        label="Global"
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 1 }}
                    />
                )}

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
            </CardContent>

            <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={() => onActivate(scene.id)}
                    fullWidth
                >
                    Activate
                </Button>
            </Box>

            {/* Admin Menu */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => { onEdit(scene); handleMenuClose(); }}>
                    <Edit sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem onClick={() => { onDelete(scene.id); handleMenuClose(); }}>
                    <Delete sx={{ mr: 1 }} /> Delete
                </MenuItem>
            </Menu>
        </Card>
    );
};