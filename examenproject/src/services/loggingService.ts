// loggingService.ts
import type {DeviceChangeLog, DeviceStatistics, LogFilter} from "../types/logging.ts";
import axios from "axios";
const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const loggingService = {
    // Get device change logs - SORTEER OP DATUM (nieuwste eerst)
    getDeviceChangeLogs: async (filters?: LogFilter): Promise<DeviceChangeLog[]> => {
        const params = new URLSearchParams();

        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.deviceType) params.append('deviceType', filters.deviceType);
        if (filters?.roomId) params.append('roomId', filters.roomId);
        if (filters?.changeType) params.append('changeType', filters.changeType);

        const response = await api.get('/deviceChangeLogs', { params });

        // Sorteer logs op timestamp (nieuwste eerst)
        const logs = response.data as DeviceChangeLog[];
        return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },

    // Get device statistics - MET MEER STATISTIEKEN
    getDeviceStatistics: async (): Promise<DeviceStatistics> => {
        const logs = await loggingService.getDeviceChangeLogs();

        // Calculate most switched lights
        const lightSwitches = logs
            .filter(log => log.deviceType === 'licht' && log.changeType === 'state_changed')
            .reduce((acc, log) => {
                acc[log.deviceId] = (acc[log.deviceId] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

        const mostSwitchedLights = Object.entries(lightSwitches)
            .map(([deviceId, count]) => {
                const log = logs.find(l => l.deviceId === deviceId);
                return {
                    deviceId,
                    deviceName: log?.deviceName || 'Unknown',
                    switchCount: count,
                    roomName: log?.roomName || 'Unknown'
                };
            })
            .sort((a, b) => b.switchCount - a.switchCount)
            .slice(0, 10);

        // Calculate temperature history (last 24 hours)
        const now = new Date();
        const temperatureHistory = Array.from({ length: 24 }, (_, i) => {
            const hour = new Date(now);
            hour.setHours(now.getHours() - (23 - i));

            const hourLogs = logs.filter(log => {
                const logTime = new Date(log.timestamp);
                return logTime.getHours() === hour.getHours() &&
                    log.deviceType === 'verwarming' &&
                    log.changeType === 'state_changed';
            });

            const roomTemperatures: Record<string, number> = {};
            let totalTemp = 0;
            let tempCount = 0;

            hourLogs.forEach(log => {
                if (log.newValue?.temperature) {
                    roomTemperatures[log.roomName] = log.newValue.temperature;
                    totalTemp += log.newValue.temperature;
                    tempCount++;
                }
            });

            return {
                timestamp: hour.toISOString(),
                averageTemperature: tempCount > 0 ? totalTemp / tempCount : 20,
                roomTemperatures
            };
        });

        // Calculate device activity by hour
        const deviceActivity = Array.from({ length: 24 }, (_, hour) => {
            const activityCount = logs.filter(log => {
                const logTime = new Date(log.timestamp);
                return logTime.getHours() === hour;
            }).length;

            return { hour, activityCount };
        });

        // Calculate top active devices
        const deviceActivityCount = logs.reduce((acc, log) => {
            acc[log.deviceId] = (acc[log.deviceId] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topActiveDevices = Object.entries(deviceActivityCount)
            .map(([deviceId, count]) => {
                const log = logs.find(l => l.deviceId === deviceId);
                return {
                    deviceId,
                    deviceName: log?.deviceName || 'Unknown',
                    type: log?.deviceType || 'Unknown',
                    changeCount: count,
                    roomName: log?.roomName || 'Unknown'
                };
            })
            .sort((a, b) => b.changeCount - a.changeCount)
            .slice(0, 10);

        // NIEUWE STATISTIEKEN
        // Meest actieve kamers
        const roomActivity = logs.reduce((acc, log) => {
            acc[log.roomName] = (acc[log.roomName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const mostActiveRooms = Object.entries(roomActivity)
            .map(([roomName, count]) => ({ roomName, activityCount: count }))
            .sort((a, b) => b.activityCount - a.activityCount)
            .slice(0, 5);

        // Wijzigingen per type
        const changesByType = logs.reduce((acc, log) => {
            acc[log.changeType] = (acc[log.changeType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const changeTypeDistribution = Object.entries(changesByType)
            .map(([changeType, count]) => ({ changeType, count }));

        // Device type distributie
        const deviceTypeDistribution = logs.reduce((acc, log) => {
            acc[log.deviceType] = (acc[log.deviceType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const deviceTypeStats = Object.entries(deviceTypeDistribution)
            .map(([deviceType, count]) => ({ deviceType, count }));

        // Recente activiteit (laatste 7 dagen)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
        });

        const recentActivity = last7Days.map(date => {
            const dayLogs = logs.filter(log =>
                log.timestamp.split('T')[0] === date
            );
            return {
                date,
                activityCount: dayLogs.length
            };
        });

        return {
            mostSwitchedLights,
            temperatureHistory,
            deviceActivity,
            topActiveDevices,
            // NIEUWE STATISTIEKEN
            mostActiveRooms,
            changeTypeDistribution,
            deviceTypeStats,
            recentActivity,
            totalChanges: logs.length,
            todayChanges: logs.filter(log =>
                log.timestamp.split('T')[0] === new Date().toISOString().split('T')[0]
            ).length
        };
    },

    // Add a new log entry - CORRECTE OUD/NIEUW WAARDE HANDLING
    addLogEntry: async (log: Omit<DeviceChangeLog, 'id'>): Promise<DeviceChangeLog> => {
        // Voor state_changed: oldValue moet de vorige waarde zijn, newValue de nieuwe
        // Voor created: oldValue is undefined, newValue is de initiële waarde
        // Voor deleted: oldValue is de laatste waarde, newValue is undefined
        // Voor updated: oldValue is vorige waarde, newValue is nieuwe waarde

        const newLog = {
            ...log,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
        };

        const response = await api.post('/deviceChangeLogs', newLog);
        return response.data;
    },
};