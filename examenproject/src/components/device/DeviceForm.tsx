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
    FormControlLabel,
    Switch,
    Slider,
    Typography,
    Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {type DeviceFormData, type DeviceType, type Device} from '../../types/device';
import type { Room } from '../../types/room';

// validatie handmatig
const deviceSchema = z.object({
    naam: z.string().min(1, 'Naam is verplicht'),
    type: z.enum(['licht', 'verwarming', 'deurslot', 'audio']),
    upcCode: z.string().length(13, 'UPC code moet 13 cijfers zijn').regex(/^\d+$/, 'UPC code mag alleen cijfers bevatten'),
    kamerId: z.string().min(1, 'Kamer is verplicht'),
    x: z.number().min(0, 'X moet 0 of groter zijn'),
    y: z.number().min(0, 'Y moet 0 of groter zijn'),
    omschrijving: z.string().optional(),
    defaultWaarde: z.any(),
});

type FormData = z.infer<typeof deviceSchema>;

interface DeviceFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: DeviceFormData) => void;
    rooms: Room[];
    isSubmitting: boolean;
    initialX?: number;
    initialY?: number;
    initialKamerId?: string;
    device?: Device | null;
    existingDevices?: Device[];
}

export const DeviceForm: React.FC<DeviceFormProps> = ({
                                                          open,
                                                          onClose,
                                                          onSubmit,
                                                          rooms,
                                                          isSubmitting,
                                                          initialX = 0,
                                                          initialY = 0,
                                                          initialKamerId = '',
                                                          device,
                                                          existingDevices = [],
                                                      }) => {
    const [deviceType, setDeviceType] = React.useState<DeviceType>(device?.type || 'licht');
    const [selectedRoom, setSelectedRoom] = React.useState<string>(initialKamerId);
    const [formErrors, setFormErrors] = React.useState<{deurslot?: string}>({});

    // Check for existing devices of limited types
    const checkExistingDevice = (type: DeviceType, roomId: string): boolean => {
        return existingDevices.some(dev =>
            dev.type === type &&
            dev.kamerId === roomId &&
            (!device || dev.id !== device.id)
        );
    };

    // Validatie functie voor deurslot posities
    const validateDoorLockPosition = (x: number, y: number, room: Room | undefined): string | null => {
        if (!room) return null;

        const isOnWall = x === 0 || x === room.width || y === 0 || y === room.height;
        if (!isOnWall) {
            return 'Deursloten moeten op de muren geplaatst worden (x=0, x=kamerbreedte, y=0, of y=kamerhoogte)';
        }
        return null;
    };

    // Helper functie om default waarden te krijgen op basis van device type
    const getDefaultValues = (): FormData => {
        if (device) {
            return {
                naam: device.naam,
                type: device.type,
                upcCode: device.upcCode,
                kamerId: device.kamerId,
                x: device.x,
                y: device.y,
                omschrijving: device.omschrijving || '',
                defaultWaarde: device.defaultWaarde,
            };
        }

        const baseValues = {
            naam: '',
            type: deviceType,
            upcCode: '',
            kamerId: selectedRoom || initialKamerId,
            x: initialX,
            y: initialY,
            omschrijving: '',
        };

        switch (deviceType) {
            case 'licht':
                return {
                    ...baseValues,
                    defaultWaarde: {
                        on_off: 'off',
                        brightness: 100,
                    },
                };
            case 'verwarming':
                return {
                    ...baseValues,
                    defaultWaarde: {
                        temperature: 16,
                    },
                };
            case 'deurslot':
                return {
                    ...baseValues,
                    defaultWaarde: {
                        locked: false,
                    },
                };
            case 'audio':
                return {
                    ...baseValues,
                    defaultWaarde: {
                        volume: 0,
                        playlist: 'classic',
                    },
                };
            default:
                return {
                    ...baseValues,
                    defaultWaarde: {},
                };
        }
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<FormData>({
        resolver: zodResolver(deviceSchema),
        defaultValues: getDefaultValues(),
    });

    // Watch device type voor real-time updates
    const currentType = watch('type');
    const currentRoomId = watch('kamerId');
    const currentX = watch('x');
    const currentY = watch('y');

    React.useEffect(() => {
        if (currentType && currentType !== deviceType) {
            setDeviceType(currentType as DeviceType);
        }
    }, [currentType, deviceType]);

    React.useEffect(() => {
        if (currentRoomId) {
            setSelectedRoom(currentRoomId);
        }
    }, [currentRoomId]);

    // Valideer deurslot positie wanneer x, y of room veranderen
    React.useEffect(() => {
        if (currentType === 'deurslot' && currentRoomId) {
            const currentRoom = rooms.find((room: Room) => room.id === currentRoomId);
            const doorLockError = validateDoorLockPosition(currentX, currentY, currentRoom);

            if (doorLockError) {
                setFormErrors({ deurslot: doorLockError });
            } else {
                setFormErrors({});
            }
        } else {
            setFormErrors({});
        }
    }, [currentType, currentRoomId, currentX, currentY, rooms]);

    React.useEffect(() => {
        reset(getDefaultValues());
    }, [open, device, deviceType, initialX, initialY, selectedRoom]);

    const handleFormSubmit = (data: FormData) => {
        // Check for existing devices
        if ((data.type === 'audio' || data.type === 'verwarming') &&
            checkExistingDevice(data.type, data.kamerId)) {
            alert(`Er kan maar één ${data.type === 'audio' ? 'audio' : 'verwarming'} device per kamer zijn!`);
            return;
        }

        // Extra validatie voor deurslot
        if (data.type === 'deurslot') {
            const currentRoom = rooms.find((room: Room) => room.id === data.kamerId);
            const doorLockError = validateDoorLockPosition(data.x, data.y, currentRoom);

            if (doorLockError) {
                setFormErrors({ deurslot: doorLockError });
                return;
            }
        }

        // Parse coordinaten naar numbers (voor komma problemen)
        const parsedData = {
            ...data,
            x: Number(data.x),
            y: Number(data.y),
        };

        // Valideer en transformeer de data naar DeviceFormData
        const deviceData: DeviceFormData = {
            naam: parsedData.naam,
            type: parsedData.type as DeviceType,
            upcCode: parsedData.upcCode,
            kamerId: parsedData.kamerId,
            x: parsedData.x,
            y: parsedData.y,
            omschrijving: parsedData.omschrijving,
            defaultWaarde: parsedData.defaultWaarde,
        };
        onSubmit(deviceData);
    };

    const handleTypeChange = (type: DeviceType) => {
        setDeviceType(type);
    };

    const handleRoomChange = (roomId: string) => {
        setSelectedRoom(roomId);
        setValue('kamerId', roomId);

        // Reset position when room changes
        if (!device) {
            setValue('x', 0);
            setValue('y', 0);
        }
    };

    // Get current room dimensions
    const currentRoom = rooms.find((room: Room) => room.id === selectedRoom);

    const renderDefaultWaardeFields = () => {
        switch (deviceType) {
            case 'licht':
                return (
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        <FormControlLabel
                            control={
                                <Controller
                                    name="defaultWaarde.on_off"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            {...field}
                                            checked={field.value === 'on'}
                                            onChange={(e) => field.onChange(e.target.checked ? 'on' : 'off')}
                                        />
                                    )}
                                />
                            }
                            label="Standaard aan"
                        />
                        <Box>
                            <Typography gutterBottom>Standaard helderheid</Typography>
                            <Controller
                                name="defaultWaarde.brightness"
                                control={control}
                                render={({ field: { value, onChange, ...field } }) => (
                                    <Slider
                                        {...field}
                                        value={value || 100}
                                        onChange={(_, newValue) => onChange(newValue)}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={100}
                                        valueLabelFormat={(value) => `${value}%`}
                                    />
                                )}
                            />
                        </Box>
                    </Box>
                );

            case 'verwarming':
                return (
                    <Box>
                        <Typography gutterBottom>Standaard temperatuur (°C)</Typography>
                        <Controller
                            name="defaultWaarde.temperature"
                            control={control}
                            render={({ field: { value, onChange, ...field } }) => (
                                <Slider
                                    {...field}
                                    value={value || 16}
                                    onChange={(_, newValue) => onChange(newValue)}
                                    valueLabelDisplay="auto"
                                    min={10}
                                    max={30}
                                    valueLabelFormat={(value) => `${value}°C`}
                                />
                            )}
                        />
                    </Box>
                );

            case 'deurslot':
                return (
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        <FormControlLabel
                            control={
                                <Controller
                                    name="defaultWaarde.locked"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            {...field}
                                            checked={!!field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                    )}
                                />
                            }
                            label="Standaard vergrendeld"
                        />
                        {currentRoom && (
                            <Alert severity="info">
                                Plaats het deurslot op de muren:
                                x=0, x={currentRoom.width}, y=0, of y={currentRoom.height}
                            </Alert>
                        )}
                        {formErrors.deurslot && (
                            <Alert severity="error">
                                {formErrors.deurslot}
                            </Alert>
                        )}
                    </Box>
                );

            case 'audio':
                return (
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        <Box>
                            <Typography gutterBottom>Standaard volume</Typography>
                            <Controller
                                name="defaultWaarde.volume"
                                control={control}
                                render={({ field: { value, onChange, ...field } }) => (
                                    <Slider
                                        {...field}
                                        value={value || 0}
                                        onChange={(_, newValue) => onChange(newValue)}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={20}
                                    />
                                )}
                            />
                        </Box>
                        <FormControl fullWidth>
                            <InputLabel>Standaard playlist</InputLabel>
                            <Controller
                                name="defaultWaarde.playlist"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} label="Standaard playlist">
                                        <MenuItem value="classic">Classic</MenuItem>
                                        <MenuItem value="rock">Rock</MenuItem>
                                        <MenuItem value="jazz">Jazz</MenuItem>
                                        <MenuItem value="electronic">Electronic</MenuItem>
                                        <MenuItem value="pop">Pop</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {device ? 'Domotica Control Bewerken' : 'Nieuwe Domotica Control'}
            </DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        {/* Show warnings for existing devices */}
                        {(currentType === 'audio' || currentType === 'verwarming') &&
                            currentRoomId &&
                            checkExistingDevice(currentType, currentRoomId) && (
                                <Alert severity="warning">
                                    Er is al een {currentType} device in deze kamer.
                                    {!device && " Je kunt er maar één toevoegen."}
                                </Alert>
                            )}

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

                        <FormControl fullWidth disabled={!!device}>
                            <InputLabel>Type *</InputLabel>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Type *"
                                        required
                                        onChange={(e) => {
                                            const newType = e.target.value as DeviceType;
                                            field.onChange(newType);
                                            handleTypeChange(newType);
                                        }}
                                    >
                                        <MenuItem value="licht">Licht</MenuItem>
                                        <MenuItem value="verwarming">Verwarming</MenuItem>
                                        <MenuItem value="deurslot">Deurslot</MenuItem>
                                        <MenuItem value="audio">Audio</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>

                        <Controller
                            name="upcCode"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="UPC Code (13 cijfers)"
                                    fullWidth
                                    required
                                    error={!!errors.upcCode}
                                    helperText={errors.upcCode?.message}
                                    disabled={!!device}
                                />
                            )}
                        />

                        <FormControl fullWidth error={!!errors.kamerId}>
                            <InputLabel>Kamer *</InputLabel>
                            <Controller
                                name="kamerId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Kamer *"
                                        required
                                        onChange={(e) => handleRoomChange(e.target.value)}
                                    >
                                        {rooms.map((room: Room) => (
                                            <MenuItem key={room.id} value={room.id}>
                                                {room.naam} ({room.width}x{room.height})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
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
                                        value={field.value || 0}
                                        error={!!errors.x || !!formErrors.deurslot}
                                        helperText={errors.x?.message}
                                        inputProps={{
                                            min: 0,
                                            max: currentRoom?.width || 1000,
                                            step: 1
                                        }}
                                    />
                                )}
                            />

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
                                        value={field.value || 0}
                                        error={!!errors.y || !!formErrors.deurslot}
                                        helperText={errors.y?.message}
                                        inputProps={{
                                            min: 0,
                                            max: currentRoom?.height || 1000,
                                            step: 1
                                        }}
                                    />
                                )}
                            />
                        </Box>

                        {currentRoom && (
                            <Typography variant="caption" color="text.secondary">
                                Kamer afmetingen: {currentRoom.width} x {currentRoom.height}
                            </Typography>
                        )}

                        {formErrors.deurslot && (
                            <Typography variant="caption" color="error">
                                {formErrors.deurslot}
                            </Typography>
                        )}

                        <Controller
                            name="omschrijving"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Omschrijving"
                                    multiline
                                    rows={2}
                                    fullWidth
                                    error={!!errors.omschrijving}
                                    helperText={errors.omschrijving?.message}
                                />
                            )}
                        />

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Standaard Waarden
                            </Typography>
                            {renderDefaultWaardeFields()}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Annuleren</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || !!formErrors.deurslot}
                    >
                        {isSubmitting ? 'Bezig...' : device ? 'Bijwerken' : 'Aanmaken'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};