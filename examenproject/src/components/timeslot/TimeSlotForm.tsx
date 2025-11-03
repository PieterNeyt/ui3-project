import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useScenes } from '../../hooks/useScenes';
import { useCheckOverlap } from '../../hooks/useTimeSlots';
import type { TimeSlot, TimeSlotFormData } from '../../types/timeslot';
import { TimeSlotFormFields } from './TimeSlotFormFields';
import { TimeSlotFormActions } from './TimeSlotFormActions';
import type {Scene} from "../../types/scene.ts";

interface TimeSlotFormProps {
    open: boolean;
    timeslot?: TimeSlot | null;
    onSave: (timeslotData: TimeSlotFormData) => void;
    onClose: () => void;
    isSubmitting?: boolean;
}

export const TimeSlotForm = ({
                                 open,
                                 timeslot,
                                 onSave,
                                 onClose,
                                 isSubmitting = false,
                             }: TimeSlotFormProps) => {
    const { data: scenes = [] } = useScenes();
    const checkOverlapMutation = useCheckOverlap();

    // Filter alleen globale scenes
    const globalScenes = scenes.filter(scene => scene.isGlobal);

    const [formData, setFormData] = useState<TimeSlotFormData>({
        sceneId: '',
        startTime: '07:00',
        endTime: '10:00',
        isActive: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [overlapError, setOverlapError] = useState<string>('');

    useEffect(() => {
        if (timeslot) {
            setFormData({
                sceneId: timeslot.sceneId,
                startTime: timeslot.startTime,
                endTime: timeslot.endTime,
                isActive: timeslot.isActive,
            });
        } else {
            setFormData({
                sceneId: '',
                startTime: '07:00',
                endTime: '10:00',
                isActive: true,
            });
        }
        setErrors({});
        setOverlapError('');
    }, [timeslot, open]);

    const validateForm = async (): Promise<boolean> => {
        const newErrors = validateFormData(formData, globalScenes);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            return await checkForOverlaps();
        }

        return false;
    };

    const checkForOverlaps = async (): Promise<boolean> => {
        if (formData.sceneId && formData.startTime && formData.endTime) {
            try {
                // BELANGRIJKE WIJZIGING: Check overlap GLOBAAL (niet meer per scene)
                const hasOverlap = await checkOverlapMutation.mutateAsync({
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    excludeId: timeslot?.id,
                    sceneId: formData.sceneId
                });

                if (hasOverlap) {
                    setOverlapError('Dit tijdslot overlapt met een bestaand tijdslot. Tijdsloten mogen niet overlappen over alle scenes heen.');
                    return false;
                }
                setOverlapError('');
                return true;
            } catch (error) {
                console.error('Error checking overlap:', error);
            }
        }
        return false;
    };

    const handleSubmit = async (): Promise<void> => {
        const isValid = await validateForm();
        if (!isValid) return;

        onSave(formData);
    };

    const handleFormDataChange = (updates: Partial<TimeSlotFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {timeslot ? 'Tijdslot Bewerken' : 'Nieuw Tijdslot'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TimeSlotFormFields
                            formData={formData}
                            errors={errors}
                            overlapError={overlapError}
                            scenes={globalScenes}
                            onFormDataChange={handleFormDataChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <TimeSlotFormActions
                        onClose={onClose}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        timeslot={timeslot}
                    />
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

// Validation helper functions
const validateFormData = (
    formData: TimeSlotFormData,
    globalScenes: Scene[]
): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formData.sceneId) {
        newErrors.sceneId = 'Scene is verplicht';
    } else {
        // Controleer of de geselecteerde scene globaal is
        const selectedScene = globalScenes.find(s => s.id === formData.sceneId);
        if (!selectedScene) {
            newErrors.sceneId = 'Alleen globale scenes kunnen aan tijdsloten worden gekoppeld';
        }
    }

    if (!formData.startTime) {
        newErrors.startTime = 'Starttijd is verplicht';
    }

    if (!formData.endTime) {
        newErrors.endTime = 'Eindtijd is verplicht';
    }

    if (formData.startTime && formData.endTime) {
        const startMinutes = timeToMinutes(formData.startTime);
        const endMinutes = timeToMinutes(formData.endTime);

        if (startMinutes === endMinutes) {
            newErrors.endTime = 'Start- en eindtijd mogen niet gelijk zijn';
        }
    }

    return newErrors;
};

const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};