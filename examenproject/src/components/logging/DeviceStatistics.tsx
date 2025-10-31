import {
    Box,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    LinearProgress,
    Avatar,
} from '@mui/material';
import {
    Lightbulb,
    Thermostat,
    Lock,
    VolumeUp,
    TrendingUp,
    Star,
    Room,
    PieChart,
    CalendarToday,
} from '@mui/icons-material';
import { useDeviceStatistics } from '../../hooks/useLogging';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface DeviceStatisticsProps {
    type?: 'mostSwitchedLights' | 'topActiveDevices' | 'all' | 'summary';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const DeviceStatistics = ({ type = 'all' }:DeviceStatisticsProps) => {
    const { data: statistics, isLoading } = useDeviceStatistics();

    if (isLoading) {
        return <LinearProgress />;
    }

    if (!statistics) {
        return <Typography>Geen statistieken beschikbaar</Typography>;
    }

    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType) {
            case 'licht': return <Lightbulb />;
            case 'verwarming': return <Thermostat />;
            case 'deurslot': return <Lock />;
            case 'audio': return <VolumeUp />;
            default: return <TrendingUp />;
        }
    };

    const renderMostSwitchedLights = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star color="warning" />
                    Meest Geschakelde Lampen
                </Typography>
                <List dense>
                    {statistics.mostSwitchedLights.slice(0, 5).map((light, index) => (
                        <ListItem key={light.deviceId} divider>
                            <ListItemIcon>
                                <Avatar sx={{ bgcolor: 'warning.light', width: 32, height: 32 }}>
                                    {index + 1}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText
                                primary={light.deviceName}
                                secondary={`Kamer: ${light.roomName}`}
                            />
                            <Chip
                                label={`${light.switchCount}×`}
                                color="warning"
                                variant="outlined"
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );

    const renderTopActiveDevices = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp color="primary" />
                    Meest Actieve Devices
                </Typography>
                <List dense>
                    {statistics.topActiveDevices.slice(0, 5).map((device) => (
                        <ListItem key={device.deviceId} divider>
                            <ListItemIcon>
                                <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                                    {getDeviceIcon(device.type)}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText
                                primary={device.deviceName}
                                secondary={
                                    <Box>
                                        <Typography variant="caption" display="block">
                                            {device.type} • {device.roomName}
                                        </Typography>
                                    </Box>
                                }
                            />
                            <Chip
                                label={`${device.changeCount} wijzigingen`}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );

    const renderMostActiveRooms = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Room color="success" />
                    Meest Actieve Kamers
                </Typography>
                <List dense>
                    {statistics.mostActiveRooms.slice(0, 5).map((room, index) => (
                        <ListItem key={room.roomName} divider>
                            <ListItemIcon>
                                <Avatar sx={{ bgcolor: 'success.light', width: 32, height: 32 }}>
                                    {index + 1}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText primary={room.roomName} />
                            <Chip
                                label={`${room.activityCount} activiteiten`}
                                color="success"
                                variant="outlined"
                                size="small"
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );

    const renderChangeTypeDistribution = () => (
        <Card sx={{ height: 300 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PieChart color="secondary" />
                    Wijzigingstype Verdeling
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                        <Pie
                            data={statistics.changeTypeDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ changeType, count }) => `${changeType}: ${count}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                        >
                            {statistics.changeTypeDistribution.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </RechartsPieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );

    const renderDeviceTypeStats = () => (
        <Card sx={{ height: 300 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PieChart color="info" />
                    Device Type Verdeling
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                        <Pie
                            data={statistics.deviceTypeStats}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ deviceType, count }) => `${deviceType}: ${count}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                        >
                            {statistics.deviceTypeStats.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </RechartsPieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );

    const renderRecentActivity = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday color="primary" />
                    Recente Activiteit (7 dagen)
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={statistics.recentActivity}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="activityCount" fill="#1976d2" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );

    const renderSummaryCards = () => (
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

    if (type === 'mostSwitchedLights') {
        return renderMostSwitchedLights();
    }

    if (type === 'topActiveDevices') {
        return renderTopActiveDevices();
    }

    if (type === 'summary') {
        return renderSummaryCards();
    }

    return (
        <Box>
            {renderSummaryCards()}

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
                    {renderMostSwitchedLights()}
                    {renderMostActiveRooms()}
                    {renderChangeTypeDistribution()}
                </Box>

                <Box sx={{
                    flex: '1 1 400px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                }}>
                    {renderTopActiveDevices()}
                    {renderRecentActivity()}
                    {renderDeviceTypeStats()}
                </Box>
            </Box>
        </Box>
    );
};