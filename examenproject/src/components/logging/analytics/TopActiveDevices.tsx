import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon, Chip, Avatar, Box } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import { getDeviceIcon } from './DeviceIcon.tsx';

interface TopActiveDevicesProps {
    devices: Array<{
        deviceId: string;
        deviceName: string;
        type: string;
        roomName: string;
        changeCount: number;
    }>;
}

export const TopActiveDevices = ({ devices }: TopActiveDevicesProps) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp color="primary" />
                    Meest Actieve Devices
                </Typography>
                <List dense>
                    {devices.slice(0, 5).map((device) => (
                        <ListItem key={device.deviceId} divider>
                            <ListItemIcon>
                                <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                                    {getDeviceIcon(device.type)}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText
                                primary={device.deviceName}
                                secondary={
                                    <Box>
                                        <Typography variant="caption" display="block">
                                            {device.type} • {device.roomName}
                                        </Typography>
                                    </Box>
                                }
                            />
                            <Chip
                                label={`${device.changeCount} wijzigingen`}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};