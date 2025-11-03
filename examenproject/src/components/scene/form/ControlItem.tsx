import {
    Box,
    IconButton,
    Typography,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import type { SceneControl } from '../../../types/scene.ts';
import type {Device, Playlist} from '../../../types/device.ts';
import { DeviceFieldInput } from './DeviceFieldInput.tsx';

interface ControlItemProps {
    control: SceneControl;
    index: number;
    devices: Device[];
    playlists: Playlist[];
    onRemove: (index: number) => void;
    onDeviceSelection: (index: number, deviceId: string) => void;
    onValueChange: (index: number, deviceType: string, field: string, value: string | number | boolean) => void;
}

export const ControlItem = ({
                                control,
                                index,
                                devices,
                                playlists,
                                onRemove,
                                onDeviceSelection,
                                onValueChange,
                            }: ControlItemProps) => {
    const selectedDevice = devices.find(d => d.id === control.deviceId);

    return (
        <Box
            sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: 'background.default'
            }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
            }}>
                <Typography variant="subtitle1" fontWeight="bold">
                    Device {index + 1}
                </Typography>
                <IconButton
                    onClick={() => onRemove(index)}
                    color="error"
                    size="small"
                >
                    <Delete />
                </IconButton>
            </Box>

            <Stack spacing={2}>
                <FormControl fullWidth>
                    <InputLabel>Selecteer Device</InputLabel>
                    <Select
                        value={control.deviceId}
                        label="Selecteer Device"
                        onChange={(e) => onDeviceSelection(index, e.target.value)}
                    >
                        <MenuItem value="">
                            <em>Kies een device...</em>
                        </MenuItem>
                        {devices.map(device => (
                            <MenuItem key={device.id} value={device.id}>
                                {device.naam} ({device.type}) - Kamer {device.kamerId}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {selectedDevice && (
                    <DeviceFieldInput
                        control={control}
                        index={index}
                        deviceType={selectedDevice.type}
                        playlists={playlists}
                        onValueChange={onValueChange}
                    />
                )}
            </Stack>
        </Box>
    );
};