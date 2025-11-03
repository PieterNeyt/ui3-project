import { Box, Card, CardContent, Typography } from '@mui/material';
import { TrendingUp, CalendarToday, Lightbulb, Room } from '@mui/icons-material';
import type { DeviceStatistics } from '../../../types/statistics.ts';

interface SummaryCardsProps {
    statistics: DeviceStatistics;
}

export const SummaryCards = ({ statistics }: SummaryCardsProps) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3,
            flexWrap: 'wrap'
        }}>
            <Card sx={{
                textAlign: 'center',
                bgcolor: 'primary.main',
                color: 'white',
                flex: '1 1 200px',
                minWidth: 150
            }}>
                <CardContent>
                    <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4">{statistics.totalChanges}</Typography>
                    <Typography variant="body2">Totale Wijzigingen</Typography>
                </CardContent>
            </Card>
            <Card sx={{
                textAlign: 'center',
                bgcolor: 'success.main',
                color: 'white',
                flex: '1 1 200px',
                minWidth: 150
            }}>
                <CardContent>
                    <CalendarToday sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4">{statistics.todayChanges}</Typography>
                    <Typography variant="body2">Vandaag</Typography>
                </CardContent>
            </Card>
            <Card sx={{
                textAlign: 'center',
                bgcolor: 'warning.main',
                color: 'white',
                flex: '1 1 200px',
                minWidth: 150
            }}>
                <CardContent>
                    <Lightbulb sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4">{statistics.mostSwitchedLights.length}</Typography>
                    <Typography variant="body2">Actieve Lampen</Typography>
                </CardContent>
            </Card>
            <Card sx={{
                textAlign: 'center',
                bgcolor: 'info.main',
                color: 'white',
                flex: '1 1 200px',
                minWidth: 150
            }}>
                <CardContent>
                    <Room sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4">{statistics.mostActiveRooms.length}</Typography>
                    <Typography variant="body2">Actieve Kamers</Typography>
                </CardContent>
            </Card>
        </Box>
    );
};