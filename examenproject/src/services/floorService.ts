import axios from 'axios';
import type {Floor, FloorFormData} from '../types/floor';

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

  // Get single floor
  getFloor: async (id: string): Promise<Floor> => {
    const response = await api.get(`/floors/${id}`);
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
    await api.delete(`/floors/${id}`);
  },
};