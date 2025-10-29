// src/components/navbar/Navbar.tsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Link as RouterLink } from 'react-router';
import { useAuth } from '../../context/useAuth';
import { useThemeContext } from '../../hooks/useThemeContext';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const Navbar: React.FC = () => {
    const { user, loginAsUser, loginAsAdmin, logout, isLoggedIn, isAdmin } = useAuth();
    const { mode, toggleColorMode } = useThemeContext();

    return (
        <AppBar position="fixed" elevation={3}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
                    SmartNest
                </Typography>

                {isLoggedIn() && (
                    <Box display="flex" gap={2}>
                        {isAdmin() && (
                            <Button color="inherit" component={RouterLink} to="/floors">
                                Verdiepingen
                            </Button>
                        )}
                    </Box>
                )}

                <Box display="flex" alignItems="center" gap={2}>
                    {/* Eenvoudige theme toggle */}
                    <Tooltip title={`Schakel naar ${mode === 'light' ? 'donkere' : 'lichte'} modus`}>
                        <IconButton color="inherit" onClick={toggleColorMode} sx={{ ml: 1 }}>
                            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Tooltip>

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
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;