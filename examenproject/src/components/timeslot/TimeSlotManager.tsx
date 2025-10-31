import {useEffect, useState} from 'react';
import {useActiveTimeSlot} from '../../hooks/useTimeSlots';
import {useDevices} from '../../hooks/useDevices';
import {useUpdateDevice} from '../../hooks/useDevices';
import {useScenes} from "../../hooks/useScenes.ts";
import type {AudioValue, DoorLockValue, HeatingValue, LightValue} from "../../types/device.ts";

export const TimeSlotManager= () => {
    const {data: activeTimeSlot, refetch: refetchActiveTimeSlot} = useActiveTimeSlot();
    const {data: scenes = []} = useScenes();
    const {data: devices = []} = useDevices();
    const updateDeviceMutation = useUpdateDevice();

    const [lastActiveSceneId, setLastActiveSceneId] = useState<string | null>(null);
    const [manuallyActivatedSceneId, setManuallyActivatedSceneId] = useState<string | null>(null);

    // Check of er een handmatig geactiveerde scene is
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const lastManualScene = localStorage.getItem('lastManuallyActivatedScene');
            if (lastManualScene) {
                setManuallyActivatedSceneId(lastManualScene);
            }
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            refetchActiveTimeSlot();
        }, 30000); // Elke 30 seconden

        return () => clearInterval(interval);
    }, [refetchActiveTimeSlot]);

    // Luister naar handmatige activatie events
    useEffect(() => {
        const handleManualActivation = (event: CustomEvent) => {
            setManuallyActivatedSceneId(event.detail.sceneId);
            console.log('⏰ TimeSlotManager: Handmatige scene gedetecteerd, tijdsloten genegeerd');
        };

        const handleManualDeactivation = () => {
            setManuallyActivatedSceneId(null);
            console.log('⏰ TimeSlotManager: Handmatige scene gedeactiveerd, tijdsloten actief');
        };

        window.addEventListener('sceneManuallyActivated', handleManualActivation as EventListener);
        window.addEventListener('sceneManuallyDeactivated', handleManualDeactivation as EventListener);

        return () => {
            window.removeEventListener('sceneManuallyActivated', handleManualActivation as EventListener);
            window.removeEventListener('sceneManuallyDeactivated', handleManualDeactivation as EventListener);
        };
    }, []);

    useEffect(() => {
        // Als er een handmatig geactiveerde scene is, negeren we tijdsloten
        if (manuallyActivatedSceneId) {
            return;
        }

        const applySceneToDevices = async (sceneId: string) => {
            const scene = scenes.find(s => s.id === sceneId);
            if (!scene) return;

            for (const control of scene.controls) {
                const device = devices.find(d => d.id === control.deviceId);
                if (!device) continue;

                switch (device.type) {
                    case 'licht':
                        await updateDeviceMutation.mutateAsync({
                            id: device.id,
                            data: {
                                waarde: control.waarde as LightValue,
                                updatedAt: new Date().toISOString(),

                            },
                        });
                        break;

                    case 'verwarming':
                        await updateDeviceMutation.mutateAsync({
                            id: device.id,
                            data: {
                                waarde: control.waarde as HeatingValue,
                                updatedAt: new Date().toISOString(),

                            },
                        });
                        break;

                    case 'deurslot':
                        await updateDeviceMutation.mutateAsync({
                            id: device.id,
                            data: {
                                waarde: control.waarde as DoorLockValue,
                                updatedAt: new Date().toISOString(),

                            },
                        });
                        break;

                    case 'audio':
                        await updateDeviceMutation.mutateAsync({
                            id: device.id,
                            data: {
                                waarde: control.waarde as AudioValue,
                                updatedAt: new Date().toISOString(),

                            },
                        });
                        break;
                }


            }
        };

        const resetDevicesToDefault = async () => {

            for (const device of devices) {
                if (!device.defaultWaarde) continue;

                switch (device.type) {
                    case 'licht':
                        await updateDeviceMutation.mutateAsync({
                            id: device.id,
                            data: {
                                waarde: device.defaultWaarde as LightValue,
                                updatedAt: new Date().toISOString(),

                            },
                        });
                        break;

                    case 'verwarming':
                        await updateDeviceMutation.mutateAsync({
                            id: device.id,
                            data: {
                                waarde: device.defaultWaarde as HeatingValue,
                                updatedAt: new Date().toISOString(),

                            },
                        });
                        break;

                    case 'deurslot':
                        await updateDeviceMutation.mutateAsync({
                            id: device.id,
                            data: {
                                waarde: device.defaultWaarde as DoorLockValue,
                                updatedAt: new Date().toISOString(),

                            },
                        });
                        break;

                    case 'audio':
                        await updateDeviceMutation.mutateAsync({
                            id: device.id,
                            data: {
                                waarde: device.defaultWaarde as AudioValue,
                                updatedAt: new Date().toISOString(),

                            },
                        });
                        break;
                }

            }
        };

        // Als er een actieve tijdslot is
        if (activeTimeSlot) {
            if (activeTimeSlot.sceneId !== lastActiveSceneId) {
                applySceneToDevices(activeTimeSlot.sceneId);
                setLastActiveSceneId(activeTimeSlot.sceneId);
            }
        }
        // Als er geen actieve tijdslot is maar er was eerder wel één
        else if (lastActiveSceneId) {
            resetDevicesToDefault();
            setLastActiveSceneId(null);
        }

    }, [activeTimeSlot, lastActiveSceneId, scenes, devices, updateDeviceMutation, manuallyActivatedSceneId]);

    return null;
};