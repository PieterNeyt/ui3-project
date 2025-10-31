import {
    Box,
    Typography,
    Card,
    CardContent,
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';
import { useDeviceStatistics } from '../../hooks/useLogging';

interface StatisticsChartsProps {
    type?: 'temperature' | 'activity' | 'all';
    compact?: boolean;
}

export const StatisticsCharts = ({
                                                                      type = 'all',
                                                                      compact = false
                                                                  }:StatisticsChartsProps) => {
    const { data: statistics, isLoading } = useDeviceStatistics();

    if (isLoading) {
        return <Typography>Laden...</Typography>;
    }

    if (!statistics) {
        return <Typography>Geen data beschikbaar</Typography>;
    }

    const renderTemperatureChart = () => (
        <Card sx={{ height: compact ? 300 : 400 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Temperatuur Verloop (24u)
                </Typography>
                <ResponsiveContainer width="100%" height={compact ? 200 : 300}>
                    <LineChart data={statistics.temperatureHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={(value) => new Date(value).getHours() + 'u'}
                        />
                        <YAxis domain={[15, 25]} />
                        <Tooltip
                            labelFormatter={(value) => `Uur: ${new Date(value).getHours()}u`}
                            formatter={(value: number) => [`${value}°C`, 'Temperatuur']}
                        />
                        <Line
                            type="monotone"
                            dataKey="averageTemperature"
                            stroke="#ff6b35"
                            strokeWidth={2}
                            name="Gemiddelde temperatuur"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );

    const renderActivityChart = () => (
        <Card sx={{ height: compact ? 300 : 400 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Activiteit per Uur
                </Typography>
                <ResponsiveContainer width="100%" height={compact ? 200 : 300}>
                    <BarChart data={statistics.deviceActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="activityCount" fill="#1976d2" name="Aantal wijzigingen" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );

    const renderMostSwitchedLights = () => (
        <Card sx={{ height: compact ? 300 : 400 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Meest Geschakelde Lampen
                </Typography>
                <ResponsiveContainer width="100%" height={compact ? 200 : 300}>
                    <BarChart
                        data={statistics.mostSwitchedLights.slice(0, 8)}
                        layout="vertical"
                        margin={{ left: 100 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                            type="category"
                            dataKey="deviceName"
                            width={90}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip formatter={(value: number) => [value, 'Aantal schakelingen']} />
                        <Bar dataKey="switchCount" fill="#ffd700" name="Schakelingen" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );

    if (compact) {
        switch (type) {
            case 'temperature':
                return renderTemperatureChart();
            case 'activity':
                return renderActivityChart();
            default:
                return renderTemperatureChart();
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3
            }}>
                {renderTemperatureChart()}
                {renderActivityChart()}
            </Box>
            <Box>
                {renderMostSwitchedLights()}
            </Box>
        </Box>
    );
};