import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Alert,
    Typography,
    Box,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { format, parse } from 'date-fns';
import type { TimeSlotFormData } from '../../types/timeslot';
import type { Scene } from '../../types/scene';

interface TimeSlotFormFieldsProps {
    formData: TimeSlotFormData;
    errors: Record<string, string>;
    overlapError: string;
    scenes: Scene[];
    onFormDataChange: (updates: Partial<TimeSlotFormData>) => void;
}

export const TimeSlotFormFields = ({
                                       formData,
                                       errors,
                                       overlapError,
                                       scenes,
                                       onFormDataChange,
                                   }: TimeSlotFormFieldsProps) => {
    const handleTimeChange = (field: 'startTime' | 'endTime', date: Date | null) => {
        if (date) {
            const timeString = format(date, 'HH:mm');
            onFormDataChange({ [field]: timeString });
        }
    };

    const parseTimeString = (timeString: string): Date => {
        return parse(timeString, 'HH:mm', new Date());
    };

    return (
        <>
            {overlapError && (
                <Alert severity="error">{overlapError}</Alert>
            )}

            <FormControl fullWidth error={!!errors.sceneId}>
                <InputLabel>Scene *</InputLabel>
                <Select
                    value={formData.sceneId}
                    label="Scene *"
                    onChange={(e) => onFormDataChange({ sceneId: e.target.value })}
                >
                    <MenuItem value="">
                        <em>Selecteer een globale scene</em>
                    </MenuItem>
                    {scenes.length === 0 ? (
                        <MenuItem disabled>
                            <em>Geen globale scenes beschikbaar</em>
                        </MenuItem>
                    ) : (
                        scenes.map(scene => (
                            <MenuItem key={scene.id} value={scene.id}>
                                {scene.naam}
                            </MenuItem>
                        ))
                    )}
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
                    ampm={false}
                    format="HH:mm"
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
                    ampm={false}
                    format="HH:mm"
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
                        onChange={(e) => onFormDataChange({ isActive: e.target.checked })}
                    />
                }
                label="Actief"
            />

            <Alert severity="info">
                <Typography variant="body2" gutterBottom>
                    <strong>Belangrijk:</strong>
                </Typography>
                <Typography variant="body2" component="div">
                    • Tijdsloten worden dagelijks herhaald (24-uurs cyclus)
                    <br />
                    • Tijdsloten mogen <strong>niet overlappen</strong> met andere tijdsloten van andere scenes
                    <br />
                    • Alleen globale scenes kunnen worden gekoppeld aan tijdsloten
                    <br />
                    • Gebruik 24-uurs notatie (00:00 - 23:59)
                    <br />
                    • Buiten tijdsloten vallen devices terug op hun standaardwaarde
                </Typography>
            </Alert>
        </>
    );
};