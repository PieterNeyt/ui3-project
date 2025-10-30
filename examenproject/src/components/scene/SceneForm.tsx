import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Typography,
    Box,
    IconButton,
    Stack,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Slider,
    Alert,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useDevices } from '../../hooks/useDevices';
import { usePlaylists } from '../../hooks/useDevices';
import { useAuth } from '../../context/useAuth'; // Import useAuth
import type { Scene, SceneFormData, SceneControl } from '../../types/scene';
import type { DeviceType, DeviceValue, LightValue, HeatingValue, DoorLockValue, AudioValue } from '../../types/device';

interface SceneFormProps {
    open: boolean;
    scene?: Scene | null;
    onSave: (sceneData: SceneFormData) => void;
    onClose: () => void;
}

interface DeviceField {
    name: string;
    type: 'select' | 'number' | 'boolean' | 'text';
    options?: string[];
    min?: number;
    max?: number;
}

type DeviceValueByType<T extends DeviceType> =
    T extends 'licht' ? LightValue :
        T extends 'verwarming' ? HeatingValue :
            T extends 'deurslot' ? DoorLockValue :
                T extends 'audio' ? AudioValue :
                    never;

export const SceneForm: React.FC<SceneFormProps> = ({
                                                        open,
                                                        scene,
                                                        onSave,
                                                        onClose,
                                                    }) => {
    const { isAdmin } = useAuth();
    const { data: devices = [], isLoading: devicesLoading } = useDevices();
    const { data: playlists = [] } = usePlaylists();

    // Standaard isGlobal op false voor gebruikers, true voor admin bij nieuwe scenes
    const defaultIsGlobal = isAdmin() && !scene;

    const [formData, setFormData] = useState<SceneFormData>({
        naam: '',
        controls: [],
        image: '',
        omschrijving: '',
        isGlobal: defaultIsGlobal,
    });

    useEffect(() => {
        if (scene) {
            // Bij bewerken: behoud de bestaande isGlobal waarde
            setFormData({
                naam: scene.naam,
                controls: scene.controls,
                image: scene.image || '',
                omschrijving: scene.omschrijving || '',
                isGlobal: scene.isGlobal,
            });
        } else {

            const newIsGlobal = isAdmin();
            setFormData({
                naam: '',
                controls: [],
                image: '',
                omschrijving: '',
                isGlobal: newIsGlobal,
            });
        }
    }, [scene, open, isAdmin]);

    const handleAddControl = (): void => {
        setFormData(prev => ({
            ...prev,
            controls: [...prev.controls, { deviceId: '', waarde: {} } as SceneControl],
        }));
    };

    const handleRemoveControl = (index: number): void => {
        setFormData(prev => ({
            ...prev,
            controls: prev.controls.filter((_, i) => i !== index),
        }));
    };

    const handleValueChange = <T extends DeviceType>(
        index: number,
        _deviceType: T,
        field: keyof DeviceValueByType<T>,
        value: string | number | boolean
    ): void => {
        setFormData(prev => ({
            ...prev,
            controls: prev.controls.map((control, i) =>
                i === index
                    ? {
                        ...control,
                        waarde: {
                            ...control.waarde,
                            [field]: value
                        } as DeviceValue,
                    }
                    : control
            ),
        }));
    };

    const getDeviceValueFields = (deviceType: DeviceType): DeviceField[] => {
        switch (deviceType) {
            case 'licht':
                return [
                    { name: 'on_off', type: 'select', options: ['on', 'off'] },
                    { name: 'brightness', type: 'number', min: 0, max: 100 },
                ];
            case 'verwarming':
                return [{ name: 'temperature', type: 'number', min: 10, max: 30 }];
            case 'deurslot':
                return [{ name: 'locked', type: 'boolean' }];
            case 'audio':
                return [
                    { name: 'volume', type: 'number', min: 0, max: 100 },
                    { name: 'playlist', type: 'select', options: playlists.map(p => p.naam) },
                ];
            default:
                return [];
        }
    };

    const getDefaultDeviceValue = (deviceType: DeviceType): DeviceValue => {
        switch (deviceType) {
            case 'licht':
                return { on_off: 'on', brightness: 50 };
            case 'verwarming':
                return { temperature: 20 };
            case 'deurslot':
                return { locked: false };
            case 'audio':
                return { volume: 50, playlist: playlists[0]?.naam || 'classic' };
            default:
                return {} as DeviceValue;
        }
    };

    const handleDeviceSelection = (index: number, deviceId: string): void => {
        const selectedDevice = devices.find(d => d.id === deviceId);
        if (!selectedDevice) return;

        const newWaarde: DeviceValue = getDefaultDeviceValue(selectedDevice.type);

        setFormData(prev => ({
            ...prev,
            controls: prev.controls.map((control, i) =>
                i === index
                    ? { ...control, deviceId, waarde: newWaarde }
                    : control
            ),
        }));
    };

    const handleSubmit = (): void => {
        if (!formData.naam.trim()) {
            alert('Scene naam is verplicht');
            return;
        }

        if (formData.controls.length === 0) {
            alert('Minstens één control is vereist');
            return;
        }

        const hasEmptyDevice = formData.controls.some(control => !control.deviceId);
        if (hasEmptyDevice) {
            alert('Alle controls moeten een device hebben geselecteerd');
            return;
        }

        // Voor gebruikers: forceer isGlobal op false
        const finalFormData = !isAdmin()
            ? { ...formData, isGlobal: false }
            : formData;

        onSave(finalFormData);
    };

    const renderFieldInput = (
        field: DeviceField,
        control: SceneControl,
        index: number,
        deviceType: DeviceType
    ): React.ReactNode => {
        const value = (control.waarde as Record<string, string | number | boolean>)[field.name] || '';

        const handleFieldChange = (newValue: string | number | boolean) => {
            handleValueChange(index, deviceType, field.name as keyof DeviceValueByType<typeof deviceType>, newValue);
        };

        switch (field.type) {
            case 'select':
                return (
                    <FormControl fullWidth>
                        <InputLabel>{field.name}</InputLabel>
                        <Select
                            value={value}
                            label={field.name}
                            onChange={(e) => handleFieldChange(e.target.value)}
                        >
                            {field.options?.map(option => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );

            case 'boolean':
                return (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={Boolean(value)}
                                onChange={(e) => handleFieldChange(e.target.checked)}
                            />
                        }
                        label={field.name}
                    />
                );

            case 'number':
                return (
                    <Box>
                        <Typography gutterBottom>
                            {field.name}: {value}
                        </Typography>
                        <Slider
                            value={typeof value === 'number' ? value : field.min ?? 0}
                            onChange={(_, newValue) => handleFieldChange(newValue as number)}
                            min={field.min}
                            max={field.max}
                            step={1}
                            valueLabelDisplay="auto"
                            marks
                        />
                    </Box>
                );

            case 'text':
                return (
                    <TextField
                        type="text"
                        label={field.name}
                        value={value}
                        onChange={(e) => handleFieldChange(e.target.value)}
                        fullWidth
                    />
                );

            default:
                return null;
        }
    };

    // Bepaal of de gebruiker isGlobal mag wijzigen
    const canModifyGlobal = isAdmin() && (!scene || scene.isGlobal);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {scene ? 'Scene Bewerken' : 'Nieuwe Scene Aanmaken'}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Scene Naam"
                        value={formData.naam}
                        onChange={(e) => setFormData(prev => ({ ...prev, naam: e.target.value }))}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Omschrijving"
                        value={formData.omschrijving}
                        onChange={(e) => setFormData(prev => ({ ...prev, omschrijving: e.target.value }))}
                        fullWidth
                        multiline
                        rows={2}
                    />

                    <TextField
                        label="Afbeelding URL"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        fullWidth
                        placeholder="https://example.com/image.jpg"
                    />

                    {/* Alleen tonen voor admin bij nieuwe scenes of bij bewerken van globale scenes */}
                    {canModifyGlobal && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.isGlobal}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isGlobal: e.target.checked }))}
                                    disabled={scene ? scene.isGlobal : false} // Altijd een boolean
                                />
                            }
                            label="Globale Scene (zichtbaar voor alle gebruikers)"
                        />
                    )}


                    {/* Info berichten */}
                    {!isAdmin() && (
                        <Alert severity="info">
                            <Typography variant="body2">
                                <strong>Je maakt een persoonlijke scene aan.</strong>
                                <br />
                                Deze scene is alleen zichtbaar voor jou en kan niet gekoppeld worden aan tijdsloten.
                            </Typography>
                        </Alert>
                    )}

                    {isAdmin() && scene && scene.isGlobal && (
                        <Alert severity="warning">
                            <Typography variant="body2">
                                <strong>Dit is een globale scene.</strong>
                                <br />
                                Wijzigingen zijn zichtbaar voor alle gebruikers.
                            </Typography>
                        </Alert>
                    )}

                    {isAdmin() && !scene && (
                        <Alert severity="info">
                            <Typography variant="body2">
                                Als admin kun je kiezen tussen een <strong>globale scene</strong> (zichtbaar voor alle gebruikers)
                                of een <strong>persoonlijke scene</strong> (alleen zichtbaar voor jou).
                            </Typography>
                        </Alert>
                    )}

                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Devices</Typography>
                            <Button
                                startIcon={<Add />}
                                onClick={handleAddControl}
                                disabled={devicesLoading}
                                variant="outlined"
                            >
                                Device Toevoegen
                            </Button>
                        </Box>

                        {formData.controls.length === 0 && (
                            <Alert severity="info">
                                Voeg minstens één device toe aan je scene.
                            </Alert>
                        )}

                        <Stack spacing={2}>
                            {formData.controls.map((control, index) => {
                                const selectedDevice = devices.find(d => d.id === control.deviceId);

                                return (
                                    <Box
                                        key={index}
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
                                                onClick={() => handleRemoveControl(index)}
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
                                                    onChange={(e) => handleDeviceSelection(index, e.target.value)}
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
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    gap: 2,
                                                    flexWrap: 'wrap'
                                                }}>
                                                    {getDeviceValueFields(selectedDevice.type).map(field => (
                                                        <Box
                                                            key={field.name}
                                                            sx={{
                                                                minWidth: 200,
                                                                flex: '1 1 200px'
                                                            }}
                                                        >
                                                            {renderFieldInput(field, control, index, selectedDevice.type)}
                                                        </Box>
                                                    ))}
                                                </Box>
                                            )}
                                        </Stack>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Annuleren</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={devicesLoading}
                    sx={{ minWidth: 120 }}
                >
                    {scene ? 'Bijwerken' : 'Aanmaken'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};