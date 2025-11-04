export interface DeviceChangeLog {
    id: string;
    deviceId: string;
    deviceName: string;
    deviceType: string;
    roomId: string;
    roomName: string;
    changeType: 'created' | 'updated' | 'deleted' | 'state_changed';
    oldValue?: DeviceValue;
    newValue?: DeviceValue;
    timestamp: string;
    userId?: string;
    userName?: string;
}

export interface DeviceStatistics {
    mostSwitchedLights: Array<{
        deviceId: string;
        deviceName: string;
        switchCount: number;
        roomName: string;
    }>;
    temperatureHistory: Array<{
        timestamp: string;
        averageTemperature: number;
        roomTemperatures: Record<string, number>;
    }>;
    deviceActivity: Array<{
        hour: number;
        activityCount: number;
    }>;
    topActiveDevices: Array<{
        deviceId: string;
        deviceName: string;
        type: string;
        changeCount: number;
        roomName: string;
    }>;

    mostActiveRooms: Array<{
        roomName: string;
        activityCount: number;
    }>;
    changeTypeDistribution: Array<{
        changeType: string;
        count: number;
    }>;
    deviceTypeStats: Array<{
        deviceType: string;
        count: number;
    }>;
    recentActivity: Array<{
        date: string;
        activityCount: number;
    }>;
    totalChanges: number;
    todayChanges: number;
}

export interface LogFilter {
    startDate?: string;
    endDate?: string;
    deviceType?: string;
    roomId?: string;
    changeType?: string;
}

export type DeviceValue = {
    on_off?: 'on' | 'off';
    brightness?: number;
    temperature?: number;
    locked?: boolean;
    volume?: number;
    playlist?: string;
};