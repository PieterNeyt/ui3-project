import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAuth } from '../../hooks/useAuth.tsx';
import { NavbarLinks } from './NavbarLinks';
import { NavbarThemeToggle } from './NavbarThemeToggle';
import { NavbarUserSection } from './NavbarUserSection';
import { NavbarLoginButtons } from './NavbarLoginButtons';

export function Navbar() {
    const { user, loginAsUser, loginAsAdmin, logout, isLoggedIn, loading } = useAuth();

    return (
        <AppBar position="fixed" elevation={3}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                    variant="h6"
                    component="a"
                    href="/"
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                    SmartNest
                </Typography>

                {isLoggedIn() && <NavbarLinks user={user} />}

                <Box display="flex" alignItems="center" gap={2}>
                    <NavbarThemeToggle />

                    {isLoggedIn() ? (
                        <NavbarUserSection user={user!} logout={logout} />
                    ) : (
                        <NavbarLoginButtons
                            loginAsUser={loginAsUser}
                            loginAsAdmin={loginAsAdmin}
                            loading={loading}
                        />
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
