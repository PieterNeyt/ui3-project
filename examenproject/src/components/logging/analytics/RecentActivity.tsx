import { Card, CardContent, Typography } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface RecentActivityProps {
    activity: Array<{
        date: string;
        activityCount: number;
    }>;
}

export const RecentActivity = ({ activity }: RecentActivityProps) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday color="primary" />
                    Recente Activiteit (7 dagen)
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={activity}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="activityCount" fill="#1976d2" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};