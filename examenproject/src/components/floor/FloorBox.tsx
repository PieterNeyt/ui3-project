import { Box } from '@mui/material';
import type {Floor} from '../../types/floor';

interface FloorBoxProps {
    floor: Floor;
    scale?: number;
}

export function FloorBox({ floor, scale = 0.5 }: FloorBoxProps) {
    return (
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
    );
}
