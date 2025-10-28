// src/components/Navbar.tsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useAuth } from '../../context/useAuth';

const Navbar: React.FC = () => {
    const { user, loginAsUser, loginAsAdmin, logout, isLoggedIn } = useAuth();

    return (
        <AppBar position="fixed" color="primary" elevation={3}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">SmartNest</Typography>

                {isLoggedIn() ? (
                    <Box display="flex" alignItems="center" gap={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography>{user?.username}</Typography>
                            <Chip
                                label={user?.role === 'admin' ? 'Admin' : 'Gebruiker'}
                                color={user?.role === 'admin' ? 'error' : 'info'}
                                size="small"
                            />
                        </Box>
                        <Button variant="outlined" color="inherit" onClick={logout}>
                            Uitloggen
                        </Button>
                    </Box>
                ) : (
                    <Box display="flex" gap={1}>
                        <Button variant="contained" color="info" onClick={loginAsUser}>
                            Log in als Gebruiker
                        </Button>
                        <Button variant="contained" color="error" onClick={loginAsAdmin}>
                            Log in als Admin
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
