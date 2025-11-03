import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon, Chip, Avatar } from '@mui/material';
import { Star } from '@mui/icons-material';
import type {LightStatistic} from "../../../types/statistics.ts";

interface MostSwitchedLightsProps {
    lights: LightStatistic[];
}

export const MostSwitchedLights = ({ lights }: MostSwitchedLightsProps) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star color="warning" />
                    Meest Geschakelde Lampen
                </Typography>
                <List dense>
                    {lights.slice(0, 5).map((light, index) => (
                        <ListItem key={light.deviceId} divider>
                            <ListItemIcon>
                                <Avatar sx={{ bgcolor: 'warning.light', width: 32, height: 32 }}>
                                    {index + 1}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText
                                primary={light.deviceName}
                                secondary={`Kamer: ${light.roomName}`}
                            />
                            <Chip
                                label={`${light.switchCount}×`}
                                color="warning"
                                variant="outlined"
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};