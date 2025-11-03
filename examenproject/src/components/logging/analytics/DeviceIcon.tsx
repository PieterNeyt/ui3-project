import { Lightbulb, Thermostat, Lock, VolumeUp, TrendingUp } from '@mui/icons-material';

export const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
        case 'licht': return <Lightbulb />;
        case 'verwarming': return <Thermostat />;
        case 'deurslot': return <Lock />;
        case 'audio': return <VolumeUp />;
        default: return <TrendingUp />;
    }
};