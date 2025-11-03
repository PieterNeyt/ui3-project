import {
    Box,
    FormControl,
    FormControlLabel,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    Slider,
    Typography,
    Alert,
} from '@mui/material';
import { type Control, Controller } from 'react-hook-form';
import type { DeviceType } from '../../types/device';
import type { Room } from '../../types/room';
import type { FormData } from '../../validation/DeviceFormScheme.ts';

interface DeviceFormFieldsProps {
    deviceType: DeviceType;
    control: Control<FormData>;
    currentRoom: Room | undefined;
    formErrors: { deurslot?: string };
}

// Helper types for type assertions
type LightDefaultWaarde = { on_off: 'on' | 'off'; brightness: number };
type HeatingDefaultWaarde = { temperature: number };
type DoorLockDefaultWaarde = { locked: boolean };
type AudioDefaultWaarde = { volume: number; playlist: string };

export const DeviceFormFields = ({
                                     deviceType,
                                     control,
                                     currentRoom,
                                     formErrors,
                                 }: DeviceFormFieldsProps) => {
    const renderDefaultWaardeFields = () => {
        switch (deviceType) {
            case 'licht':
                return (
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        <FormControlLabel
                            control={
                                <Controller
                                    name="defaultWaarde"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            checked={(field.value as LightDefaultWaarde)?.on_off === 'on'}
                                            onChange={(e) => field.onChange({
                                                ...(field.value as LightDefaultWaarde),
                                                on_off: e.target.checked ? 'on' : 'off'
                                            })}
                                        />
                                    )}
                                />
                            }
                            label="Standaard aan"
                        />
                        <Box>
                            <Typography gutterBottom>Standaard helderheid</Typography>
                            <Controller
                                name="defaultWaarde"
                                control={control}
                                render={({ field }) => (
                                    <Slider
                                        value={(field.value as LightDefaultWaarde)?.brightness || 100}
                                        onChange={(_, newValue) => field.onChange({
                                            ...(field.value as LightDefaultWaarde),
                                            brightness: newValue as number
                                        })}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={100}
                                        valueLabelFormat={(value) => `${value}%`}
                                    />
                                )}
                            />
                        </Box>
                    </Box>
                );

            case 'verwarming':
                return (
                    <Box>
                        <Typography gutterBottom>Standaard temperatuur (°C)</Typography>
                        <Controller
                            name="defaultWaarde"
                            control={control}
                            render={({ field }) => (
                                <Slider
                                    value={(field.value as HeatingDefaultWaarde)?.temperature || 16}
                                    onChange={(_, newValue) => field.onChange({
                                        ...(field.value as HeatingDefaultWaarde),
                                        temperature: newValue as number
                                    })}
                                    valueLabelDisplay="auto"
                                    min={10}
                                    max={30}
                                    valueLabelFormat={(value) => `${value}°C`}
                                />
                            )}
                        />
                    </Box>
                );

            case 'deurslot':
                return (
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        <FormControlLabel
                            control={
                                <Controller
                                    name="defaultWaarde"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            checked={!!(field.value as DoorLockDefaultWaarde)?.locked}
                                            onChange={(e) => field.onChange({
                                                ...(field.value as DoorLockDefaultWaarde),
                                                locked: e.target.checked
                                            })}
                                        />
                                    )}
                                />
                            }
                            label="Standaard vergrendeld"
                        />
                        {currentRoom && (
                            <Alert severity="info">
                                Plaats het deurslot op de muren:
                                x=0, x={currentRoom.width}, y=0, of y={currentRoom.height}
                            </Alert>
                        )}
                        {formErrors.deurslot && (
                            <Alert severity="error">
                                {formErrors.deurslot}
                            </Alert>
                        )}
                    </Box>
                );

            case 'audio':
                return (
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        <Box>
                            <Typography gutterBottom>Standaard volume</Typography>
                            <Controller
                                name="defaultWaarde"
                                control={control}
                                render={({ field }) => (
                                    <Slider
                                        value={(field.value as AudioDefaultWaarde)?.volume || 0}
                                        onChange={(_, newValue) => field.onChange({
                                            ...(field.value as AudioDefaultWaarde),
                                            volume: newValue as number
                                        })}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={20}
                                    />
                                )}
                            />
                        </Box>
                        <FormControl fullWidth>
                            <InputLabel>Standaard playlist</InputLabel>
                            <Controller
                                name="defaultWaarde"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={(field.value as AudioDefaultWaarde)?.playlist || 'classic'}
                                        onChange={(e) => field.onChange({
                                            ...(field.value as AudioDefaultWaarde),
                                            playlist: e.target.value
                                        })}
                                        label="Standaard playlist"
                                    >
                                        <MenuItem value="classic">Classic</MenuItem>
                                        <MenuItem value="rock">Rock</MenuItem>
                                        <MenuItem value="jazz">Jazz</MenuItem>
                                        <MenuItem value="electronic">Electronic</MenuItem>
                                        <MenuItem value="pop">Pop</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Standaard Waarden
            </Typography>
            {renderDefaultWaardeFields()}
        </Box>
    );
};