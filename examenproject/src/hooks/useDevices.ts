import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deviceService } from '../services/deviceService';
import type { Device } from '../types/device';


export const useDevicesByRoom = (kamerId: string) => {
    return useQuery({
        queryKey: ['devices', kamerId],
        queryFn: () => deviceService.getDevicesByRoom(kamerId),
        refetchInterval: 30000,
        enabled: !!kamerId,
    });
};

export const useDevice = (id: string) => {
    return useQuery({
        queryKey: ['devices', id],
        queryFn: () => deviceService.getDevice(id),
        enabled: !!id,
    });
};

export const useDevices = () => {
    return useQuery({
        queryKey: ['devices'],
        queryFn: async (): Promise<Device[]> => {
            try {
                const response = await fetch('http://localhost:3001/devices');
                if (!response.ok) {
                    throw new Error('Failed to fetch devices');
                }
                return response.json();
            } catch (error) {
                console.error('Error fetching devices:', error);
                throw error;
            }
        },
        refetchInterval: 30000,
    });
};

export const useCreateDevice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deviceService.createDevice,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['devices', data.kamerId] });
            queryClient.invalidateQueries({ queryKey: ['devices'] });
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
            queryClient.invalidateQueries({ queryKey: ['devices'] });

            queryClient.invalidateQueries({ queryKey: ['devices', data.id] });
        },
    });
};

export const useDeleteDevice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deviceService.deleteDevice,
        onSuccess: () => {
            // Invalideer alle device-related queries
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