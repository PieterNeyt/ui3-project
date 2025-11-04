import { Box, Tabs, Tab } from '@mui/material';
import type { Device, DeviceValue } from '../../types/device.ts';
import { TabPanel } from './TabPanel.tsx';
import { AllDevicesTab } from './AllDevicesTab.tsx';
import { FavoritesTab } from './FavoritesTab.tsx';
import { QuickActionsTab } from './QuickActionsTab.tsx';
import type {Room} from "../../types/room.ts";
import type {Floor} from "../../types/floor.ts";

interface DashboardTabsProps {
    tabValue: number;
    onTabChange: (value: number) => void;
    filteredDevices: Device[];
    favoriteDevices: Device[];
    recentDevices: Device[];
    frequentDevices: Device[];
    rooms: Room[];
    floors: Floor[];
    favorites: Set<string>;
    isAdmin: boolean;
    onToggleFavorite: (deviceId: string) => void;
    onDeviceControl: (device: Device, newValue: DeviceValue) => void;
    onQuickAction: (action: string) => void;
    isUpdating: boolean;
}

export const DashboardTabs = ({
                                  tabValue,
                                  onTabChange,
                                  filteredDevices,
                                  favoriteDevices,
                                  rooms,
                                  floors,
                                  favorites,
                                  isAdmin,
                                  onToggleFavorite,
                                  onDeviceControl,
                                  onQuickAction,
                                  isUpdating,
                              }: DashboardTabsProps) => {
    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={(_, newValue) => onTabChange(newValue)}>
                    <Tab label={`Alle Controls (${filteredDevices.length})`} />
                    <Tab label="Favorieten" />
                    <Tab label="Snel Acties" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <AllDevicesTab
                    devices={filteredDevices}
                    rooms={rooms}
                    floors={floors}
                    favorites={favorites}
                    isAdmin={isAdmin}
                    onToggleFavorite={onToggleFavorite}
                    onDeviceControl={onDeviceControl}
                    isUpdating={isUpdating}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <FavoritesTab
                    devices={favoriteDevices}
                    favorites={favorites}
                    onToggleFavorite={onToggleFavorite}
                    onDeviceControl={onDeviceControl}
                    isUpdating={isUpdating}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <QuickActionsTab onQuickAction={onQuickAction} />
            </TabPanel>
        </>
    );
};