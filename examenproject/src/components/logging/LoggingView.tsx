import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Container,
    Card,
    CardContent,
} from '@mui/material';
import { Timeline, Analytics, BarChart, ShowChart } from '@mui/icons-material';
import { DeviceChangeLogs } from './DeviceChangeLogs';
import { StatisticsCharts } from './StatisticsCharts';
import { DeviceStatistics } from './DeviceStatistics';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`logging-tabpanel-${index}`}
            aria-labelledby={`logging-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
};

export const LoggingView: React.FC = () => {
    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <Container sx={{ mt: 12, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Logging & Analytics
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Monitor wijzigingen aan controls en bekijk interessante data
                </Typography>
            </Box>

            <Paper sx={{ width: '100%' }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab
                        icon={<Timeline />}
                        label="Wijzigingen Log"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<BarChart />}
                        label="Statistieken"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<ShowChart />}
                        label="Grafieken"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<Analytics />}
                        label="Overzicht"
                        iconPosition="start"
                    />
                </Tabs>

                <TabPanel value={currentTab} index={0}>
                    <DeviceChangeLogs />
                </TabPanel>

                <TabPanel value={currentTab} index={1}>
                    <DeviceStatistics />
                </TabPanel>

                <TabPanel value={currentTab} index={2}>
                    <StatisticsCharts />
                </TabPanel>

                <TabPanel value={currentTab} index={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 3
                        }}>
                            <Card sx={{ flex: 1 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Meest Geschakelde Lampen
                                    </Typography>
                                    <DeviceStatistics type="mostSwitchedLights" />
                                </CardContent>
                            </Card>
                            <Card sx={{ flex: 1 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Temperatuur Verloop
                                    </Typography>
                                    <StatisticsCharts type="temperature" compact />
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </TabPanel>
            </Paper>
        </Container>
    );
};