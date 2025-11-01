import { Box, Button } from '@mui/material';
import { Analytics } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router';
import type { User } from '../../context/AuthContext';

interface NavbarLinksProps {
    user?: User | null;
}

export function NavbarLinks({ user }: NavbarLinksProps) {
    return (
        <Box display="flex" gap={2}>
            <Button color="inherit" component={RouterLink} to="/dashboard">
                Dashboard
            </Button>
            <Button color="inherit" component={RouterLink} to="/floors">
                Verdiepingen
            </Button>
            <Button color="inherit" component={RouterLink} to="/scenes">
                Scenes
            </Button>
            {user?.role === 'admin' && (
                <Button color="inherit" component={RouterLink} to="/logging" startIcon={<Analytics />}>
                    Logging
                </Button>
            )}
        </Box>
    );
}
