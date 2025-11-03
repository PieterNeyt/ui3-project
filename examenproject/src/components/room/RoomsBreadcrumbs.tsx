import { Breadcrumbs, Typography, Link } from '@mui/material';
import { Home } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router';
import type { Floor } from '../../types/floor.ts';

interface RoomsBreadcrumbsProps {
    currentFloor: Floor;
}

export const RoomsBreadcrumbs = ({ currentFloor }: RoomsBreadcrumbsProps) => {
    return (
        <Breadcrumbs sx={{ mb: 3 }}>
            <Link component={RouterLink} to="/" color="inherit" underline="hover">
                <Home sx={{ mr: 0.5 }} fontSize="inherit" />
                Home
            </Link>
            <Link component={RouterLink} to="/floors" color="inherit" underline="hover">
                Verdiepingen
            </Link>
            <Typography color="text.primary">{currentFloor.naam}</Typography>
        </Breadcrumbs>
    );
};