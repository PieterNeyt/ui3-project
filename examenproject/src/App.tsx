import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { useRoutes } from "react-router-dom";

import { AuthProvider } from "./context/AuthProvider";
import { CustomThemeProvider } from "./context/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Box, CssBaseline } from "@mui/material";
import { TimeSlotManager } from "./components/timeslot/TimeSlotManager";
import routes from '~react-pages';
import {Navbar} from "./components/navbar/Navbar.tsx";
const queryClient = new QueryClient();

function AppRoutes() {
    return useRoutes(routes);
}

function App() {
    console.log('🚀 All generated routes:', routes);
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
                            <AppRoutes />
                        </Box>
                    </BrowserRouter>
                </AuthProvider>
            </CustomThemeProvider>
        </QueryClientProvider>
    );
}

export default App;