import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Navbar from "./components/navbar/Navbar";
import { AuthProvider } from "./context/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FloorsPage } from "./pages/FloorsPage";
import { RoomsPage } from "./pages/RoomsPage";
import { Box } from "@mui/material";
import {DevicesPage} from "./pages/DevicesPage.tsx";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <Navbar />
                    <Box component="main" sx={{ minHeight: '100vh' }}>
                        <Routes>
                            <Route path="/" element={<Navigate to="/floors" />} />
                            <Route path="/floors" element={<FloorsPage />} />
                            <Route path="/floors/:verdiepingId/rooms" element={<RoomsPage />} />
                            <Route path="/rooms/:kamerId/devices" element={<DevicesPage />} />
                        </Routes>
                    </Box>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;