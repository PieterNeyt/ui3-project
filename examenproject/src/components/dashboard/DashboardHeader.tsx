import { Box, Typography } from '@mui/material';

export const DashboardHeader = () => {
    return (
        <Box mb={4}>
            <Typography variant="h4" component="h1" gutterBottom>
                Domotica Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Bekijk en beheer al je domotica controls op één plek
            </Typography>
        </Box>
    );
};