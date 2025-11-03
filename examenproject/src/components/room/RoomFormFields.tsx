import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import type { RoomFormData } from '../../types/room';
import type { Floor } from '../../types/floor';
import { TextFieldController } from './TextFieldController';

interface RoomFormFieldsProps {
    control: Control<RoomFormData>;
    errors: FieldErrors<RoomFormData>;
    floors: Floor[];
}

export const RoomFormFields = ({
                                   control,
                                   errors,
                                   floors,
                               }: RoomFormFieldsProps) => {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
            <TextFieldController
                name="naam"
                control={control}
                label="Naam"
                required
                error={!!errors.naam}
                helperText={errors.naam?.message}
            />

            <FormControl fullWidth error={!!errors.verdiepingId}>
                <InputLabel>Verdieping *</InputLabel>
                <Controller
                    name="verdiepingId"
                    control={control}
                    render={({ field }) => (
                        <Select {...field} label="Verdieping *" required>
                            {floors.map((floor) => (
                                <MenuItem key={floor.id} value={floor.id}>
                                    {floor.naam}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
                {errors.verdiepingId && (
                    <div style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '3px' }}>
                        {errors.verdiepingId.message}
                    </div>
                )}
            </FormControl>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2
            }}>
                <TextFieldController
                    name="width"
                    control={control}
                    label="Breedte"
                    type="number"
                    required
                    error={!!errors.width}
                    helperText={errors.width?.message}
                />

                <TextFieldController
                    name="height"
                    control={control}
                    label="Hoogte"
                    type="number"
                    required
                    error={!!errors.height}
                    helperText={errors.height?.message}
                />
            </Box>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2
            }}>
                <TextFieldController
                    name="x"
                    control={control}
                    label="X positie"
                    type="number"
                    required
                    error={!!errors.x}
                    helperText={errors.x?.message}
                />

                <TextFieldController
                    name="y"
                    control={control}
                    label="Y positie"
                    type="number"
                    required
                    error={!!errors.y}
                    helperText={errors.y?.message}
                />
            </Box>

            <TextFieldController
                name="omschrijving"
                control={control}
                label="Omschrijving"
                multiline
                rows={3}
                error={!!errors.omschrijving}
                helperText={errors.omschrijving?.message}
            />
        </Box>
    );
};