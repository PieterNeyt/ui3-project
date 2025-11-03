import { TextField } from '@mui/material';
import { Controller, type Control } from 'react-hook-form';
import type {FloorFormData} from '../../../types/floor.ts';

interface FloorFormFieldProps {
    name: keyof FloorFormData;
    label: string;
    control: Control<FloorFormData>;
    type?: 'text' | 'number';
    required?: boolean;
}

export function FloorFormField({ name, label, control, type = 'text', required = false }: FloorFormFieldProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    label={label}
                    type={type}
                    fullWidth
                    required={required}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onChange={(e) => {
                        if (type === 'number') {
                            field.onChange(Number(e.target.value));
                        } else {
                            field.onChange(e.target.value);
                        }
                    }}
                />
            )}
        />
    );
}
