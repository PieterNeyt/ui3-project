import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deviceService } from '../services/deviceService';
import type { Device } from '../types/device';
import {useAddLogEntry} from "./useLogging.ts";
import {useAuth} from "./useAuth.ts";
import {useRooms} from "./useRooms.ts";


export const useDevicesByRoom = (kamerId: string) => {
    return useQuery({
        queryKey: ['devices', kamerId],
        queryFn: () => deviceService.getDevicesByRoom(kamerId),
        refetchInterval: 30000,
        enabled: !!kamerId,
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
    const addLogEntry = useAddLogEntry();
    const { user } = useAuth(); // Haal huidige gebruiker op
    const { data: rooms = [] } = useRooms(); // Haal kamers op voor kamer naam

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Device> }) =>
            deviceService.updateDevice(id, data),
        onSuccess: (updatedDevice, variables) => {
            // Haal het oude device op uit de cache voor correcte oldValue
            const oldDevice = queryClient.getQueryData<Device>(['devices', variables.id]) ||
                queryClient.getQueryData<Device[]>(['devices'])?.find(d => d.id === variables.id);

            // Zoek de kamer naam op basis van roomId
            const room = rooms.find(r => r.id === updatedDevice.kamerId);
            const roomName = room?.naam || 'Onbekende kamer';

            // Log de wijziging met CORRECTE oldValue en newValue
            if (oldDevice) {
                addLogEntry.mutate({
                    deviceId: variables.id,
                    deviceName: updatedDevice.naam,
                    deviceType: updatedDevice.type,
                    roomId: updatedDevice.kamerId,
                    roomName: roomName, // Gebruik echte kamer naam
                    changeType: 'state_changed',
                    oldValue: oldDevice.waarde,
                    newValue: updatedDevice.waarde,
                    timestamp: new Date().toISOString(),
                    userId: user?.id || 'unknown-user', // Gebruik echte user ID
                    userName: user?.username || 'Onbekende gebruiker', // Gebruik echte username
                });
            }

            queryClient.invalidateQueries({ queryKey: ['devices', updatedDevice.kamerId] });
            queryClient.invalidateQueries({ queryKey: ['devices'] });
            queryClient.invalidateQueries({ queryKey: ['devices', variables.id] });
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