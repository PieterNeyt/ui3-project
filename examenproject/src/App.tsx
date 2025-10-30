import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Navbar from "./components/navbar/Navbar";
import { AuthProvider } from "./context/AuthProvider";
import { CustomThemeProvider } from "./context/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FloorsPage } from "./pages/FloorsPage";
import { RoomsPage } from "./pages/RoomsPage";
import { Box, CssBaseline } from "@mui/material";
import { DevicesPage } from "./pages/DevicesPage.tsx";
import {DashboardPage} from "./pages/DashboardPage.tsx";
import {ScenesPage} from "./pages/ScenesPage.tsx";
import {SceneDetailPage} from "./pages/SceneDetailPage.tsx";
import { TimeSlotManager } from "./components/timeslot/TimeSlotManager";
import {LoggingView} from "./components/logging/LoggingView.tsx";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <CustomThemeProvider>
                <CssBaseline />
                <AuthProvider>
                    <BrowserRouter>
                        <Navbar />
                        <TimeSlotManager />
                        <Box component="main" sx={{
                            minHeight: '100vh',
                            bgcolor: 'background.default',
                            color: 'text.primary',
                        }}>
                            <Routes>
                                <Route path="/" element={<Navigate to="/floors" />} />
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/floors" element={<FloorsPage />} />
                                <Route path="/floors/:verdiepingId/rooms" element={<RoomsPage />} />
                                <Route path="/rooms/:kamerId/devices" element={<DevicesPage />} />
                                <Route path="/scenes" element={<ScenesPage />} />
                                <Route path="/scenes/:id" element={<SceneDetailPage />} />
                                <Route path="/logging" element={<LoggingView />} />
                            </Routes>
                        </Box>
                    </BrowserRouter>
                </AuthProvider>
            </CustomThemeProvider>
        </QueryClientProvider>
    );
}

export default App;