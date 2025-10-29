export interface BaseDevice {
    id: string;
    naam: string;
    type: DeviceType;
    upcCode: string;
    kamerId: string;
    x: number;
    y: number;
    omschrijving?: string;
}

export interface LightDevice extends BaseDevice {
    type: 'licht';
    defaultWaarde: {
        on_off: 'on' | 'off';
        brightness: number;
    };
    waarde: {
        on_off: 'on' | 'off';
        brightness: number;
    };
}

export interface HeatingDevice extends BaseDevice {
    type: 'verwarming';
    defaultWaarde: {
        temperature: number;
    };
    waarde: {
        temperature: number;
    };
}

export interface DoorLockDevice extends BaseDevice {
    type: 'deurslot';
    defaultWaarde: {
        locked: boolean;
    };
    waarde: {
        locked: boolean;
    };
}

export interface AudioDevice extends BaseDevice {
    type: 'audio';
    defaultWaarde: {
        volume: number;
        playlist: string;
    };
    waarde: {
        volume: number;
        playlist: string;
    };
}

export type Device = LightDevice | HeatingDevice | DoorLockDevice | AudioDevice;
export type DeviceType = 'licht' | 'verwarming' | 'deurslot' | 'audio';

// Union type voor form data
export type DeviceFormData = {
    naam: string;
    type: DeviceType;
    upcCode: string;
    kamerId: string;
    x: number;
    y: number;
    omschrijving?: string;
} & (
    | { type: 'licht'; defaultWaarde: { on_off: 'on' | 'off'; brightness: number } }
    | { type: 'verwarming'; defaultWaarde: { temperature: number } }
    | { type: 'deurslot'; defaultWaarde: { locked: boolean } }
    | { type: 'audio'; defaultWaarde: { volume: number; playlist: string } }
    );

// Playlist types
export interface Playlist {
    id: string;
    naam: string;
}

export type LightValue = {
    on_off: 'on' | 'off';
    brightness: number;
};

export type HeatingValue = {
    temperature: number;
};

export type DoorLockValue = {
    locked: boolean;
};

export type AudioValue = {
    volume: number;
    playlist: string;
};

export type DeviceValue = LightValue | HeatingValue | DoorLockValue | AudioValue;