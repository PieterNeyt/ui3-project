import type { Device, DeviceValue } from './device';

export interface SceneControl {
    deviceId: string;
    waarde: DeviceValue;
    device?: Device;
}

export interface Scene {
    id: string;
    naam: string;
    controls: SceneControl[];
    image?: string;
    omschrijving?: string;
    isGlobal: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export interface SceneFormData {
    naam: string;
    controls: SceneControl[];
    image?: string;
    omschrijving?: string;
    isGlobal: boolean;
}