import axios from 'axios';
import type {Device, DeviceFormData, Playlist} from '../types/device';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const deviceService = {
    // Get all devices for a room
    getDevicesByRoom: async (kamerId: string): Promise<Device[]> => {
        const response = await api.get('/devices', {
            params: { kamerId }
        });
        return response.data;
    },
    getAllDevices: async (): Promise<Device[]> => {
        const response = await api.get('/devices');
        return response.data;
    },

    // Get single device
    getDevice: async (id: string): Promise<Device> => {
        const response = await api.get(`/devices/${id}`);
        return response.data;
    },

    // Create device
    createDevice: async (deviceData: DeviceFormData): Promise<Device> => {
        const now = new Date().toISOString();
        const deviceWithValues = {
            ...deviceData,
            id: crypto.randomUUID(),
            waarde: deviceData.defaultWaarde,
            createdAt: now,
            updatedAt: now,
        };
        const response = await api.post('/devices', deviceWithValues);
        return response.data;
    },

    updateDevice: async (id: string, deviceData: Partial<Device>): Promise<Device> => {
        const dataWithTimestamp = {
            ...deviceData,
            updatedAt: new Date().toISOString(),
        };
        const response = await api.patch(`/devices/${id}`, dataWithTimestamp);
        return response.data;
    },

    // Delete device
    deleteDevice: async (id: string): Promise<void> => {
        await api.delete(`/devices/${id}`);
    },

    // Get playlists
    getPlaylists: async (): Promise<Playlist[]> => {
        const response = await api.get('/playlists');
        return response.data;
    },
};