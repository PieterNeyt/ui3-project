import { Box, Typography } from '@mui/material';
import type { DeviceValue } from '../../../types/logging.ts';

interface ValueDisplayProps {
    value: DeviceValue | undefined;
}

export const ValueDisplay = ({ value }: ValueDisplayProps) => {
    if (!value) {
        return <Typography variant="body2">-</Typography>;
    }

    if (typeof value !== 'object') {
        return <Typography variant="body2">{String(value)}</Typography>;
    }

    return (
        <Box sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
            {Object.entries(value).map(([key, val]) => (
                <Box key={key}>
                    {key}: {String(val)}
                </Box>
            ))}
        </Box>
    );
};