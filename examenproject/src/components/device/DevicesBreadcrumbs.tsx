import { Breadcrumbs, Typography, Link } from '@mui/material';
import { Home } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router';
import type { Room } from '../../types/room.ts';
import type {Floor} from "../../types/floor.ts";

interface DevicesBreadcrumbsProps {
    currentFloor: Floor;
    currentRoom: Room;
}

export const DevicesBreadcrumbs = ({ currentFloor, currentRoom }: DevicesBreadcrumbsProps) => {
    return (
        <Breadcrumbs sx={{ mb: 3 }}>
            <Link component={RouterLink} to="/" color="inherit" underline="hover">
                <Home sx={{ mr: 0.5 }} fontSize="inherit" />
                Home
            </Link>
            <Link component={RouterLink} to="/floors" color="inherit" underline="hover">
                Verdiepingen
            </Link>
            <Link
                component={RouterLink}
                to={`/floors/${currentFloor.id}/rooms`}
                color="inherit"
                underline="hover"
            >
                {currentFloor.naam}
            </Link>
            <Typography color="text.primary">Domotica - {currentRoom.naam}</Typography>
        </Breadcrumbs>
    );
};