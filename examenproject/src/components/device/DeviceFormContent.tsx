import React from 'react';
import {
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Alert,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import type { DeviceType, Device } from '../../types/device';
import type { Room } from '../../types/room';
import type { FormData } from '../../validation/DeviceFormScheme.ts';
import { DeviceFormFields } from './DeviceFormFields';
import {
    checkExistingDevice,
    validateDoorLockPosition,
} from './helper/DeviceFormUtils.tsx';

interface DeviceFormContentProps {
    control: Control<FormData>;
    errors: FieldErrors<FormData>;
    formErrors: { deurslot?: string };
    deviceType: DeviceType;
    selectedRoom: string;
    currentType: string;
    currentRoomId: string;
    currentX: number;
    currentY: number;
    rooms: Room[];
    device?: Device | null;
    existingDevices?: Device[];
    onTypeChange: (type: DeviceType) => void;
    onRoomChange: (roomId: string) => void;
    setFormErrors: (errors: { deurslot?: string }) => void;
}

export const DeviceFormContent = ({
                                      control,
                                      errors,
                                      formErrors,
                                      deviceType,
                                      selectedRoom,
                                      currentType,
                                      currentRoomId,
                                      currentX,
                                      currentY,
                                      rooms,
                                      device,
                                      existingDevices = [],
                                      onTypeChange,
                                      onRoomChange,
                                      setFormErrors,
                                  }: DeviceFormContentProps) => {
    const currentRoom = rooms.find((room: Room) => room.id === selectedRoom);

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
    }, [currentType, currentRoomId, currentX, currentY, rooms, setFormErrors]);

    return (
        <Box sx={{ display: 'grid', gap: 2 }}>
            {(currentType === 'audio' || currentType === 'verwarming') &&
                currentRoomId &&
                checkExistingDevice(currentType, currentRoomId, existingDevices, device) && (
                    <Alert severity="warning">
                        Er is al een {currentType} device in deze kamer.
                        {!device && ' Je kunt er maar één toevoegen.'}
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
                                onTypeChange(newType);
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
                            onChange={(e) => onRoomChange(e.target.value)}
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
                            slotProps={{
                                input: {
                                    inputProps: {
                                        min: 0,
                                        max: currentRoom?.width || 1000,
                                        step: 1,
                                    },
                                },
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
                            slotProps={{
                                input: {
                                    inputProps: {
                                        min: 0,
                                        max: currentRoom?.height || 1000,
                                        step: 1,
                                    },
                                },
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

            <DeviceFormFields
                deviceType={deviceType}
                control={control}
                currentRoom={currentRoom}
                formErrors={formErrors}
            />
        </Box>
    );
};