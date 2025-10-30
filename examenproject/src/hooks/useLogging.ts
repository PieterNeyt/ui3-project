import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loggingService } from '../services/loggingService';
import type { LogFilter } from '../types/logging';

export const useDeviceChangeLogs = (filters?: LogFilter) => {
    return useQuery({
        queryKey: ['deviceChangeLogs', filters],
        queryFn: () => loggingService.getDeviceChangeLogs(filters),
        refetchInterval: 30000, // Poll every 30 seconds
    });
};

export const useDeviceStatistics = () => {
    return useQuery({
        queryKey: ['deviceStatistics'],
        queryFn: () => loggingService.getDeviceStatistics(),
        refetchInterval: 30000, // Poll every 30 seconds
    });
};

export const useAddLogEntry = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loggingService.addLogEntry,
        onSuccess: () => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['deviceChangeLogs'] });
            queryClient.invalidateQueries({ queryKey: ['deviceStatistics'] });
        },
    });
};