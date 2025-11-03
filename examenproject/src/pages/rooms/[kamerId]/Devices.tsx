import { useState, useEffect } from 'react';
import {
    Container,
    Alert,
    CircularProgress,
    Box,
} from '@mui/material';
import { useParams } from 'react-router';
import { useDevicesByRoom, useDeleteDevice, useUpdateDevice } from '../../../hooks/useDevices.ts';
import { useRooms } from '../../../hooks/useRooms.ts';
import { useFloors } from '../../../hooks/useFloors.ts';
import { useAuth } from "../../../hooks/useAuth.ts";
import type { Device, DeviceFormData } from '../../../types/device.ts';
import { DevicesBreadcrumbs } from '../../../components/device/DevicesBreadcrumbs.tsx';
import { DevicesHeader } from '../../../components/device/DevicesHeader.tsx';
import { RoomPlanSection } from '../../../components/device/RoomPlanSection.tsx';
import { DevicesGrid } from '../../../components/device/DevicesGrid.tsx';
import { DeviceForm } from '../../../components/device/form/DeviceForm.tsx';

export default function Devices() {
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

    const currentRoom = rooms?.find(room => room.id === kamerId);
    const currentFloor = floors?.find(floor =>
        floor.id === currentRoom?.verdiepingId
    );

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
            <DevicesBreadcrumbs currentFloor={currentFloor} currentRoom={currentRoom} />

            <DevicesHeader currentRoom={currentRoom} />

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

            <RoomPlanSection
                currentRoom={currentRoom}
                rooms={rooms || []}
                devices={devices || []}
                refreshing={refreshing}
                onDeviceClick={handleDeviceClick}
            />

            <DevicesGrid
                devices={devices}
                refreshing={refreshing}
                isAdmin={isAdmin()}
                onEditDevice={handleEditDevice}
                onDeleteDevice={handleDeleteDevice}
                deleteDeviceMutation={deleteDeviceMutation}
            />

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
}