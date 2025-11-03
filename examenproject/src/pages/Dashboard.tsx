import React, { useState, useMemo } from 'react';
import {
    Container,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Switch,
    FormControlLabel,
    Slider,
    Button,
    Tabs,
    Tab,
    Alert,
    Snackbar,
    TextField
} from '@mui/material';
import { Favorite, FavoriteBorder, Edit, Settings, Search } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router';
import { useDevices } from '../hooks/useDevices';
import { useRooms } from '../hooks/useRooms';
import { useFloors } from '../hooks/useFloors';
import { useUpdateDevice } from '../hooks/useDevices';
import type {
    Device,
    LightDevice,
    HeatingDevice,
    DoorLockDevice,
    AudioDevice,
    DeviceValue, LightValue, HeatingValue, DoorLockValue, AudioValue
} from '../types/device';
import { useAuth } from '../hooks/useAuth.ts';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = ({ children, value, index, ...other }:TabPanelProps) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`dashboard-tabpanel-${index}`}
            aria-labelledby={`dashboard-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

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

    // Filter devices
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

    // Favorite devices
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
        let updateData: Partial<Device>;

        switch (device.type) {
            case 'licht':
                updateData = {
                    waarde: newValue as LightValue
                };
                break;
            case 'verwarming':
                updateData = {
                    waarde: newValue as HeatingValue
                };
                break;
            case 'deurslot':
                updateData = {
                    waarde: newValue as DoorLockValue
                };
                break;
            case 'audio':
                updateData = {
                    waarde: newValue as AudioValue
                };
                break;
            default:
                return;
        }

        updateDeviceMutation.mutate(
            {
                id: device.id,
                data: updateData
            },
            {
                onSuccess: () => {
                    setSnackbar({ open: true, message: `${device.naam} bijgewerkt` });
                },
            }
        );
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
                    handleDeviceControl(device, { ...device.waarde, on_off: 'off' });
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

    const renderDeviceControl = (device: Device) => {
        switch (device.type) {
            case 'licht':
            {
                const light = device as LightDevice;
                return (
                    <Box sx={{ mt: 2 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={light.waarde.on_off === 'on'}
                                    onChange={(e) => handleDeviceControl(device, {
                                        ...light.waarde,
                                        on_off: e.target.checked ? 'on' : 'off'
                                    })}
                                    disabled={updateDeviceMutation.isPending}
                                />
                            }
                            label="Aan/Uit"
                        />
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" gutterBottom>
                                Helderheid: {light.waarde.brightness}%
                            </Typography>
                            <Slider
                                value={light.waarde.brightness}
                                onChange={(_, value) => handleDeviceControl(device, {
                                    ...light.waarde,
                                    brightness: value as number
                                })}
                                min={0}
                                max={100}
                                valueLabelDisplay="auto"
                                disabled={updateDeviceMutation.isPending}
                            />
                        </Box>
                    </Box>
                );
            }

            case 'verwarming':
            {
                const heating = device as HeatingDevice;
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                            Temperatuur: {heating.waarde.temperature}°C
                        </Typography>
                        <Slider
                            value={heating.waarde.temperature}
                            onChange={(_, value) => handleDeviceControl(device, {
                                temperature: value as number
                            })}
                            min={10}
                            max={30}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${value}°C`}
                            disabled={updateDeviceMutation.isPending}
                        />
                    </Box>
                );
            }

            case 'deurslot':
            {
                const doorLock = device as DoorLockDevice;
                return (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!doorLock.waarde.locked}
                                onChange={(e) => handleDeviceControl(device, {
                                    locked: !e.target.checked
                                })}
                                disabled={updateDeviceMutation.isPending}
                            />
                        }
                        label={doorLock.waarde.locked ? 'Vergrendeld' : 'Ontgrendeld'}
                    />
                );
            }

            case 'audio':
            {
                const audio = device as AudioDevice;
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                            Volume: {audio.waarde.volume}
                        </Typography>
                        <Slider
                            value={audio.waarde.volume}
                            onChange={(_, value) => handleDeviceControl(device, {
                                ...audio.waarde,
                                volume: value as number
                            })}
                            min={0}
                            max={20}
                            valueLabelDisplay="auto"
                            disabled={updateDeviceMutation.isPending}
                        />
                        <FormControl fullWidth sx={{ mt: 1 }} size="small">
                            <InputLabel>Playlist</InputLabel>
                            <Select
                                value={audio.waarde.playlist}
                                label="Playlist"
                                onChange={(e) => handleDeviceControl(device, {
                                    ...audio.waarde,
                                    playlist: e.target.value
                                })}
                                disabled={updateDeviceMutation.isPending}
                            >
                                <MenuItem value="classic">Classic</MenuItem>
                                <MenuItem value="rock">Rock</MenuItem>
                                <MenuItem value="jazz">Jazz</MenuItem>
                                <MenuItem value="electronic">Electronic</MenuItem>
                                <MenuItem value="pop">Pop</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                );
            }

            default:
                return null;
        }
    };

    const renderDashboardView = () => {
        return (
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)'
                },
                gap: 3
            }}>
                {filteredDevices.map((device: Device) => {
                    const room = rooms.find(r => r.id === device.kamerId);
                    const floor = floors.find(f => f.id === room?.verdiepingId);

                    return (
                        <Card key={device.id} sx={{ height: '100%' }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Typography variant="h6" gutterBottom sx={{ wordBreak: 'break-word' }}>
                                        {device.naam}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => toggleFavorite(device.id)}
                                        color={favorites.has(device.id) ? 'error' : 'default'}
                                    >
                                        {favorites.has(device.id) ? <Favorite /> : <FavoriteBorder />}
                                    </IconButton>
                                </Box>

                                <Box display="flex" gap={1} mb={1} flexWrap="wrap">
                                    <Chip label={device.type} size="small" variant="outlined" />
                                    {room && <Chip label={room.naam} size="small" />}
                                    {floor && <Chip label={floor.naam} size="small" />}
                                </Box>

                                {device.omschrijving && (
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {device.omschrijving}
                                    </Typography>
                                )}

                                {renderDeviceControl(device)}
                            </CardContent>
                            <CardActions>
                                <IconButton
                                    size="small"
                                    component={RouterLink}
                                    to={`/rooms/${device.kamerId}/devices`}
                                    title="Naar kamer details"
                                >
                                    <Settings />
                                </IconButton>
                                {isAdmin() && (
                                    <IconButton
                                        size="small"
                                        component={RouterLink}
                                        to={`/rooms/${device.kamerId}/devices`}
                                        title="Device bewerken"
                                    >
                                        <Edit />
                                    </IconButton>
                                )}
                            </CardActions>
                        </Card>
                    );
                })}
            </Box>
        );
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
            <Box mb={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Domotica Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Bekijk en beheer al je domotica controls op één plek
                </Typography>
            </Box>


            {/* Search and Filter Section */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2,
                        alignItems: { xs: 'stretch', md: 'center' }
                    }}>
                        <Box sx={{ flex: 1 }}>
                            <TextField
                                fullWidth
                                label="Zoeken..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                                }}
                                placeholder="Zoek op naam, omschrijving of UPC..."
                            />
                        </Box>
                        <Box sx={{ width: { xs: '100%', md: 200 } }}>
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={selectedType}
                                    label="Type"
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    <MenuItem value="all">Alle types</MenuItem>
                                    <MenuItem value="licht">Licht</MenuItem>
                                    <MenuItem value="verwarming">Verwarming</MenuItem>
                                    <MenuItem value="deurslot">Deurslot</MenuItem>
                                    <MenuItem value="audio">Audio</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ width: { xs: '100%', md: 200 } }}>
                            <FormControl fullWidth>
                                <InputLabel>Kamer</InputLabel>
                                <Select
                                    value={selectedRoom}
                                    label="Kamer"
                                    onChange={(e) => setSelectedRoom(e.target.value)}
                                >
                                    <MenuItem value="all">Alle kamers</MenuItem>
                                    {rooms.map(room => (
                                        <MenuItem key={room.id} value={room.id}>
                                            {room.naam}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ width: { xs: '100%', md: 200 } }}>
                            <FormControl fullWidth>
                                <InputLabel>Verdieping</InputLabel>
                                <Select
                                    value={selectedFloor}
                                    label="Verdieping"
                                    onChange={(e) => setSelectedFloor(e.target.value)}
                                >
                                    <MenuItem value="all">Alle verdiepingen</MenuItem>
                                    {floors.map(floor => (
                                        <MenuItem key={floor.id} value={floor.id}>
                                            {floor.naam}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

                <>
                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                            <Tab label={`Alle Controls (${filteredDevices.length})`} />
                            <Tab label={`Favorieten (${favoriteDevices.length})`} />
                            <Tab label={`Recente (${recentDevices.length})`} />
                            <Tab label="Vaak Gebruikt" />
                            <Tab label="Snel Acties" />
                        </Tabs>
                    </Box>

                    {/* All Devices Tab */}
                    <TabPanel value={tabValue} index={0}>
                        {renderDashboardView()}
                        {filteredDevices.length === 0 && (
                            <Alert severity="info">
                                Geen devices gevonden met de huidige filters.
                            </Alert>
                        )}
                    </TabPanel>

                    {/* Favorites Tab */}
                    <TabPanel value={tabValue} index={1}>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                                lg: 'repeat(4, 1fr)'
                            },
                            gap: 3
                        }}>
                            {favoriteDevices.map((device: Device) => (
                                <Card key={device.id}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                            <Typography variant="h6" gutterBottom>
                                                {device.naam}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => toggleFavorite(device.id)}
                                                color="error"
                                            >
                                                <Favorite />
                                            </IconButton>
                                        </Box>
                                        <Box display="flex" gap={1} mb={1} flexWrap="wrap">
                                            <Chip label={device.type} size="small" variant="outlined" />
                                        </Box>
                                        {renderDeviceControl(device)}
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                        {favoriteDevices.length === 0 && (
                            <Alert severity="info">
                                Je hebt nog geen favoriete devices. Klik op het hartje om devices toe te voegen.
                            </Alert>
                        )}
                    </TabPanel>

                    {/* Recent Tab */}
                    <TabPanel value={tabValue} index={2}>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                                lg: 'repeat(4, 1fr)'
                            },
                            gap: 3
                        }}>
                            {recentDevices.map(device => (
                                <Card key={device.id}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {device.naam}
                                        </Typography>
                                        <Box display="flex" gap={1} mb={1} flexWrap="wrap">
                                            <Chip label={device.type} size="small" variant="outlined" />
                                        </Box>
                                        {renderDeviceControl(device)}
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </TabPanel>

                    {/* Frequent Used Tab */}
                    <TabPanel value={tabValue} index={3}>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                                lg: 'repeat(4, 1fr)'
                            },
                            gap: 3
                        }}>
                            {frequentDevices.map(device => (
                                <Card key={device.id}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {device.naam}
                                        </Typography>
                                        <Box display="flex" gap={1} mb={1} flexWrap="wrap">
                                            <Chip label={device.type} size="small" variant="outlined" />
                                        </Box>
                                        {renderDeviceControl(device)}
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </TabPanel>

                    {/* Quick Actions Tab */}
                    <TabPanel value={tabValue} index={4}>
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 3,
                            justifyContent: { xs: 'center', md: 'flex-start' }
                        }}>
                            <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' }, maxWidth: 400 }}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Alle lichten uit
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Zet alle lichten in huis uit
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleQuickAction('allLightsOff')}
                                        >
                                            Uitvoeren
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' }, maxWidth: 400 }}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Vertrek modus
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Stel alle thermostaten in op 16°C en doe deuren op slot
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleQuickAction('awayMode')}
                                        >
                                            Activeren
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Box>
                    </TabPanel>
                </>


            {/* Snackbar voor feedback */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
            />
        </Container>
    );
};