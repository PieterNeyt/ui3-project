import { Dialog, DialogTitle, DialogContent, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type {Floor, FloorFormData} from '../../types/floor';
import { FloorFormField } from './FloorFormField';
import { FloorFormNumberPair } from './FloorFormNumberPair';
import { FloorFormActions } from './FloorFormActions';
import React from "react";

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

export function FloorForm({ open, onClose, onSubmit, floor, isSubmitting }: FloorFormProps) {
    const { control, handleSubmit, reset } = useForm<FloorFormData>({
        resolver: zodResolver(floorSchema),
        defaultValues: floor || { naam: '', width: 100, height: 100, x: 0, y: 0, omschrijving: '' },
    });

    React.useEffect(() => {
        reset(floor || { naam: '', width: 100, height: 100, x: 0, y: 0, omschrijving: '' });
    }, [floor, reset, open]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{floor ? 'Verdieping Bewerken' : 'Nieuwe Verdieping'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FloorFormField name="naam" label="Naam" control={control} required />
                        <FloorFormNumberPair
                            control={control}
                            first={{ name: 'width', label: 'Breedte' }}
                            second={{ name: 'height', label: 'Hoogte' }}
                        />
                        <FloorFormNumberPair
                            control={control}
                            first={{ name: 'x', label: 'X positie' }}
                            second={{ name: 'y', label: 'Y positie' }}
                        />
                        <FloorFormField name="omschrijving" label="Omschrijving" control={control} />
                    </Box>
                </DialogContent>
                <FloorFormActions onClose={onClose} isSubmitting={isSubmitting} floor={floor} />
            </form>
        </Dialog>
    );
}
