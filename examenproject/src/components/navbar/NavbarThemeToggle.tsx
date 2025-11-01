import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeContext } from '../../hooks/useThemeContext';

export function NavbarThemeToggle() {
    const { mode, toggleColorMode } = useThemeContext();

    return (
        <Tooltip title={`Schakel naar ${mode === 'light' ? 'donkere' : 'lichte'} modus`}>
            <IconButton color="inherit" onClick={toggleColorMode}>
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
        </Tooltip>
    );
}
