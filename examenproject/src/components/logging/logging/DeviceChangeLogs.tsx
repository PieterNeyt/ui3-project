import { useState, useMemo } from 'react';
import { Box, Alert } from '@mui/material';
import { useDeviceChangeLogs } from '../../../hooks/useLogging.ts';
import type { LogFilter } from '../../../types/logging.ts';
import { format } from 'date-fns';
import { DeviceChangeLogsFilters } from './DeviceChangeLogsFilters.tsx';
import { DeviceChangeLogsTable } from './DeviceChangeLogsTable.tsx';

export const DeviceChangeLogs = () => {
    const [filters, setFilters] = useState<LogFilter>({
        startDate: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
    });

    const { data: logs, isLoading, error, refetch } = useDeviceChangeLogs(filters);

    const handleFilterChange = (key: keyof LogFilter, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value || undefined }));
    };

    const filteredLogs = useMemo(() => {
        if (!logs) return [];

        return logs.filter(log => {
            const logDate = new Date(log.timestamp);
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate + 'T23:59:59') : null;

            if (startDate && logDate < startDate) return false;
            if (endDate && logDate > endDate) return false;
            if (filters.deviceType && log.deviceType !== filters.deviceType) return false;
            if (filters.changeType && log.changeType !== filters.changeType) return false;

            return true;
        });
    }, [logs, filters]);

    if (error) {
        return <Alert severity="error">Fout bij het laden van logs</Alert>;
    }

    return (
        <Box>
            <DeviceChangeLogsFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onRefresh={refetch}
                isLoading={isLoading}
            />
            <DeviceChangeLogsTable
                logs={filteredLogs}
                isLoading={isLoading}
            />
        </Box>
    );
};