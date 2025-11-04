import {
    Card,
    CardContent,
    CardActions,
    Box,
    Typography,
    Chip,
    IconButton,
    Switch,
    FormControlLabel,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Favorite, FavoriteBorder, Edit, Settings } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router';
import type { Device, DeviceValue, LightDevice, HeatingDevice, DoorLockDevice, AudioDevice } from '../../types/device.ts';
import type {Room} from "../../types/room.ts";
import type {Floor} from "../../types/floor.ts";

interface DeviceCardProps {
    device: Device;
    rooms?: Room[];
    floors?: Floor[];
    favorites?: Set<string>;
    isAdmin?: boolean;
    showRoomInfo?: boolean;
    onToggleFavorite?: (deviceId: string) => void;
    onDeviceControl: (device: Device, newValue: DeviceValue) => void;
    isUpdating: boolean;
}

export const DeviceCard = ({
                               device,
                               rooms = [],
                               floors = [],
                               favorites = new Set(),
                               isAdmin = false,
                               showRoomInfo = true,
                               onToggleFavorite = () => {},
                               onDeviceControl,
                               isUpdating,
                           }: DeviceCardProps) => {
    const room = rooms.find(r => r.id === device.kamerId);
    const floor = floors.find(f => f.id === room?.verdiepingId);

    const renderDeviceControl = () => {
        switch (device.type) {
            case 'licht':
                { const light = device as LightDevice;
                return (
                    <Box sx={{ mt: 2 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={light.waarde.on_off === 'on'}
                                    onChange={(e) => onDeviceControl(device, {
                                        ...light.waarde,
                                        on_off: e.target.checked ? 'on' : 'off'
                                    })}
                                    disabled={isUpdating}
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
                                onChange={(_, value) => onDeviceControl(device, {
                                    ...light.waarde,
                                    brightness: value as number
                                })}
                                min={0}
                                max={100}
                                valueLabelDisplay="auto"
                                disabled={isUpdating}
                            />
                        </Box>
                    </Box>
                ); }

            case 'verwarming':
                { const heating = device as HeatingDevice;
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                            Temperatuur: {heating.waarde.temperature}°C
                        </Typography>
                        <Slider
                            value={heating.waarde.temperature}
                            onChange={(_, value) => onDeviceControl(device, {
                                temperature: value as number
                            })}
                            min={10}
                            max={30}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${value}°C`}
                            disabled={isUpdating}
                        />
                    </Box>
                ); }

            case 'deurslot':
                { const doorLock = device as DoorLockDevice;
                return (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!doorLock.waarde.locked}
                                onChange={(e) => onDeviceControl(device, {
                                    locked: !e.target.checked
                                })}
                                disabled={isUpdating}
                            />
                        }
                        label={doorLock.waarde.locked ? 'Vergrendeld' : 'Ontgrendeld'}
                    />
                ); }

            case 'audio':
                { const audio = device as AudioDevice;
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                            Volume: {audio.waarde.volume}
                        </Typography>
                        <Slider
                            value={audio.waarde.volume}
                            onChange={(_, value) => onDeviceControl(device, {
                                ...audio.waarde,
                                volume: value as number
                            })}
                            min={0}
                            max={20}
                            valueLabelDisplay="auto"
                            disabled={isUpdating}
                        />
                        <FormControl fullWidth sx={{ mt: 1 }} size="small">
                            <InputLabel>Playlist</InputLabel>
                            <Select
                                value={audio.waarde.playlist}
                                label="Playlist"
                                onChange={(e) => onDeviceControl(device, {
                                    ...audio.waarde,
                                    playlist: e.target.value
                                })}
                                disabled={isUpdating}
                            >
                                <MenuItem value="classic">Classic</MenuItem>
                                <MenuItem value="rock">Rock</MenuItem>
                                <MenuItem value="jazz">Jazz</MenuItem>
                                <MenuItem value="electronic">Electronic</MenuItem>
                                <MenuItem value="pop">Pop</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                ); }

            default:
                return null;
        }
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" gutterBottom sx={{ wordBreak: 'break-word' }}>
                        {device.naam}
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={() => onToggleFavorite(device.id)}
                        color={favorites.has(device.id) ? 'error' : 'default'}
                    >
                        {favorites.has(device.id) ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                </Box>

                <Box display="flex" gap={1} mb={1} flexWrap="wrap">
                    <Chip label={device.type} size="small" variant="outlined" />
                    {showRoomInfo && room && <Chip label={room.naam} size="small" />}
                    {showRoomInfo && floor && <Chip label={floor.naam} size="small" />}
                </Box>

                {device.omschrijving && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        {device.omschrijving}
                    </Typography>
                )}

                {renderDeviceControl()}
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
                {isAdmin && (
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
};