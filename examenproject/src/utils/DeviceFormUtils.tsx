import type { Device, DeviceType, DeviceFormData } from '../types/device.ts';
import type { Room } from '../types/room.ts';
import type { FormData } from '../validation/DeviceFormScheme.ts';

export const checkExistingDevice = (
    type: DeviceType,
    roomId: string,
    existingDevices: Device[],
    currentDevice?: Device | null
): boolean => {
    return existingDevices.some(dev =>
        dev.type === type &&
        dev.kamerId === roomId &&
        (!currentDevice || dev.id !== currentDevice.id)
    );
};

export const validateDoorLockPosition = (
    x: number,
    y: number,
    room: Room | undefined
): string | null => {
    if (!room) return null;

    const isOnWall = x === 0 || x === room.width || y === 0 || y === room.height;
    if (!isOnWall) {
        return 'Deursloten moeten op de muren geplaatst worden (x=0, x=kamerbreedte, y=0, of y=kamerhoogte)';
    }
    return null;
};

export const getDefaultValues = (
    deviceType: DeviceType,
    selectedRoom: string,
    initialKamerId: string,
    initialX: number,
    initialY: number,
    device?: Device | null
): FormData => {
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

export const createDeviceData = (data: FormData): DeviceFormData => {
    const parsedData = {
        ...data,
        x: Number(data.x),
        y: Number(data.y),
    };

    switch (parsedData.type) {
        case 'licht':
            return {
                naam: parsedData.naam,
                type: 'licht',
                upcCode: parsedData.upcCode,
                kamerId: parsedData.kamerId,
                x: parsedData.x,
                y: parsedData.y,
                omschrijving: parsedData.omschrijving,
                defaultWaarde: parsedData.defaultWaarde as { on_off: 'on' | 'off'; brightness: number },
            };
        case 'verwarming':
            return {
                naam: parsedData.naam,
                type: 'verwarming',
                upcCode: parsedData.upcCode,
                kamerId: parsedData.kamerId,
                x: parsedData.x,
                y: parsedData.y,
                omschrijving: parsedData.omschrijving,
                defaultWaarde: parsedData.defaultWaarde as { temperature: number },
            };
        case 'deurslot':
            return {
                naam: parsedData.naam,
                type: 'deurslot',
                upcCode: parsedData.upcCode,
                kamerId: parsedData.kamerId,
                x: parsedData.x,
                y: parsedData.y,
                omschrijving: parsedData.omschrijving,
                defaultWaarde: parsedData.defaultWaarde as { locked: boolean },
            };
        case 'audio':
            return {
                naam: parsedData.naam,
                type: 'audio',
                upcCode: parsedData.upcCode,
                kamerId: parsedData.kamerId,
                x: parsedData.x,
                y: parsedData.y,
                omschrijving: parsedData.omschrijving,
                defaultWaarde: parsedData.defaultWaarde as { volume: number; playlist: string },
            };
        default:
            throw new Error(`Unknown device type: ${parsedData.type}`);
    }
};

export const validateFormSubmission = (
    data: FormData,
    rooms: Room[],
    existingDevices: Device[],
    currentDevice?: Device | null
): { isValid: boolean; error?: string } => {
    if ((data.type === 'audio' || data.type === 'verwarming') &&
        checkExistingDevice(data.type, data.kamerId, existingDevices, currentDevice)) {
        return {
            isValid: false,
            error: `Er kan maar één ${data.type === 'audio' ? 'audio' : 'verwarming'} device per kamer zijn!`
        };
    }

    if (data.type === 'deurslot') {
        const currentRoom = rooms.find((room: Room) => room.id === data.kamerId);
        const doorLockError = validateDoorLockPosition(data.x, data.y, currentRoom);

        if (doorLockError) {
            return { isValid: false, error: doorLockError };
        }
    }

    return { isValid: true };
};