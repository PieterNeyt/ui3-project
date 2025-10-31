import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type {Room, RoomFormData} from '../../types/room';
import type {Floor} from '../../types/floor';

const roomSchema = z.object({
    naam: z.string().min(1, 'Naam is verplicht'),
    verdiepingId: z.string().min(1, 'Verdieping is verplicht'),
    width: z.number().min(1, 'Breedte moet groter zijn dan 0'),
    height: z.number().min(1, 'Hoogte moet groter zijn dan 0'),
    x: z.number().min(0, 'X moet 0 of groter zijn'),
    y: z.number().min(0, 'Y moet 0 of groter zijn'),
    omschrijving: z.string().optional(),
});

interface RoomFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: RoomFormData) => void;
    room?: Room | null;
    floors: Floor[];
    isSubmitting: boolean;
}

export const RoomForm = ({
                                                      open,
                                                      onClose,
                                                      onSubmit,
                                                      room,
                                                      floors,
                                                      isSubmitting,
                                                  }:RoomFormProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RoomFormData>({
        resolver: zodResolver(roomSchema),
        defaultValues: room || {
            naam: '',
            verdiepingId: '',
            width: 50,
            height: 50,
            x: 0,
            y: 0,
            omschrijving: '',
        },
    });

    React.useEffect(() => {
        if (room) {
            reset(room);
        } else {
            reset({
                naam: '',
                verdiepingId: '',
                width: 50,
                height: 50,
                x: 0,
                y: 0,
                omschrijving: '',
            });
        }
    }, [room, reset, open]);

    const handleFormSubmit = (data: RoomFormData) => {
        onSubmit(data);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {room ? 'Kamer Bewerken' : 'Nieuwe Kamer'}
            </DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gap: 2
                        }}
                    >
                        <Box>
                            <Controller
                                name="naam"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Naam"
                                        fullWidth
                                        required
                                        error={!!errors.naam}
                                        helperText={errors.naam?.message}
                                    />
                                )}
                            />
                        </Box>

                        <Box>
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
                        </Box>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 2
                            }}
                        >
                            <Box>
                                <Controller
                                    name="width"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Breedte"
                                            type="number"
                                            fullWidth
                                            required
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            error={!!errors.width}
                                            helperText={errors.width?.message}
                                        />
                                    )}
                                />
                            </Box>

                            <Box>
                                <Controller
                                    name="height"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Hoogte"
                                            type="number"
                                            fullWidth
                                            required
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            error={!!errors.height}
                                            helperText={errors.height?.message}
                                        />
                                    )}
                                />
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 2
                            }}
                        >
                            <Box>
                                <Controller
                                    name="x"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="X positie"
                                            type="number"
                                            fullWidth
                                            required
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            error={!!errors.x}
                                            helperText={errors.x?.message}
                                        />
                                    )}
                                />
                            </Box>

                            <Box>
                                <Controller
                                    name="y"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Y positie"
                                            type="number"
                                            fullWidth
                                            required
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            error={!!errors.y}
                                            helperText={errors.y?.message}
                                        />
                                    )}
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Controller
                                name="omschrijving"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Omschrijving"
                                        multiline
                                        rows={3}
                                        fullWidth
                                        error={!!errors.omschrijving}
                                        helperText={errors.omschrijving?.message}
                                    />
                                )}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Annuleren</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Bezig...' : room ? 'Bijwerken' : 'Aanmaken'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};