import { Box, Typography } from '@mui/material';
import type {Floor} from '../../types/floor';

interface FloorInfoProps {
    floor: Floor;
    showClickable?: boolean;
}

export function FloorInfo({ floor, showClickable = true }: FloorInfoProps) {
    return (
        <Box sx={{ mt: 1 }}>
            <Typography variant="body2">
                Positie: ({floor.x}, {floor.y}) | Afmeting: {floor.width} × {floor.height}
            </Typography>
            {showClickable && (
                <Typography variant="body2" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>
                    Klik om kamers te beheren →
                </Typography>
            )}
        </Box>
    );
}
