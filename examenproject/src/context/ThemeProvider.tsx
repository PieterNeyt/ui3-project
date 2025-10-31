import  { useState, useMemo, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

import { ThemeContext, type ThemeContextType } from './ThemeContext';

interface ThemeProviderProps {
    children: ReactNode;
}

// Helper functie om systeem preference te detecteren
const getSystemThemePreference = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Fallback
};

export const CustomThemeProvider = ({ children }:ThemeProviderProps) => {
    // Standaard is het systeemthema van de gebruiker
    const [mode, setMode] = useState<'light' | 'dark'>(() => {
        const savedMode = localStorage.getItem('themeMode') as string;

        if (savedMode === 'light' || savedMode === 'dark') {
            return savedMode;
        }

        return getSystemThemePreference();
    });

    const toggleColorMode = () => {
        setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('themeMode', newMode);
            return newMode;
        });
    };

    const handleSetMode = (newMode: 'light' | 'dark') => {
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
    };

    const safeMode: 'light' | 'dark' = mode === 'light' ? 'light' : 'dark';

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: safeMode,
                    primary: {
                        main: safeMode === 'light' ? '#1976d2' : '#90caf9',
                    },
                    secondary: {
                        main: safeMode === 'light' ? '#dc004e' : '#f48fb1',
                    },
                    background: {
                        default: safeMode === 'light' ? '#f5f5f5' : '#121212',
                        paper: safeMode === 'light' ? '#ffffff' : '#1e1e1e',
                    },
                },
                typography: {
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                },
                components: {
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundColor: safeMode === 'light' ? '#1976d2' : '#1e1e1e',
                            },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                backgroundColor: safeMode === 'light' ? '#ffffff' : '#1e1e1e',
                            },
                        },
                    },
                },
            }),
        [safeMode]
    );

    const contextValue: ThemeContextType = useMemo(() => ({
        mode: safeMode,
        toggleColorMode,
        setMode: handleSetMode,
    }), [safeMode]);

    return (
        <ThemeContext.Provider value={contextValue}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};