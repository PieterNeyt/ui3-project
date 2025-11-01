import { Box, Button, CircularProgress } from '@mui/material';

interface NavbarLoginButtonsProps {
    loginAsUser: () => void;
    loginAsAdmin: () => void;
    loading: boolean;
}

export function NavbarLoginButtons({ loginAsUser, loginAsAdmin, loading }: NavbarLoginButtonsProps) {
    return (
        <Box display="flex" gap={1}>
            <Button variant="contained" color="info" onClick={loginAsUser} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Log in als Gebruiker'}
            </Button>
            <Button variant="contained" color="error" onClick={loginAsAdmin} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Log in als Admin'}
            </Button>
        </Box>
    );
}
