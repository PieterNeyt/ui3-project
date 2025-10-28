import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { floorService } from '../services/floorService';
import type { FloorFormData} from '../types/floor';

export const useFloors = () => {
    return useQuery({
        queryKey: ['floors'],
        queryFn: floorService.getFloors,
        refetchInterval: 30000, // Polling elke 30 seconden
    });
};

export const useFloor = (id: string) => {
    return useQuery({
        queryKey: ['floors', id],
        queryFn: () => floorService.getFloor(id),
    });
};

export const useCreateFloor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: floorService.createFloor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['floors'] });
        },
    });
};

export const useUpdateFloor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FloorFormData }) =>
            floorService.updateFloor(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['floors'] });
        },
    });
};

export const useDeleteFloor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: floorService.deleteFloor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['floors'] });
        },
    });
};