import axios from 'axios';
import type { TimeSlot, TimeSlotFormData } from '../types/timeslot';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const timeSlotService = {
    // Alle timeslots ophalen
    getTimeSlots: async (): Promise<TimeSlot[]> => {
        const response = await api.get('/timeslots');
        return response.data;
    },

    // Timeslots per scene ophalen
    getTimeSlotsByScene: async (sceneId: string): Promise<TimeSlot[]> => {
        const response = await api.get('/timeslots', {
            params: { sceneId },
        });
        return response.data;
    },

    // Eén timeslot ophalen
    getTimeSlot: async (id: string): Promise<TimeSlot> => {
        const response = await api.get(`/timeslots/${id}`);
        return response.data;
    },

    // Timeslot aanmaken
    createTimeSlot: async (timeSlotData: TimeSlotFormData): Promise<TimeSlot> => {
        const now = new Date().toISOString();
        const timeSlotWithValues: TimeSlot = {
            ...timeSlotData,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
            createdBy: 'current-user-id',
        };

        const response = await api.post('/timeslots', timeSlotWithValues);
        return response.data;
    },

    // Timeslot updaten
    updateTimeSlot: async (id: string, timeSlotData: Partial<TimeSlotFormData>): Promise<TimeSlot> => {
        const dataWithTimestamp = {
            ...timeSlotData,
            updatedAt: new Date().toISOString(),
        };

        const response = await api.patch(`/timeslots/${id}`, dataWithTimestamp);
        return response.data;
    },

    // Timeslot verwijderen
    deleteTimeSlot: async (id: string): Promise<void> => {
        await api.delete(`/timeslots/${id}`);
    },

    // Overlap-check
    checkOverlap: async (
        _sceneId: string,
        startTime: string,
        endTime: string,
        excludeId?: string
    ): Promise<boolean> => {
        const timeslots = await timeSlotService.getTimeSlots();

        const relevantSlots = timeslots.filter(slot => slot.isActive);

        return relevantSlots.some(slot => {
            if (excludeId && slot.id === excludeId) return false;
            return timeSlotService.doTimeSlotsOverlap(
                { startTime, endTime },
                { startTime: slot.startTime, endTime: slot.endTime }
            );
        });
    },


    // Hulpmethode: overlap bepalen
    doTimeSlotsOverlap: (
        slot1: { startTime: string; endTime: string },
        slot2: { startTime: string; endTime: string }
    ): boolean => {
        const [start1, end1] = [timeToMinutes(slot1.startTime), timeToMinutes(slot1.endTime)];
        const [start2, end2] = [timeToMinutes(slot2.startTime), timeToMinutes(slot2.endTime)];
        return start1 < end2 && start2 < end1;
    },

    // Actieve timeslot ophalen (op basis van huidige tijd)
    getActiveTimeSlot: async (): Promise<TimeSlot | null> => {
        const timeslots = await timeSlotService.getTimeSlots();
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const currentMinutes = timeToMinutes(currentTime);

        const activeTimeSlot = timeslots.find(timeslot => {
            if (!timeslot.isActive) return false;
            const startMinutes = timeToMinutes(timeslot.startTime);
            const endMinutes = timeToMinutes(timeslot.endTime);

            // Handle overnight (bv. 22:00 - 06:00)
            if (endMinutes < startMinutes) {
                return currentMinutes >= startMinutes || currentMinutes < endMinutes;
            }
            return currentMinutes >= startMinutes && currentMinutes < endMinutes;
        });

        return activeTimeSlot || null;
    },
};

// Helper
const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};
