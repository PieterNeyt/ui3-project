import  { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Box,
    Alert,
    Typography,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parse } from 'date-fns';
import { useScenes } from '../../hooks/useScenes';
import { useCheckOverlap } from '../../hooks/useTimeSlots';
import type { TimeSlot, TimeSlotFormData } from '../../types/timeslot';

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
                                                          }:TimeSlotFormProps) => {
    const { data: scenes = [] } = useScenes();
    const checkOverlapMutation = useCheckOverlap();

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
        const newErrors: Record<string, string> = {};

        if (!formData.sceneId) {
            newErrors.sceneId = 'Scene is verplicht';
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

        setErrors(newErrors);

        // Check for overlaps
        if (formData.sceneId && formData.startTime && formData.endTime && Object.keys(newErrors).length === 0) {
            try {
                const hasOverlap = await checkOverlapMutation.mutateAsync({
                    sceneId: formData.sceneId,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    excludeId: timeslot?.id,
                });

                if (hasOverlap) {
                    setOverlapError('Dit tijdslot overlapt met een bestaand tijdslot voor deze scene');
                    return false;
                }
                setOverlapError('');
            } catch (error) {
                console.error('Error checking overlap:', error);
            }
        }

        return Object.keys(newErrors).length === 0 && !overlapError;
    };

    const handleSubmit = async (): Promise<void> => {
        const isValid = await validateForm();
        if (!isValid) return;

        onSave(formData);
    };

    const handleTimeChange = (field: 'startTime' | 'endTime', date: Date | null) => {
        if (date) {
            const timeString = format(date, 'HH:mm');
            setFormData(prev => ({ ...prev, [field]: timeString }));
        }
    };

    const parseTimeString = (timeString: string): Date => {
        return parse(timeString, 'HH:mm', new Date());
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {timeslot ? 'Tijdslot Bewerken' : 'Nieuw Tijdslot'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        {overlapError && (
                            <Alert severity="error">{overlapError}</Alert>
                        )}

                        <FormControl fullWidth error={!!errors.sceneId}>
                            <InputLabel>Scene *</InputLabel>
                            <Select
                                value={formData.sceneId}
                                label="Scene *"
                                onChange={(e) => setFormData(prev => ({ ...prev, sceneId: e.target.value }))}
                            >
                                <MenuItem value="">
                                    <em>Selecteer een scene</em>
                                </MenuItem>
                                {scenes.map(scene => (
                                    <MenuItem key={scene.id} value={scene.id}>
                                        {scene.naam}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.sceneId && (
                                <Typography variant="caption" color="error">
                                    {errors.sceneId}
                                </Typography>
                            )}
                        </FormControl>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TimePicker
                                label="Starttijd *"
                                value={parseTimeString(formData.startTime)}
                                onChange={(date) => handleTimeChange('startTime', date)}
                                ampm={false} // Dit forceert 24u formaat
                                format="HH:mm" // 24u formaat
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: !!errors.startTime,
                                        helperText: errors.startTime,
                                        placeholder: "00:00",
                                    },
                                }}
                            />

                            <TimePicker
                                label="Eindtijd *"
                                value={parseTimeString(formData.endTime)}
                                onChange={(date) => handleTimeChange('endTime', date)}
                                ampm={false} // Dit forceert 24u formaat
                                format="HH:mm" // 24u formaat
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: !!errors.endTime,
                                        helperText: errors.endTime,
                                        placeholder: "23:59",
                                    },
                                }}
                            />
                        </Box>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                />
                            }
                            label="Actief"
                        />

                        <Alert severity="info">
                            Het tijdslot wordt dagelijks herhaald. Tijdsloten mogen niet overlappen.
                            Gebruik 24-uurs notatie (00:00 - 23:59).
                        </Alert>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Annuleren</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Bezig...' : timeslot ? 'Bijwerken' : 'Aanmaken'}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

// Helper function
const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};