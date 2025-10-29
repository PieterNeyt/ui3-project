import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deviceService } from '../services/deviceService';
import type {Device} from '../types/device';

export const useDevicesByRoom = (kamerId: string) => {
    return useQuery({
        queryKey: ['devices', kamerId],
        queryFn: () => deviceService.getDevicesByRoom(kamerId),
        refetchInterval: 30000, // Polling elke 30 seconden
        enabled: !!kamerId,
    });
};

export const useDevice = (id: string) => {
    return useQuery({
        queryKey: ['devices', id],
        queryFn: () => deviceService.getDevice(id),
    });
};

export const useDevices = () => {
    return useQuery({
        queryKey: ['all-devices'],
        queryFn: async () => {
            try {
                const response = await fetch('http://localhost:3001/devices');
                if (!response.ok) {
                    throw new Error('Failed to fetch devices');
                }
                return response.json();
            } catch (error) {
                console.error('Error fetching devices:', error);
                return [];
            }
        },
    });
};
export const useCreateDevice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deviceService.createDevice,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['devices', data.kamerId] });
        },
    });
};

export const useUpdateDevice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Device> }) =>
            deviceService.updateDevice(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['devices', data.kamerId] });
        },
    });
};

export const useDeleteDevice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deviceService.deleteDevice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['devices'] });
        },
    });
};

export const usePlaylists = () => {
    return useQuery({
        queryKey: ['playlists'],
        queryFn: deviceService.getPlaylists,
    });
};