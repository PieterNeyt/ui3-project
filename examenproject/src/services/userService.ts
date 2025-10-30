import axios from 'axios';
import type { User } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const userService = {
    // Get user by ID
    getUserById: async (userId: string): Promise<User> => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

};