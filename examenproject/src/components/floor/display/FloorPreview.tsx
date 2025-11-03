import { Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import type {Floor} from '../../../types/floor.ts';
import { FloorBox } from './FloorBox.tsx';
import { FloorInfo } from './FloorInfo.tsx';

interface FloorPreviewProps {
    floor: Floor;
    scale?: number;
    onClick?: (floor: Floor) => void;
    showClickable?: boolean;
}

export function FloorPreview({ floor, scale = 0.5, onClick, showClickable = true }: FloorPreviewProps) {
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

            <FloorBox floor={floor} scale={scale} />
            <FloorInfo floor={floor} showClickable={showClickable} />
        </Paper>
    );
}
