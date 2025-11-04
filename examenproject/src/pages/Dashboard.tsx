import  { useState, useMemo } from 'react';
import {
    Container,
    Alert,
    Snackbar,
} from '@mui/material';
import { useDevices } from '../hooks/useDevices';
import { useRooms } from '../hooks/useRooms';
import { useFloors } from '../hooks/useFloors';
import { useUpdateDevice } from '../hooks/useDevices';
import { useAuth } from '../hooks/useAuth.ts';
import type { Device, DeviceValue, LightDevice, HeatingDevice, DoorLockDevice } from '../types/device';
import { DashboardHeader } from '../components/dashboard/DashboardHeader.tsx';
import { SearchFilters } from '../components/dashboard/SearchFilters.tsx';
import { DashboardTabs } from '../components/dashboard/DashboardTabs.tsx';

export default function Dashboard() {
    const { isAdmin, isGebruiker } = useAuth();
    const { data: devices = [] } = useDevices();
    const { data: rooms = [] } = useRooms();
    const { data: floors = [] } = useFloors();
    const updateDeviceMutation = useUpdateDevice();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedRoom, setSelectedRoom] = useState<string>('all');
    const [selectedFloor, setSelectedFloor] = useState<string>('all');
    const [tabValue, setTabValue] = useState(0);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    const filteredDevices = useMemo(() => {
        return devices.filter((device: Device) => {
            const matchesSearch = device.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                device.omschrijving?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                device.upcCode.includes(searchTerm);
            const matchesType = selectedType === 'all' || device.type === selectedType;
            const matchesRoom = selectedRoom === 'all' || device.kamerId === selectedRoom;

            const deviceRoom = rooms.find(room => room.id === device.kamerId);
            const matchesFloor = selectedFloor === 'all' || deviceRoom?.verdiepingId === selectedFloor;

            return matchesSearch && matchesType && matchesRoom && matchesFloor;
        });
    }, [devices, searchTerm, selectedType, selectedRoom, selectedFloor, rooms]);

    const recentDevices = useMemo(() => {
        return [...devices]
            .sort((a, b) => new Date(b.updatedAt || b.createdAt || '').getTime() - new Date(a.updatedAt || a.createdAt || '').getTime())
            .slice(0, 10);
    }, [devices]);

    const favoriteDevices = useMemo(() => {
        return devices.filter((device: Device) => favorites.has(device.id));
    }, [devices, favorites]);

    const frequentDevices = useMemo(() => {
        return [...devices]
            .sort((a, b) => {
                const aUpdates = new Date(a.updatedAt || a.createdAt || '').getTime();
                const bUpdates = new Date(b.updatedAt || b.createdAt || '').getTime();
                return bUpdates - aUpdates;
            })
            .slice(0, 8);
    }, [devices]);

    const toggleFavorite = (deviceId: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(deviceId)) {
                newFavorites.delete(deviceId);
            } else {
                newFavorites.add(deviceId);
            }
            return newFavorites;
        });
    };

    const handleDeviceControl = (device: Device, newValue: DeviceValue) => {
        // Gebruik type narrowing voor elke device type
        if (device.type === 'licht' && 'on_off' in newValue && 'brightness' in newValue) {
            const updateData = {
                waarde: newValue
            };
            updateDeviceMutation.mutate({ id: device.id, data: updateData });
        }
        else if (device.type === 'verwarming' && 'temperature' in newValue) {
            const updateData = {
                waarde: newValue
            };
            updateDeviceMutation.mutate({ id: device.id, data: updateData });
        }
        else if (device.type === 'deurslot' && 'locked' in newValue) {
            const updateData = {
                waarde: newValue
            };
            updateDeviceMutation.mutate({ id: device.id, data: updateData });
        }
        else if (device.type === 'audio' && 'volume' in newValue && 'playlist' in newValue) {
            const updateData = {
                waarde: newValue
            };
            updateDeviceMutation.mutate({ id: device.id, data: updateData });
        }
        else {
            console.error('Invalid device type or value combination');
            return;
        }

        setSnackbar({ open: true, message: `${device.naam} bijgewerkt` });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleQuickAction = (action: string) => {
        switch (action) {
            case 'allLightsOff':
            {
                const lightDevices = devices.filter(d => d.type === 'licht') as LightDevice[];
                lightDevices.forEach(device => {
                    handleDeviceControl(device, {
                        on_off: 'off',
                        brightness: device.waarde.brightness
                    });
                });
                setSnackbar({ open: true, message: 'Alle lichten uitgezet' });
                break;
            }
            case 'awayMode':
            {
                const heatingDevices = devices.filter(d => d.type === 'verwarming') as HeatingDevice[];
                const doorLockDevices = devices.filter(d => d.type === 'deurslot') as DoorLockDevice[];

                heatingDevices.forEach(device => {
                    handleDeviceControl(device, { temperature: 16 });
                });
                doorLockDevices.forEach(device => {
                    handleDeviceControl(device, { locked: true });
                });
                setSnackbar({ open: true, message: 'Vertrek modus geactiveerd' });
                break;
            }
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

    return (
        <Container sx={{ mt: 12, mb: 4, maxWidth: '1400px' }}>
            <DashboardHeader />

            <SearchFilters
                searchTerm={searchTerm}
                selectedType={selectedType}
                selectedRoom={selectedRoom}
                selectedFloor={selectedFloor}
                rooms={rooms}
                floors={floors}
                onSearchChange={setSearchTerm}
                onTypeChange={setSelectedType}
                onRoomChange={setSelectedRoom}
                onFloorChange={setSelectedFloor}
            />

            <DashboardTabs
                tabValue={tabValue}
                onTabChange={setTabValue}
                filteredDevices={filteredDevices}
                favoriteDevices={favoriteDevices}
                recentDevices={recentDevices}
                frequentDevices={frequentDevices}
                rooms={rooms}
                floors={floors}
                favorites={favorites}
                isAdmin={isAdmin()}
                onToggleFavorite={toggleFavorite}
                onDeviceControl={handleDeviceControl}
                onQuickAction={handleQuickAction}
                isUpdating={updateDeviceMutation.isPending}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
            />
        </Container>
    );
}