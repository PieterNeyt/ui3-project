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
import { Add, Edit, Delete, Schedule, Info } from '@mui/icons-material';
import { useTimeSlotsByScene } from '../../hooks/useTimeSlots';
import type { TimeSlot } from '../../types/timeslot';

interface TimeSlotListProps {
    sceneId: string;
    onAddTimeSlot: () => void;
    onEditTimeSlot: (timeslot: TimeSlot) => void;
    onDeleteTimeSlot: (id: string) => void;
    isAdmin: boolean;
    isGlobalScene?: boolean;
}

export const TimeSlotList = ({
                                 sceneId,
                                 onAddTimeSlot,
                                 onEditTimeSlot,
                                 onDeleteTimeSlot,
                                 isAdmin,
                                 isGlobalScene = false,
                             }: TimeSlotListProps) => {
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
                {isAdmin && isGlobalScene && (
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

            {!isGlobalScene ? (
                <Alert severity="info">
                    <Typography variant="body2" gutterBottom>
                        <strong>Tijdsloten zijn alleen beschikbaar voor globale scenes.</strong>
                    </Typography>
                    <Typography variant="body2">
                        Persoonlijke scenes kunnen niet automatisch geactiveerd worden via tijdsloten.
                    </Typography>
                </Alert>
            ) : (
                <>
                    <Alert severity="info" icon={<Info />} sx={{ mb: 2 }}>
                        <Typography variant="body2">
                            <strong>Let op:</strong> Tijdsloten mogen niet overlappen met tijdsloten van andere globale scenes.
                            Slechts één scene kan actief zijn op een bepaald moment.
                        </Typography>
                    </Alert>

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
                                        isAdmin && isGlobalScene ? (
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
                                        primary={
                                            <Typography variant="body1" fontWeight="medium">
                                                {formatTimeRange(timeslot.startTime, timeslot.endTime)}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                <Chip
                                                    label={timeslot.isActive ? 'Actief' : 'Inactief'}
                                                    size="small"
                                                    color={timeslot.isActive ? 'success' : 'default'}
                                                    variant="outlined"
                                                />
                                                <Typography variant="caption" color="text.secondary">
                                                    Dagelijks herhaald
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </>
            )}
        </Box>
    );
};