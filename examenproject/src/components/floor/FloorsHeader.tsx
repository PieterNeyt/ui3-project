import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

interface FloorsHeaderProps {
    isAdmin: boolean;
    onAddFloor: () => void;
}

export const FloorsHeader = ({ isAdmin, onAddFloor }: FloorsHeaderProps) => {
    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
            sx={{
                pb: 1,
                gap: 2,
                width: '100%',
                maxWidth: 1200,
            }}
        >
            <Typography
                variant="h4"
                component="h1"
                color="text.primary"
                sx={{ fontWeight: 600 }}
            >
                Verdiepingen Beheren
            </Typography>

            {isAdmin && (
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={onAddFloor}
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    Nieuwe Verdieping
                </Button>
            )}
        </Box>
    );
};