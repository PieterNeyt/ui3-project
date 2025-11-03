import {
    Box,
    Button,
    Typography,
    Alert,
    Stack,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import type { SceneControl } from '../../../types/scene.ts';
import type {Device, Playlist} from '../../../types/device.ts';
import { ControlItem } from './ControlItem.tsx';

interface SceneFormControlsProps {
    controls: SceneControl[];
    devices: Device[];
    playlists: Playlist[];
    devicesLoading: boolean;
    onAddControl: () => void;
    onRemoveControl: (index: number) => void;
    onDeviceSelection: (index: number, deviceId: string) => void;
    onValueChange: (index: number, deviceType: string, field: string, value: string | number | boolean) => void;
}

export const SceneFormControls = ({
                                      controls,
                                      devices,
                                      playlists,
                                      devicesLoading,
                                      onAddControl,
                                      onRemoveControl,
                                      onDeviceSelection,
                                      onValueChange,
                                  }: SceneFormControlsProps) => {
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Devices</Typography>
                <Button
                    startIcon={<Add />}
                    onClick={onAddControl}
                    disabled={devicesLoading}
                    variant="outlined"
                >
                    Device Toevoegen
                </Button>
            </Box>

            {controls.length === 0 && (
                <Alert severity="info">
                    Voeg minstens één device toe aan je scene.
                </Alert>
            )}

            <Stack spacing={2}>
                {controls.map((control, index) => (
                    <ControlItem
                        key={index}
                        control={control}
                        index={index}
                        devices={devices}
                        playlists={playlists}
                        onRemove={onRemoveControl}
                        onDeviceSelection={onDeviceSelection}
                        onValueChange={onValueChange}
                    />
                ))}
            </Stack>
        </Box>
    );
};