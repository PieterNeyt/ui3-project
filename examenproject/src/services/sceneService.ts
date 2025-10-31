import axios from 'axios';
import type {Scene, SceneFormData} from '../types/scene';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const sceneService = {
    // Get all scenes
    getScenes: async (): Promise<Scene[]> => {
        const response = await api.get('/scenes');
        return response.data;
    },

    // Get single scene
    getScene: async (id: string): Promise<Scene> => {
        const response = await api.get(`/scenes/${id}`);
        return response.data;
    },

    // Create scene met gebruiker context
    createScene: async (sceneData: SceneFormData, userId: string): Promise<Scene> => {
        if (!userId) {
            throw new Error('User ID is required to create a scene');
        }

        const now = new Date().toISOString();

        const sceneWithValues = {
            ...sceneData,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
            createdBy: userId,
        };

        const response = await api.post('/scenes', sceneWithValues);
        return response.data;
    },

    // Update scene met toegangscontrole
    updateScene: async (id: string, sceneData: Partial<SceneFormData>): Promise<Scene> => {
        const dataWithTimestamp = {
            ...sceneData,
            updatedAt: new Date().toISOString(),
        };

        const response = await api.patch(`/scenes/${id}`, dataWithTimestamp);
        return response.data;
    },

    // Delete scene
    deleteScene: async (id: string): Promise<void> => {
        await api.delete(`/scenes/${id}`);
    },

    // Activate scene - overschrijft tijdsloten
    activateScene: async (id: string): Promise<void> => {
        const scene = await sceneService.getScene(id);

        // Update alle devices in de scene met hun waarden
        for (const control of scene.controls) {

            await axios.patch(`${API_BASE_URL}/devices/${control.deviceId}`, {
                waarde: control.waarde,
                updatedAt: new Date().toISOString(),
                lastActivatedBy: id, // Bewaar welke scene dit device heeft geactiveerd
            });

        }

        // Update de laatste geactiveerde scene in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('lastManuallyActivatedScene', id);
            localStorage.setItem('lastActivationTime', new Date().toISOString());
        }
    },

    // Nieuwe functie: Deactiveer handmatige scene (reset naar tijdslot of default)
    deactivateScene: async (): Promise<void> => {

        if (typeof window !== 'undefined') {
            localStorage.removeItem('lastManuallyActivatedScene');
            localStorage.removeItem('lastActivationTime');
        }
    },
};