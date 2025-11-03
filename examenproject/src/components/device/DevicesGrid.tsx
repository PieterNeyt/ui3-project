import {
    Typography,
    Alert,
    Box,
    Card,
    CardContent,
    CardActions,
    IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import type { Device, LightDevice, HeatingDevice, DoorLockDevice, AudioDevice } from '../../types/device.ts';

interface DevicesGridProps {
    devices?: Device[];
    refreshing: boolean;
    isAdmin: boolean;
    onEditDevice: (device: Device) => void;
    onDeleteDevice: (id: string) => void;
    deleteDeviceMutation: any;
}

export const DevicesGrid = ({
                                devices,
                                refreshing,
                                isAdmin,
                                onEditDevice,
                                onDeleteDevice,
                                deleteDeviceMutation,
                            }: DevicesGridProps) => {
    const getDeviceStatus = (device: Device) => {
        switch (device.type) {
            case 'licht':
            { const light = device as LightDevice;
                return `Status: ${light.waarde.on_off} | Helderheid: ${light.waarde.brightness}%`; }
            case 'verwarming':
            { const heating = device as HeatingDevice;
                return `Temperatuur: ${heating.waarde.temperature}°C`; }
            case 'deurslot':
            { const doorLock = device as DoorLockDevice;
                return `Status: ${doorLock.waarde.locked ? 'Vergrendeld' : 'Ontgrendeld'}`; }
            case 'audio':
            { const audio = device as AudioDevice;
                return `Volume: ${audio.waarde.volume} | Playlist: ${audio.waarde.playlist}`; }
            default:
                return '';
        }
    };

    if (!devices || devices.length === 0) {
        if (refreshing) return null;

        return (
            <Alert severity="info">
                Er zijn nog geen controls in deze kamer. Klik in de kamer om er een toe te voegen.
            </Alert>
        );
    }

    return (
        <>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Alle Controls ({devices.length})
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)'
                    },
                    gap: 3,
                    mt: 2
                }}
            >
                {devices.map((device) => (
                    <DeviceCard
                        key={device.id}
                        device={device}
                        isAdmin={isAdmin}
                        onEditDevice={onEditDevice}
                        onDeleteDevice={onDeleteDevice}
                        deleteDeviceMutation={deleteDeviceMutation}
                        getDeviceStatus={getDeviceStatus}
                    />
                ))}
            </Box>
        </>
    );
};

interface DeviceCardProps {
    device: Device;
    isAdmin: boolean;
    onEditDevice: (device: Device) => void;
    onDeleteDevice: (id: string) => void;
    deleteDeviceMutation: any;
    getDeviceStatus: (device: Device) => string;
}

const DeviceCard = ({
                        device,
                        isAdmin,
                        onEditDevice,
                        onDeleteDevice,
                        deleteDeviceMutation,
                        getDeviceStatus,
                    }: DeviceCardProps) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {device.naam}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Type: {device.type} | UPC: {device.upcCode}
                </Typography>
                {device.omschrijving && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        {device.omschrijving}
                    </Typography>
                )}
                <Typography variant="body2">
                    Positie: ({device.x}, {device.y})
                </Typography>
                <Typography variant="body2">
                    {getDeviceStatus(device)}
                </Typography>
            </CardContent>
            <CardActions>
                <IconButton
                    color="primary"
                    onClick={() => onEditDevice(device)}
                >
                    <Edit />
                </IconButton>
                {isAdmin && (
                    <IconButton
                        color="error"
                        onClick={() => onDeleteDevice(device.id)}
                        disabled={deleteDeviceMutation.isPending}
                    >
                        <Delete />
                    </IconButton>
                )}
            </CardActions>
        </Card>
    );
};