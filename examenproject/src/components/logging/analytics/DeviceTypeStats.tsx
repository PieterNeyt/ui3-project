import { Card, CardContent, Typography } from '@mui/material';
import { PieChart } from '@mui/icons-material';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface DeviceTypeStatsProps {
    stats: Array<{
        deviceType: string;
        count: number;
    }>;
}

export const DeviceTypeStats = ({ stats }: DeviceTypeStatsProps) => {
    return (
        <Card sx={{ height: 300 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PieChart color="info" />
                    Device Type Verdeling
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                        <Pie
                            data={stats}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ deviceType, count }) => `${deviceType}: ${count}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                        >
                            {stats.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </RechartsPieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};