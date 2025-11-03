import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon, Chip, Avatar } from '@mui/material';
import { Room } from '@mui/icons-material';
import type {RoomStatistic} from "../../../types/statistics.ts";

interface MostActiveRoomsProps {
    rooms: RoomStatistic[];
}

export const MostActiveRooms = ({ rooms }: MostActiveRoomsProps) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Room color="success" />
                    Meest Actieve Kamers
                </Typography>
                <List dense>
                    {rooms.slice(0, 5).map((room, index) => (
                        <ListItem key={room.roomName} divider>
                            <ListItemIcon>
                                <Avatar sx={{ bgcolor: 'success.light', width: 32, height: 32 }}>
                                    {index + 1}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText primary={room.roomName} />
                            <Chip
                                label={`${room.activityCount} activiteiten`}
                                color="success"
                                variant="outlined"
                                size="small"
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};