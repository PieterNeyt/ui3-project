import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomService } from '../services/roomService';
import type {RoomFormData} from '../types/room';

export const useRoomsByFloor = (verdiepingId: string) => {
    return useQuery({
        queryKey: ['rooms', verdiepingId],
        queryFn: () => roomService.getRoomsByFloor(verdiepingId),
        refetchInterval: 30000, // Polling elke 30 seconden
        enabled: !!verdiepingId,
    });
};

export const useRoom = (id: string) => {
    return useQuery({
        queryKey: ['rooms', id],
        queryFn: () => roomService.getRoom(id),
    });
};

export const useRooms = () => {
    return useQuery({
        queryKey: ['rooms'],
        queryFn: () => roomService.getRooms(),
    });
};

export const useCreateRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: roomService.createRoom,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['rooms', data.verdiepingId] });
        },
    });
};

export const useUpdateRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: RoomFormData }) =>
            roomService.updateRoom(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['rooms', data.verdiepingId] });
        },
    });
};

export const useDeleteRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: roomService.deleteRoom,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        },
    });
};