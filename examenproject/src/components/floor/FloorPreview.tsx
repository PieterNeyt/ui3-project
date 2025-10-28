import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router';
import type {Floor} from '../../types/floor';

interface FloorPreviewProps {
    floor: Floor;
    scale?: number;
    onClick?: (floor: Floor) => void;
    showClickable?: boolean;
}

export const FloorPreview: React.FC<FloorPreviewProps> = ({
                                                              floor,
                                                              scale = 0.5,
                                                              onClick,
                                                              showClickable = true,
                                                          }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (showClickable) {
            navigate(`/floors/${floor.id}/rooms`);
        }
        onClick?.(floor);
    };

    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                cursor: showClickable ? 'pointer' : 'default',
                '&:hover': showClickable ? { bgcolor: 'action.hover' } : {},
            }}
            onClick={handleClick}
        >
            <Typography variant="h6" gutterBottom>
                {floor.naam}
            </Typography>

            {floor.omschrijving && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {floor.omschrijving}
                </Typography>
            )}

            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: 200,
                    border: '2px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.default',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        left: floor.x * scale,
                        top: floor.y * scale,
                        width: floor.width * scale,
                        height: floor.height * scale,
                        bgcolor: 'primary.main',
                        opacity: 0.7,
                        border: '1px solid',
                        borderColor: 'primary.dark',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.8rem',
                    }}
                >
                    {floor.width} x {floor.height}
                </Box>
            </Box>

            <Typography variant="body2" sx={{ mt: 1 }}>
                Positie: ({floor.x}, {floor.y}) | Afmeting: {floor.width} × {floor.height}
            </Typography>

            {showClickable && (
                <Typography variant="body2" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>
                    Klik om kamers te beheren →
                </Typography>
            )}
        </Paper>
    );
};