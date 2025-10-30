import React from 'react';
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Chip,
    Alert,
    Stack,
} from '@mui/material';
import { Add, Edit, Delete, Schedule } from '@mui/icons-material';
import { useTimeSlotsByScene } from '../../hooks/useTimeSlots';
import type { TimeSlot } from '../../types/timeslot';

interface TimeSlotListProps {
    sceneId: string;
    onAddTimeSlot: () => void;
    onEditTimeSlot: (timeslot: TimeSlot) => void;
    onDeleteTimeSlot: (id: string) => void;
    isAdmin: boolean;
}

export const TimeSlotList: React.FC<TimeSlotListProps> = ({
                                                              sceneId,
                                                              onAddTimeSlot,
                                                              onEditTimeSlot,
                                                              onDeleteTimeSlot,
                                                              isAdmin,
                                                          }) => {
    const { data: timeslots = [], isLoading, error } = useTimeSlotsByScene(sceneId);

    const formatTimeRange = (startTime: string, endTime: string): string => {
        return `${startTime} - ${endTime}`;
    };

    if (isLoading) {
        return <Typography>Laden...</Typography>;
    }

    if (error) {
        return <Alert severity="error">Fout bij laden van tijdsloten</Alert>;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule /> Tijdsloten
                </Typography>
                {isAdmin && (
                    <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={onAddTimeSlot}
                        size="small"
                    >
                        Tijdslot Toevoegen
                    </Button>
                )}
            </Box>

            {timeslots.length === 0 ? (
                <Alert severity="info">
                    Geen tijdsloten gevonden. Voeg een tijdslot toe om deze scene automatisch te activeren.
                </Alert>
            ) : (
                <List>
                    {timeslots.map((timeslot) => (
                        <ListItem
                            key={timeslot.id}
                            divider
                            secondaryAction={
                                isAdmin ? (
                                    <Stack direction="row" spacing={1}>
                                        <IconButton
                                            onClick={() => onEditTimeSlot(timeslot)}
                                            size="small"
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => onDeleteTimeSlot(timeslot.id)}
                                            size="small"
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Stack>
                                ) : undefined
                            }
                        >
                            <ListItemText
                                primary={formatTimeRange(timeslot.startTime, timeslot.endTime)}
                                secondary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <Chip
                                            label={timeslot.isActive ? 'Actief' : 'Inactief'}
                                            size="small"
                                            color={timeslot.isActive ? 'success' : 'default'}
                                            variant="outlined"
                                        />
                                    </Box>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};