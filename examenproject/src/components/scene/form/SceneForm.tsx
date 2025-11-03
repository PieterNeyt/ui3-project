import  { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
} from '@mui/material';
import { useDevices } from '../../../hooks/useDevices.ts';
import { usePlaylists } from '../../../hooks/useDevices.ts';
import { useAuth } from '../../../hooks/useAuth.ts';
import type { Scene, SceneFormData, SceneControl } from '../../../types/scene.ts';
import type {DeviceValue, Playlist} from '../../../types/device.ts';
import { SceneFormHeader } from './SceneFormHeader.tsx';
import { SceneFormControls } from './SceneFormControls.tsx';
import { SceneInfoAlerts } from './SceneInfoAlerts.tsx';

interface SceneFormProps {
    open: boolean;
    scene?: Scene | null;
    onSave: (sceneData: SceneFormData) => void;
    onClose: () => void;
}

const createEmptyControl = (): SceneControl => ({
    deviceId: '',
    waarde: {} as DeviceValue
});

export const SceneForm = ({
                                                        open,
                                                        scene,
                                                        onSave,
                                                        onClose,
                                                    }: SceneFormProps) => {
    const { isAdmin, user } = useAuth();
    const { data: devices = [], isLoading: devicesLoading } = useDevices();
    const { data: playlists = [] } = usePlaylists();

    const defaultIsGlobal = isAdmin() && !scene;

    const [formData, setFormData] = useState<SceneFormData>({
        naam: '',
        controls: [],
        image: '',
        omschrijving: '',
        isGlobal: defaultIsGlobal,
        userId: user?.id as string
    });

    useEffect(() => {
        if (scene) {
            setFormData({
                naam: scene.naam,
                controls: scene.controls,
                image: scene.image || '',
                omschrijving: scene.omschrijving || '',
                isGlobal: scene.isGlobal,
                userId: user?.id as string
            });
        } else {
            const newIsGlobal = isAdmin();
            setFormData({
                naam: '',
                controls: [],
                image: '',
                omschrijving: '',
                isGlobal: newIsGlobal,
                userId: user?.id as string
            });
        }
    }, [scene, open, isAdmin, user]);

    const handleAddControl = (): void => {
        setFormData(prev => ({
            ...prev,
            controls: [...prev.controls, createEmptyControl()],
        }));
    };

    const handleRemoveControl = (index: number): void => {
        setFormData(prev => ({
            ...prev,
            controls: prev.controls.filter((_, i) => i !== index),
        }));
    };

    const handleDeviceSelection = (index: number, deviceId: string): void => {
        const selectedDevice = devices.find(d => d.id === deviceId);
        if (!selectedDevice) return;

        const newWaarde = getDefaultDeviceValue(selectedDevice.type, playlists);

        setFormData(prev => ({
            ...prev,
            controls: prev.controls.map((control, i) =>
                i === index
                    ? {
                        ...control,
                        deviceId,
                        waarde: newWaarde as DeviceValue
                    }
                    : control
            ),
        }));
    };

    const handleValueChange = (
        index: number,
        _deviceType: string,
        field: string,
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

        const finalFormData = !isAdmin()
            ? { ...formData, isGlobal: false }
            : formData;

        onSave(finalFormData);
    };

    const canModifyGlobal = isAdmin() && (!scene || scene.isGlobal);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {scene ? 'Scene Bewerken' : 'Nieuwe Scene Aanmaken'}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <SceneFormHeader
                        formData={formData}
                        onFormDataChange={setFormData}
                        canModifyGlobal={canModifyGlobal}
                        scene={scene}
                    />

                    <SceneInfoAlerts
                        isAdmin={isAdmin()}
                        scene={scene}
                    />

                    <SceneFormControls
                        controls={formData.controls}
                        devices={devices}
                        playlists={playlists}
                        devicesLoading={devicesLoading}
                        onAddControl={handleAddControl}
                        onRemoveControl={handleRemoveControl}
                        onDeviceSelection={handleDeviceSelection}
                        onValueChange={handleValueChange}
                    />
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

// Helper functie
const getDefaultDeviceValue = (deviceType: string, playlists: Playlist[]): DeviceValue => {
    switch (deviceType) {
        case 'licht':
            return { on_off: 'on', brightness: 50 } as DeviceValue;
        case 'verwarming':
            return { temperature: 20 } as DeviceValue;
        case 'deurslot':
            return { locked: false } as DeviceValue;
        case 'audio':
            return {
                volume: 50,
                playlist: playlists[0]?.naam || 'classic'
            } as DeviceValue;
        default:
            return {} as DeviceValue;
    }
};