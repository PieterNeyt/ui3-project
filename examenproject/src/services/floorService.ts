import axios from 'axios';
import type { Floor, FloorFormData } from '../types/floor';
import { roomService } from './roomService';
import { deviceService } from './deviceService';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const floorService = {
    // Get all floors
    getFloors: async (): Promise<Floor[]> => {
        const response = await api.get('/floors');
        return response.data;
    },

    // Create floor
    createFloor: async (floorData: FloorFormData): Promise<Floor> => {
        const response = await api.post('/floors', {
            ...floorData,
            id: crypto.randomUUID(),
        });
        return response.data;
    },

    // Update floor
    updateFloor: async (id: string, floorData: FloorFormData): Promise<Floor> => {
        const response = await api.put(`/floors/${id}`, floorData);
        return response.data;
    },

    // Delete floor
    deleteFloor: async (id: string): Promise<void> => {
        try {
            const rooms = await roomService.getRoomsByFloor(id);

            for (const room of rooms) {
                const devices = await deviceService.getDevicesByRoom(room.id);
                for (const device of devices) {
                    await deviceService.deleteDevice(device.id);
                }

                await roomService.deleteRoom(room.id);
            }

            await api.delete(`/floors/${id}`);
        } catch (error) {
            console.error('Error deleting floor with associated data:', error);
            throw error;
        }
    },
};