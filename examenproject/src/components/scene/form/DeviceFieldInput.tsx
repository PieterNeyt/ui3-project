import { Box } from '@mui/material';
import type { SceneControl } from '../../../types/scene.ts';
import { FieldInput } from './FieldInput.tsx';
import type {Playlist} from "../../../types/device.ts";

interface DeviceFieldInputProps {
    control: SceneControl;
    index: number;
    deviceType: string;
    playlists: Playlist[];
    onValueChange: (index: number, deviceType: string, field: string, value: string | number | boolean) => void;
}

export const DeviceFieldInput = ({
                                     control,
                                     index,
                                     deviceType,
                                     playlists,
                                     onValueChange,
                                 }: DeviceFieldInputProps) => {
    const getDeviceValueFields = () => {
        switch (deviceType) {
            case 'licht':
                return [
                    { name: 'on_off', type: 'select' as const, options: ['on', 'off'] },
                    { name: 'brightness', type: 'number' as const, min: 0, max: 100 },
                ];
            case 'verwarming':
                return [{ name: 'temperature', type: 'number' as const, min: 10, max: 30 }];
            case 'deurslot':
                return [{ name: 'locked', type: 'boolean' as const }];
            case 'audio':
                return [
                    { name: 'volume', type: 'number' as const, min: 0, max: 100 },
                    { name: 'playlist', type: 'select' as const, options: playlists.map(p => p.naam) },
                ];
            default:
                return [];
        }
    };

    const fields = getDeviceValueFields();

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            flexWrap: 'wrap'
        }}>
            {fields.map(field => (
                <Box
                    key={field.name}
                    sx={{
                        minWidth: 200,
                        flex: '1 1 200px'
                    }}
                >
                    <FieldInput
                        field={field}
                        control={control}
                        index={index}
                        deviceType={deviceType}
                        onValueChange={onValueChange}
                    />
                </Box>
            ))}
        </Box>
    );
};