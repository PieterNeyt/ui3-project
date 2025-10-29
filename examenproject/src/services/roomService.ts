import axios from 'axios';
import type { Room, RoomFormData } from '../types/room';
import { deviceService } from './deviceService';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const roomService = {
    // Get all rooms for a floor
    getRoomsByFloor: async (verdiepingId: string): Promise<Room[]> => {
        const response = await api.get('/rooms', {
            params: { verdiepingId }
        });
        return response.data;
    },

    // Get single room
    getRoom: async (id: string): Promise<Room> => {
        const response = await api.get(`/rooms/${id}`);
        return response.data;
    },

    // Create room
    createRoom: async (roomData: RoomFormData): Promise<Room> => {
        const response = await api.post('/rooms', {
            ...roomData,
            id: crypto.randomUUID(),
        });
        return response.data;
    },

    // Get all rooms
    getRooms: async (): Promise<Room[]> => {
        const response = await api.get('/rooms');
        return response.data;
    },

    // Update room
    updateRoom: async (id: string, roomData: RoomFormData): Promise<Room> => {
        const response = await api.put(`/rooms/${id}`, roomData);
        return response.data;
    },

    // Delete room
    deleteRoom: async (id: string): Promise<void> => {
        try {
            const devices = await deviceService.getDevicesByRoom(id);

            for (const device of devices) {
                await deviceService.deleteDevice(device.id);
            }

            await api.delete(`/rooms/${id}`);
        } catch (error) {
            console.error('Error deleting room with associated devices:', error);
            throw error;
        }
    },
};