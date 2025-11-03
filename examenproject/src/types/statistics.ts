export interface LightStatistic {
    deviceId: string;
    deviceName: string;
    roomName: string;
    switchCount: number;
}

export interface RoomStatistic {
    roomName: string;
    activityCount: number;
}

export interface DeviceStatistics {
    totalChanges: number;
    todayChanges: number;
    mostSwitchedLights: LightStatistic[];
    mostActiveRooms: RoomStatistic[];
}