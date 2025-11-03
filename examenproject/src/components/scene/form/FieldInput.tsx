import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Box,
    Typography,
    Slider,
    TextField,
} from '@mui/material';
import type { SceneControl } from '../../../types/scene.ts';

interface DeviceField {
    name: string;
    type: 'select' | 'number' | 'boolean' | 'text';
    options?: string[];
    min?: number;
    max?: number;
}

interface FieldInputProps {
    field: DeviceField;
    control: SceneControl;
    index: number;
    deviceType: string;
    onValueChange: (index: number, deviceType: string, field: string, value: string | number | boolean) => void;
}

export const FieldInput = ({
                               field,
                               control,
                               index,
                               deviceType,
                               onValueChange,
                           }: FieldInputProps) => {
    const value = (control.waarde as Record<string, string | number | boolean>)[field.name] || '';

    const handleFieldChange = (newValue: string | number | boolean) => {
        onValueChange(index, deviceType, field.name, newValue);
    };

    switch (field.type) {
        case 'select':
            return (
                <FormControl fullWidth>
                    <InputLabel>{field.name}</InputLabel>
                    <Select
                        value={value}
                        label={field.name}
                        onChange={(e) => handleFieldChange(e.target.value)}
                    >
                        {field.options?.map(option => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );

        case 'boolean':
            return (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={Boolean(value)}
                            onChange={(e) => handleFieldChange(e.target.checked)}
                        />
                    }
                    label={field.name}
                />
            );

        case 'number':
            return (
                <Box>
                    <Typography gutterBottom>
                        {field.name}: {value}
                    </Typography>
                    <Slider
                        value={typeof value === 'number' ? value : field.min ?? 0}
                        onChange={(_, newValue) => handleFieldChange(newValue as number)}
                        min={field.min}
                        max={field.max}
                        step={1}
                        valueLabelDisplay="auto"
                        marks
                    />
                </Box>
            );

        case 'text':
            return (
                <TextField
                    type="text"
                    label={field.name}
                    value={value}
                    onChange={(e) => handleFieldChange(e.target.value)}
                    fullWidth
                />
            );

        default:
            return null;
    }
};