import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,

} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Room, RoomFormData } from '../../types/room';
import type { Floor } from '../../types/floor';
import { roomSchema } from '../../validation/RoomFormSchema.ts';
import { RoomFormFields } from './RoomFormFields';

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
                         }: RoomFormProps) => {
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
                    <RoomFormFields
                        control={control}
                        errors={errors}
                        floors={floors}
                    />
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