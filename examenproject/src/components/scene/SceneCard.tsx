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
    Tooltip,
} from '@mui/material';
import { MoreVert,  Edit, Delete, Info, PowerSettingsNew, Stop } from '@mui/icons-material';
import type { Scene } from '../../types/scene';
import { useActiveTimeSlot } from "../../hooks/useTimeSlots.ts";
import { useNavigate } from "react-router";
import { useAuth } from '../../context/useAuth';

interface SceneCardProps {
    scene: Scene;
    onActivate: (sceneId: string) => void;
    onDeactivate?: () => void;
    onEdit: (scene: Scene) => void;
    onDelete: (sceneId: string) => void;
    isAdmin: boolean;
    isCurrentlyActive?: boolean;
}

export const SceneCard: React.FC<SceneCardProps> = ({
                                                        scene,
                                                        onActivate,
                                                        onDeactivate,
                                                        onEdit,
                                                        onDelete,
                                                        isAdmin,
                                                        isCurrentlyActive = false,
                                                    }) => {
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
    const { data: activeTimeSlot } = useActiveTimeSlot();
    const isSceneActiveViaTimeSlot = activeTimeSlot?.sceneId === scene.id;
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const isOwner = !scene.isGlobal && scene.createdBy === user?.id;

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

    const handleActivateClick = () => {
        onActivate(scene.id);
    };

    const handleDeactivateClick = () => {
        if (onDeactivate) {
            onDeactivate();
        }
    };

    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: scene.isGlobal ? '2px solid #1976d2' : '2px solid #4caf50',
            position: 'relative',
            ...(isCurrentlyActive && {
                border: '3px solid #ff9800',
                boxShadow: '0 4px 20px rgba(255, 152, 0, 0.3)'
            })
        }}>
            {/* Actieve scene indicator */}
            {isCurrentlyActive && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: '#ff9800',
                        color: 'white',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        zIndex: 1
                    }}
                >
                    ⚡
                </Box>
            )}

            {/* Scene Image of Initials */}
            {scene.image ? (
                <CardMedia
                    component="img"
                    height="140"
                    image={scene.image}
                    alt={scene.naam}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/scenes/${scene.id}`)}
                />
            ) : (
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
            )}

            <CardContent sx={{ flexGrow: 1 }}>
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
                        <IconButton size="small" onClick={handleMenuOpen}>
                            <MoreVert />
                        </IconButton>
                    )}
                </Box>

                {/* Scene Type Chips */}
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
                {isCurrentlyActive ? (
                    <Tooltip title="Scene deactiveren (terug naar tijdslot)">
                        <Button
                            variant="contained"
                            color="warning"
                            startIcon={<Stop />}
                            onClick={handleDeactivateClick}
                            fullWidth
                        >
                            Deactiveren
                        </Button>
                    </Tooltip>
                ) : (
                    <Tooltip title="Scene direct activeren">
                        <Button
                            variant="contained"
                            startIcon={<PowerSettingsNew />}
                            onClick={handleActivateClick}
                            fullWidth
                            disabled={isSceneActiveViaTimeSlot && !isCurrentlyActive}
                        >
                            {isSceneActiveViaTimeSlot ? 'Actief via tijdslot' : 'Activeren'}
                        </Button>
                    </Tooltip>
                )}

                {/* Toon alleen details knop voor globale scenes of admin */}
                {(isAdmin || scene.isGlobal) && (
                    <Button
                        variant="outlined"
                        startIcon={<Info />}
                        onClick={() => navigate(`/scenes/${scene.id}`)}
                        fullWidth
                    >
                        Details
                    </Button>
                )}
            </Box>

            {/* Edit/Delete Menu */}
            {(isAdmin || isOwner) && (
                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => { onEdit(scene); handleMenuClose(); }}>
                        <Edit sx={{ mr: 1 }} /> Bewerken
                    </MenuItem>
                    <MenuItem onClick={() => { onDelete(scene.id); handleMenuClose(); }}>
                        <Delete sx={{ mr: 1 }} /> Verwijderen
                    </MenuItem>
                </Menu>
            )}
        </Card>
    );
};