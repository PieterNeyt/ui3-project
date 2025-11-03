import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Typography,
} from '@mui/material';
import { format } from 'date-fns';
import type { DeviceChangeLog } from '../../../types/logging.ts';
import { ValueDisplay } from './ValueDisplay.tsx';

interface DeviceChangeLogsTableProps {
    logs: DeviceChangeLog[];
    isLoading: boolean;
}

export const DeviceChangeLogsTable = ({ logs, isLoading }: DeviceChangeLogsTableProps) => {
    return (
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
                    ) : logs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                Geen logs gevonden voor de geselecteerde periode
                            </TableCell>
                        </TableRow>
                    ) : (
                        logs.map((log) => (
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
                                    <Chip
                                        label="Bijgewerkt"
                                        color="primary"
                                        size="small"
                                    />
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
    );
};