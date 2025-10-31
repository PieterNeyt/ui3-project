import React, { useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    TextField,
    MenuItem,
    Typography,
    Alert,
    IconButton,
    Tooltip,
} from '@mui/material';
import { FilterList, Refresh } from '@mui/icons-material';
import { useDeviceChangeLogs } from '../../hooks/useLogging';
import type { LogFilter, DeviceValue } from '../../types/logging';
import { format } from 'date-fns';

type ChangeTypeChipProps = {
    changeType: string;
};

const ChangeTypeChip = ({ changeType }: ChangeTypeChipProps) => {
    const getColor = (type: string) => {
        switch (type) {
            case 'created': return 'success';
            case 'updated': return 'primary';
            case 'deleted': return 'error';
            case 'state_changed': return 'warning';
            default: return 'default';
        }
    };

    const getLabel = (type: string) => {
        switch (type) {
            case 'created': return 'Aangemaakt';
            case 'updated': return 'Bijgewerkt';
            case 'deleted': return 'Verwijderd';
            case 'state_changed': return 'Status gewijzigd';
            default: return type;
        }
    };

    const color = getColor(changeType);

    return (
        <Chip
            label={getLabel(changeType)}
            color={color === 'default' ? undefined : color}
            size="small"
        />
    );
};

interface ValueDisplayProps {
    value: DeviceValue | undefined;
}

const ValueDisplay= ({ value }:ValueDisplayProps) => {
    if (!value) {
        return <Typography variant="body2">-</Typography>;
    }

    if (typeof value !== 'object') {
        return <Typography variant="body2">{String(value)}</Typography>;
    }

    return (
        <Box sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
            {Object.entries(value).map(([key, val]) => (
                <Box key={key}>
                    {key}: {String(val)}
                </Box>
            ))}
        </Box>
    );
};

export const DeviceChangeLogs= () => {
    const [filters, setFilters] = useState<LogFilter>({
        startDate: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
    });

    const { data: logs, isLoading, error, refetch } = useDeviceChangeLogs(filters);

    const handleFilterChange = (key: keyof LogFilter, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value || undefined }));
    };

    // Filter logs lokaal voor betere datum filtering
    const filteredLogs = React.useMemo(() => {
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
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' }
                }}>
                    <FilterList color="action" />

                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        width: '100%',
                        flexDirection: { xs: 'column', sm: 'row' }
                    }}>
                        <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label="Vanaf"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label="Tot"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            fullWidth
                            size="small"
                            select
                            label="Device Type"
                            value={filters.deviceType || ''}
                            onChange={(e) => handleFilterChange('deviceType', e.target.value)}
                        >
                            <MenuItem value="">Alle types</MenuItem>
                            <MenuItem value="licht">Licht</MenuItem>
                            <MenuItem value="verwarming">Verwarming</MenuItem>
                            <MenuItem value="deurslot">Deurslot</MenuItem>
                            <MenuItem value="audio">Audio</MenuItem>
                        </TextField>

                        <TextField
                            fullWidth
                            size="small"
                            select
                            label="Wijziging Type"
                            value={filters.changeType || ''}
                            onChange={(e) => handleFilterChange('changeType', e.target.value)}
                        >
                            <MenuItem value="">Alle wijzigingen</MenuItem>
                            <MenuItem value="created">Aangemaakt</MenuItem>
                            <MenuItem value="updated">Bijgewerkt</MenuItem>
                            <MenuItem value="deleted">Verwijderd</MenuItem>
                            <MenuItem value="state_changed">Status gewijzigd</MenuItem>
                        </TextField>

                        <Tooltip title="Vernieuwen">
                            <IconButton
                                onClick={() => refetch()}
                                disabled={isLoading}
                                sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                            >
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Tijd</TableCell>
                            <TableCell>Device</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Kamer</TableCell>
                            <TableCell>Wijziging</TableCell>
                            <TableCell>Oude Waarde</TableCell>
                            <TableCell>Nieuwe Waarde</TableCell>
                            <TableCell>Gebruiker</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    Laden...
                                </TableCell>
                            </TableRow>
                        ) : filteredLogs?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    Geen logs gevonden voor de geselecteerde periode
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLogs?.map((log) => (
                                <TableRow key={log.id} hover>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {format(new Date(log.timestamp), 'dd-MM-yyyy')}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {format(new Date(log.timestamp), 'HH:mm:ss')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="medium">
                                            {log.deviceName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={log.deviceType}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>{log.roomName}</TableCell>
                                    <TableCell>
                                        <ChangeTypeChip changeType={log.changeType} />
                                    </TableCell>
                                    <TableCell>
                                        <ValueDisplay value={log.oldValue} />
                                    </TableCell>
                                    <TableCell>
                                        <ValueDisplay value={log.newValue} />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {log.userName || 'Systeem'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};