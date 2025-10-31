import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type {Floor, FloorFormData} from '../../types/floor';

const floorSchema = z.object({
    naam: z.string().min(1, 'Naam is verplicht'),
    width: z.number().min(1, 'Breedte moet groter zijn dan 0'),
    height: z.number().min(1, 'Hoogte moet groter zijn dan 0'),
    x: z.number().min(0, 'X moet 0 of groter zijn'),
    y: z.number().min(0, 'Y moet 0 of groter zijn'),
    omschrijving: z.string().optional(),
});

interface FloorFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: FloorFormData) => void;
    floor?: Floor | null;
    isSubmitting: boolean;
}

export const FloorForm = ({
                                                        open,
                                                        onClose,
                                                        onSubmit,
                                                        floor,
                                                        isSubmitting,
                                                    }:FloorFormProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FloorFormData>({
        resolver: zodResolver(floorSchema),
        defaultValues: floor || {
            naam: '',
            width: 100,
            height: 100,
            x: 0,
            y: 0,
            omschrijving: '',
        },
    });

    React.useEffect(() => {
        if (floor) {
            reset(floor);
        } else {
            reset({
                naam: '',
                width: 100,
                height: 100,
                x: 0,
                y: 0,
                omschrijving: '',
            });
        }
    }, [floor, reset, open]);

    const handleFormSubmit = (data: FloorFormData) => {
        onSubmit(data);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {floor ? 'Verdieping Bewerken' : 'Nieuwe Verdieping'}
            </DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
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
                            <Box sx={{ flex: 1 }}>
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

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
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
                            <Box sx={{ flex: 1 }}>
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
                        {isSubmitting ? 'Bezig...' : floor ? 'Bijwerken' : 'Aanmaken'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};