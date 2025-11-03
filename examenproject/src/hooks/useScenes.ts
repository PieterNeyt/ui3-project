import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {sceneService} from '../services/sceneService';
import {deviceService} from '../services/deviceService';
import type {Scene, SceneFormData} from '../types/scene';
import {useAuth} from './useAuth.ts';

export const useScenes = () => {
    return useQuery({
        queryKey: ['scenes'],
        queryFn: async (): Promise<Scene[]> => {
            const scenesData = await sceneService.getScenes();

            return await Promise.all(
                scenesData.map(async (scene) => {
                    const controlsWithDevices = await Promise.all(
                        scene.controls.map(async (control) => {
                            try {
                                const device = await deviceService.getDevice(control.deviceId);
                                return {...control, device};
                            } catch {
                                return control;
                            }
                        })
                    );
                    return {...scene, controls: controlsWithDevices};
                })
            );
        },
    });
};

export const useScene = (id: string) => {
    return useQuery({
        queryKey: ['scenes', id],
        queryFn: async (): Promise<Scene> => {
            const sceneData = await sceneService.getScene(id);

            // Haal device informatie op voor alle controls
            const controlsWithDevices = await Promise.all(
                sceneData.controls.map(async (control) => {

                    const device = await deviceService.getDevice(control.deviceId);
                    return {...control, device};

                })
            );

            return {...sceneData, controls: controlsWithDevices};
        },
        enabled: !!id,
    });
};

export const useCreateScene = () => {
    const queryClient = useQueryClient();
    const {user} = useAuth();

    return useMutation({
        mutationFn: (sceneData: SceneFormData) =>
            sceneService.createScene(sceneData, user?.id || ''),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['scenes']});
        },
    });
};

export const useUpdateScene = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, data}: { id: string; data: Partial<SceneFormData> }) =>
            sceneService.updateScene(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['scenes']});
        },
    });
};

export const useDeleteScene = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sceneService.deleteScene,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['scenes']});
        },
    });
};

export const useActivateScene = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sceneService.activateScene,
        onSuccess: (_, sceneId) => {
            // Invalideer zowel scenes als devices queries
            queryClient.invalidateQueries({queryKey: ['scenes']});
            queryClient.invalidateQueries({queryKey: ['devices']});
            queryClient.invalidateQueries({queryKey: ['activeTimeSlot']});

            console.log(`Scene ${sceneId} succesvol geactiveerd`);
        },
        onError: (error, sceneId) => {
            console.error(`Fout bij activeren scene ${sceneId}:`, error);
        },
    });
};

export const useDeactivateScene = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sceneService.deactivateScene,
        onSuccess: () => {
            // Invalideer queries om refresh te forceren
            queryClient.invalidateQueries({queryKey: ['devices']});
            queryClient.invalidateQueries({queryKey: ['activeTimeSlot']});

        },
    });
};