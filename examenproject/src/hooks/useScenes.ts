import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sceneService } from '../services/sceneService';
import { deviceService } from '../services/deviceService';
import type { Scene, SceneFormData } from '../types/scene';

export const useScenes = () => {
    return useQuery({
        queryKey: ['scenes'],
        queryFn: async (): Promise<Scene[]> => {
            const scenesData = await sceneService.getScenes();

            // Verrijk scenes met device informatie
            const enrichedScenes = await Promise.all(
                scenesData.map(async (scene) => {
                    const controlsWithDevices = await Promise.all(
                        scene.controls.map(async (control) => {
                            try {
                                const device = await deviceService.getDevice(control.deviceId);
                                return { ...control, device };
                            } catch {
                                return control; // Device niet gevonden, maar scene behouden
                            }
                        })
                    );
                    return { ...scene, controls: controlsWithDevices };
                })
            );

            return enrichedScenes;
        },
    });
};

export const useScene = (id: string) => {
    return useQuery({
        queryKey: ['scenes', id],
        queryFn: () => sceneService.getScene(id),
        enabled: !!id,
    });
};

export const useCreateScene = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sceneService.createScene,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scenes'] });
        },
    });
};

export const useUpdateScene = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<SceneFormData> }) =>
            sceneService.updateScene(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scenes'] });
        },
    });
};

export const useDeleteScene = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sceneService.deleteScene,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scenes'] });
        },
    });
};

export const useActivateScene = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sceneService.activateScene,
        onSuccess: () => {
            // Invalideer zowel scenes als devices queries
            queryClient.invalidateQueries({ queryKey: ['scenes'] });
            queryClient.invalidateQueries({ queryKey: ['devices'] });
        },
    });
};