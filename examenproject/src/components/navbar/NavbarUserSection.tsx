import { Box, Typography, Chip, Button } from '@mui/material';
import type { User } from '../../context/AuthContext';

interface NavbarUserSectionProps {
    user: User;
    logout: () => void;
}

export function NavbarUserSection({ user, logout }: NavbarUserSectionProps) {
    return (
        <Box display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center" gap={1}>
                <Typography>{user.username}</Typography>
                <Chip
                    label={user.role === 'admin' ? 'Admin' : 'Gebruiker'}
                    color={user.role === 'admin' ? 'error' : 'info'}
                    size="small"
                />
            </Box>
            <Button variant="outlined" color="inherit" onClick={logout}>
                Uitloggen
            </Button>
        </Box>
    );
}
