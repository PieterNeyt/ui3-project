import {
    Box,
    TextField,
    MenuItem,
    IconButton,
    Tooltip,
} from '@mui/material';
import { FilterList, Refresh } from '@mui/icons-material';
import type { LogFilter } from '../../../types/logging.ts';

interface DeviceChangeLogsFiltersProps {
    filters: LogFilter;
    onFilterChange: (key: keyof LogFilter, value: string) => void;
    onRefresh: () => void;
    isLoading: boolean;
}

export const DeviceChangeLogsFilters = ({
                                            filters,
                                            onFilterChange,
                                            onRefresh,
                                            isLoading,
                                        }: DeviceChangeLogsFiltersProps) => {
    return (
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
                        onChange={(e) => onFilterChange('startDate', e.target.value)}
                    />

                    <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label="Tot"
                        value={filters.endDate}
                        onChange={(e) => onFilterChange('endDate', e.target.value)}
                    />

                    <TextField
                        fullWidth
                        size="small"
                        select
                        label="Device Type"
                        value={filters.deviceType || ''}
                        onChange={(e) => onFilterChange('deviceType', e.target.value)}
                    >
                        <MenuItem value="">Alle types</MenuItem>
                        <MenuItem value="licht">Licht</MenuItem>
                        <MenuItem value="verwarming">Verwarming</MenuItem>
                        <MenuItem value="deurslot">Deurslot</MenuItem>
                        <MenuItem value="audio">Audio</MenuItem>
                    </TextField>

                    <Tooltip title="Vernieuwen">
                        <IconButton
                            onClick={onRefresh}
                            disabled={isLoading}
                            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                        >
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );
};