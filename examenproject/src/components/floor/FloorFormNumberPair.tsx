import { Box } from '@mui/material';
import type {Control} from 'react-hook-form';
import type {FloorFormData} from '../../types/floor';
import { FloorFormField } from './FloorFormField';

interface NumberPairProps {
    control: Control<FloorFormData>;
    first: { name: keyof FloorFormData; label: string };
    second: { name: keyof FloorFormData; label: string };
}

export function FloorFormNumberPair({ control, first, second }: NumberPairProps) {
    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
                <FloorFormField name={first.name} label={first.label} control={control} type="number" required />
            </Box>
            <Box sx={{ flex: 1 }}>
                <FloorFormField name={second.name} label={second.label} control={control} type="number" required />
            </Box>
        </Box>
    );
}
