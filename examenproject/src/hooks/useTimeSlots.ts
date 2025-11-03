import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timeSlotService } from '../services/timeslotService';
import type { TimeSlotFormData } from '../types/timeslot';



export const useTimeSlotsByScene = (sceneId: string) => {
    return useQuery({
        queryKey: ['timeslots', sceneId],
        queryFn: () => timeSlotService.getTimeSlotsByScene(sceneId),
        enabled: !!sceneId,
    });
};

export const useActiveTimeSlot = () => {
    return useQuery({
        queryKey: ['activeTimeSlot'],
        queryFn: timeSlotService.getActiveTimeSlot,
        refetchInterval: 60000, // Elke minuut opnieuw controleren
        staleTime: 30000, // 30 seconden
    });
};

export const useCreateTimeSlot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: timeSlotService.createTimeSlot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timeslots'] });
        },
    });
};

export const useUpdateTimeSlot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<TimeSlotFormData> }) =>
            timeSlotService.updateTimeSlot(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timeslots'] });
        },
    });
};

export const useDeleteTimeSlot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: timeSlotService.deleteTimeSlot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timeslots'] });
        },
    });
};

export const useCheckOverlap = () => {
    return useMutation({
        mutationFn: ({
                         sceneId,
                         startTime,
                         endTime,
                         excludeId,
                     }: {
            sceneId: string;
            startTime: string;
            endTime: string;
            excludeId?: string;
        }) => timeSlotService.checkOverlap(sceneId, startTime, endTime, excludeId),
    });
};