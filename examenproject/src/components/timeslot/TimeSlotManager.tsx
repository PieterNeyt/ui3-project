import { useEffect, useState } from 'react';
import { useActiveTimeSlot } from '../../hooks/useTimeSlots';
import { useDevices } from '../../hooks/useDevices';
import { useUpdateDevice } from '../../hooks/useDevices';
import { useScenes } from "../../hooks/useScenes.ts";
import type {AudioValue, DoorLockValue, HeatingValue, LightValue} from "../../types/device.ts";


export const TimeSlotManager: React.FC = () => {
    const { data: activeTimeSlot, refetch: refetchActiveTimeSlot } = useActiveTimeSlot();
    const { data: scenes = [] } = useScenes();
    const { data: devices = [] } = useDevices();
    const updateDeviceMutation = useUpdateDevice();

    // Houd bij welke scene eerder actief was
    const [lastActiveSceneId, setLastActiveSceneId] = useState<string | null>(null);

    useEffect(() => {
        // Controleer elke minuut op wijzigingen
        const interval = setInterval(() => {
            refetchActiveTimeSlot();
        }, 60000); // 1 minuut

        return () => clearInterval(interval);
    }, [refetchActiveTimeSlot]);

    useEffect(() => {
        const applySceneToDevices = async (sceneId: string) => {
            const scene = scenes.find(s => s.id === sceneId);
            if (!scene) return;

            console.log(`Activeren scene via tijdslot: ${scene.naam}`);

            for (const control of scene.controls) {
                const device = devices.find(d => d.id === control.deviceId);
                if (!device) continue;

                try {
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

                    console.log(`Device ${device.naam} geüpdatet naar:`, control.waarde);
                } catch (error) {
                    console.error(`Fout bij updaten device ${device.naam}:`, error);
                }
            }
        };


        const resetDevicesToDefault = async () => {
            console.log('Geen actieve tijdslot - resetten naar default waarden');

            for (const device of devices) {
                if (!device.defaultWaarde) continue;

                try {
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

                    console.log(`Device ${device.naam} gereset naar default:`, device.defaultWaarde);
                } catch (error) {
                    console.error(`Fout bij resetten device ${device.naam}:`, error);
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

    }, [activeTimeSlot, lastActiveSceneId, scenes, devices, updateDeviceMutation]);

    return null; // Deze component rendert niets
};