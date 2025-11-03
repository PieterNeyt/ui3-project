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
import { type DeviceFormData, type DeviceType, type Device } from '../../types/device';
import type { Room } from '../../types/room';
import { type FormData, deviceSchema } from './DeviceFormScheme.tsx';
import { DeviceFormContent } from './DeviceFormContent';
import {
    getDefaultValues,
    createDeviceData,
    validateFormSubmission,
} from './helper/DeviceFormUtils.tsx';

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

export const DeviceForm = ({
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
                           }: DeviceFormProps) => {
    const [deviceType, setDeviceType] = React.useState<DeviceType>(device?.type || 'licht');
    const [selectedRoom, setSelectedRoom] = React.useState<string>(initialKamerId);
    const [formErrors, setFormErrors] = React.useState<{ deurslot?: string }>({});

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<FormData>({
        resolver: zodResolver(deviceSchema),
        defaultValues: getDefaultValues(
            deviceType,
            selectedRoom,
            initialKamerId,
            initialX,
            initialY,
            device
        ),
    });

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

    React.useEffect(() => {
        reset(
            getDefaultValues(
                deviceType,
                selectedRoom,
                initialKamerId,
                initialX,
                initialY,
                device
            )
        );
    }, [open, device, deviceType, initialX, initialY, selectedRoom]);

    const handleFormSubmit = (data: FormData) => {
        const validation = validateFormSubmission(data, rooms, existingDevices, device);

        if (!validation.isValid) {
            if (data.type === 'deurslot') {
                setFormErrors({ deurslot: validation.error });
            } else {
                alert(validation.error);
            }
            return;
        }

        const deviceData = createDeviceData(data);
        onSubmit(deviceData);
    };

    const handleTypeChange = (type: DeviceType) => {
        setDeviceType(type);
    };

    const handleRoomChange = (roomId: string) => {
        setSelectedRoom(roomId);
        setValue('kamerId', roomId);

        if (!device) {
            setValue('x', 0);
            setValue('y', 0);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {device ? 'Domotica Control Bewerken' : 'Nieuwe Domotica Control'}
            </DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <DeviceFormContent
                        control={control}
                        errors={errors}
                        formErrors={formErrors}
                        deviceType={deviceType}
                        selectedRoom={selectedRoom}
                        currentType={currentType}
                        currentRoomId={currentRoomId}
                        currentX={currentX}
                        currentY={currentY}
                        rooms={rooms}
                        device={device}
                        existingDevices={existingDevices}
                        onTypeChange={handleTypeChange}
                        onRoomChange={handleRoomChange}
                        setFormErrors={setFormErrors}
                    />
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