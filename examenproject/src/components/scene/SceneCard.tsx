import React from 'react';
import {
    Card,
    CardContent,
    Box,
    Button,
    Menu,
    MenuItem,
    Tooltip,
} from '@mui/material';
import { Delete,Edit, Info, PowerSettingsNew, Stop } from '@mui/icons-material';
import type { Scene } from '../../types/scene';
import { useActiveTimeSlot } from "../../hooks/useTimeSlots.ts";
import { useNavigate } from "react-router";
import { useAuth } from '../../hooks/useAuth.ts';
import { SceneCardHeader } from './card/SceneCardHeader.tsx';
import { SceneCardImage } from './card/SceneCardImage.tsx';
import { SceneCardChips } from './card/SceneCardChips.tsx';
import { SceneCardControls } from './card/SceneCardControls.tsx';

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
                                                    }: SceneCardProps) => {
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

            <SceneCardImage scene={scene} navigate={navigate} />

            <CardContent sx={{ flexGrow: 1 }}>
                <SceneCardHeader
                    scene={scene}
                    navigate={navigate}
                    isAdmin={isAdmin}
                    isOwner={isOwner}
                    onMenuOpen={handleMenuOpen}
                />

                <SceneCardChips
                    scene={scene}
                    isSceneActiveViaTimeSlot={isSceneActiveViaTimeSlot}
                    isCurrentlyActive={isCurrentlyActive}
                />

                <SceneCardControls scene={scene} />
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