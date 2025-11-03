import  { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Breadcrumbs,
    Link,
    Card,
    CardContent,
    CardActions,
    IconButton,
} from '@mui/material';
import { Edit, Delete, Home } from '@mui/icons-material';
import { Link as RouterLink, useParams } from 'react-router';
import { useDevicesByRoom, useDeleteDevice, useUpdateDevice } from '../../../hooks/useDevices.ts';
import { useRooms } from '../../../hooks/useRooms.ts';
import { useFloors } from '../../../hooks/useFloors.ts';
import { RoomPlan } from '../../../components/device/display/RoomPlan.tsx';
import { DeviceForm } from '../../../components/device/form/DeviceForm.tsx';
import type { Device, LightDevice, HeatingDevice, DoorLockDevice, AudioDevice, DeviceFormData } from '../../../types/device.ts';
import type {Room} from "../../../types/room.ts";
import type {Floor} from "../../../types/floor.ts";
import {useAuth} from "../../../hooks/useAuth.ts";

export default function Devices()  {

    const { kamerId } = useParams<{ kamerId: string }>();
    const { isAdmin, isGebruiker } = useAuth();
    const { data: floors } = useFloors();
    const { data: rooms } = useRooms();
    const { data: devices, error, isLoading, refetch } = useDevicesByRoom(kamerId || '');
    const deleteDeviceMutation = useDeleteDevice();
    const updateDeviceMutation = useUpdateDevice();

    const [formOpen, setFormOpen] = useState(false);
    const [editingDevice, setEditingDevice] = useState<Device | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // Find current room and floor met juiste types
    const currentRoom = rooms?.find((room: Room) => room.id === kamerId);
    const currentFloor = floors?.find((floor: Floor) =>
        floor.id === currentRoom?.verdiepingId
    );

    // Refetch devices when mutation is successful
    useEffect(() => {
        if (deleteDeviceMutation.isSuccess || updateDeviceMutation.isSuccess) {
            setRefreshing(true);
            refetch().finally(() => {
                setRefreshing(false);
            });
        }
    }, [deleteDeviceMutation.isSuccess, updateDeviceMutation.isSuccess, refetch]);

    const handleDeleteDevice = (id: string) => {
        if (window.confirm('Weet je zeker dat je deze control wilt verwijderen?')) {
            deleteDeviceMutation.mutate(id);
        }
    };

    const handleEditDevice = (device: Device) => {
        setEditingDevice(device);
        setFormOpen(true);
    };

    const handleUpdateDevice = (data: DeviceFormData) => {
        if (editingDevice) {
            updateDeviceMutation.mutate(
                {
                    id: editingDevice.id,
                    data: {
                        ...data,
                        // Zorg ervoor dat waarde wordt bijgewerkt met nieuwe defaultWaarde
                        waarde: data.defaultWaarde,
                        x: Number(data.x),
                        y: Number(data.y),
                    } as Partial<Device>
                },
                {
                    onSuccess: () => {
                        setFormOpen(false);
                        setEditingDevice(null);
                    },
                }
            );
        }
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditingDevice(null);
    };

    const handleDeviceClick = (device: Device) => {
        handleEditDevice(device);
    };

    // Helper functies voor type-safe device waarden
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

    if (!isAdmin() && !isGebruiker()) {
        return (
            <Container sx={{ mt: 12, mb: 4 }}>
                <Alert severity="error">
                    Je hebt geen toegang tot deze pagina. Log in als gebruiker of admin.
                </Alert>
            </Container>
        );
    }

    if (!kamerId || !currentRoom || !currentFloor) {
        return (
            <Container sx={{ mt: 12, mb: 4 }}>
                <Alert severity="error">
                    Kamer niet gevonden.
                </Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 12, mb: 4 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link component={RouterLink} to="/" color="inherit" underline="hover">
                    <Home sx={{ mr: 0.5 }} fontSize="inherit" />
                    Home
                </Link>
                <Link component={RouterLink} to="/floors" color="inherit" underline="hover">
                    Verdiepingen
                </Link>
                <Link
                    component={RouterLink}
                    to={`/floors/${currentFloor.id}/rooms`}
                    color="inherit"
                    underline="hover"
                >
                    {currentFloor.naam}
                </Link>
                <Typography color="text.primary">Domotica - {currentRoom.naam}</Typography>
            </Breadcrumbs>

            <Box mb={4}>
                <Typography variant="h4" component="h1" gutterBottom >
                    Domotica Controls - {currentRoom.naam}
                </Typography>
                {currentRoom.omschrijving && (
                    <Typography variant="body1" color="text.secondary">
                        {currentRoom.omschrijving}
                    </Typography>
                )}
            </Box>

            {(error || refreshing) && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    {refreshing ? 'Bezig met vernieuwen...' : `Fout bij het laden van devices: ${(error as Error)?.message}`}
                </Alert>
            )}

            {(isLoading || refreshing) && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            )}

            {/* Room Plan with Devices */}
            {currentRoom && rooms && !refreshing && (
                <Box mb={4}>
                    <RoomPlan
                        room={currentRoom}
                        devices={devices || []}
                        onDeviceClick={handleDeviceClick}
                        scale={0.8}
                        rooms={rooms || []}
                    />
                </Box>
            )}

            {/* Devices List */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }} >
                Alle Controls ({devices?.length || 0})
            </Typography>

            {devices && devices.length === 0 && !refreshing && (
                <Alert severity="info">
                    Er zijn nog geen controls in deze kamer. Klik in de kamer om er een toe te voegen.
                </Alert>
            )}

            {/* Box container in plaats van Grid */}
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
                {devices?.map((device) => (
                    <Card key={device.id}>
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
                                onClick={() => handleEditDevice(device)}
                            >
                                <Edit />
                            </IconButton>
                            {isAdmin() && (
                            <IconButton
                                color="error"
                                onClick={() => handleDeleteDevice(device.id)}
                                disabled={deleteDeviceMutation.isPending}
                            >
                                <Delete />
                            </IconButton>)}
                        </CardActions>
                    </Card>
                ))}
            </Box>

            {/* Edit Device Form */}
            <DeviceForm
                open={formOpen}
                onClose={handleCloseForm}
                onSubmit={handleUpdateDevice}
                rooms={rooms || []}
                isSubmitting={updateDeviceMutation.isPending}
                device={editingDevice}
                existingDevices={devices || []}
            />
        </Container>
    );
};