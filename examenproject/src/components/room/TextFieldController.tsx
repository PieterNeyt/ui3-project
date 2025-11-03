import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

interface TextFieldControllerProps<TFieldValues extends FieldValues = FieldValues> {
    name: FieldPath<TFieldValues>;
    control: Control<TFieldValues>;
    label: string;
    type?: string;
    required?: boolean;
    multiline?: boolean;
    rows?: number;
    error?: boolean;
    helperText?: string;
}

export const TextFieldController = <TFieldValues extends FieldValues = FieldValues>({
                                                                                        name,
                                                                                        control,
                                                                                        label,
                                                                                        type = 'text',
                                                                                        required = false,
                                                                                        multiline = false,
                                                                                        rows,
                                                                                        error,
                                                                                        helperText,
                                                                                    }: TextFieldControllerProps<TFieldValues>) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <TextField
                    {...field}
                    label={label}
                    type={type}
                    fullWidth
                    required={required}
                    multiline={multiline}
                    rows={rows}
                    onChange={(e) => {
                        if (type === 'number') {
                            field.onChange(Number(e.target.value));
                        } else {
                            field.onChange(e.target.value);
                        }
                    }}
                    error={error}
                    helperText={helperText}
                />
            )}
        />
    );
};