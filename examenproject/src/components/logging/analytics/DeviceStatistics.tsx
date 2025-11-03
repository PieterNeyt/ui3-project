import { Box, LinearProgress, Typography } from '@mui/material';
import { useDeviceStatistics } from '../../../hooks/useLogging.ts';
import { SummaryCards } from './SummaryCards.tsx';
import { MostSwitchedLights } from './MostSwitchedLights.tsx';
import { TopActiveDevices } from './TopActiveDevices.tsx';
import { MostActiveRooms } from './MostActiveRooms.tsx';
import { DeviceTypeStats } from './DeviceTypeStats.tsx';
import { RecentActivity } from './RecentActivity.tsx';

interface DeviceStatisticsProps {
    type?: 'mostSwitchedLights' | 'topActiveDevices' | 'all' | 'summary';
}

export const DeviceStatistics = ({ type = 'all' }: DeviceStatisticsProps) => {
    const { data: statistics, isLoading } = useDeviceStatistics();

    if (isLoading) {
        return <LinearProgress />;
    }

    if (!statistics) {
        return <Typography>Geen statistieken beschikbaar</Typography>;
    }

    if (type === 'mostSwitchedLights') {
        return <MostSwitchedLights lights={statistics.mostSwitchedLights} />;
    }

    if (type === 'topActiveDevices') {
        return <TopActiveDevices devices={statistics.topActiveDevices} />;
    }

    if (type === 'summary') {
        return <SummaryCards statistics={statistics} />;
    }

    return (
        <Box>
            <SummaryCards statistics={statistics} />

            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                flexWrap: 'wrap'
            }}>
                <Box sx={{
                    flex: '1 1 400px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                }}>
                    <MostSwitchedLights lights={statistics.mostSwitchedLights} />
                    <MostActiveRooms rooms={statistics.mostActiveRooms} />
                </Box>

                <Box sx={{
                    flex: '1 1 400px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                }}>
                    <TopActiveDevices devices={statistics.topActiveDevices} />
                    <RecentActivity activity={statistics.recentActivity} />
                    <DeviceTypeStats stats={statistics.deviceTypeStats} />
                </Box>
            </Box>
        </Box>
    );
};