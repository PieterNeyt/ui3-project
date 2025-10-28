import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Navbar from "./components/navbar/Navbar";
import { AuthProvider } from "./context/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FloorsPage } from "./pages/FloorsPage";
import { Box } from "@mui/material";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <Navbar />
                    <Box component="main" sx={{ minHeight: '100vh' }}>
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                            <Route path="/floors" element={<FloorsPage />} />
                            {}
                        </Routes>
                    </Box>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;