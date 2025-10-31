import { useState, type ReactNode } from "react";
import { AuthContext, type User, type AuthContextType } from "./AuthContext";
import { userService } from "../services/userService";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider= ({ children }:AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (userId: string) => {
        setLoading(true);
        setError(null);

        try {
            const userData = await userService.getUserById(userId);
            setUser(userData);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login mislukt';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setError(null);
    };

    // Handige directe login functies voor je knopjes
    const loginAsUser = () => login("1"); // Pieter Neyt
    const loginAsAdmin = () => login("2"); // Admin User

    const isLoggedIn = () => user !== null;
    const isAdmin = () => user?.role === "admin";
    const isGebruiker = () => user?.role === "user";

    const value: AuthContextType = {
        user,
        login,
        logout,
        loginAsUser,
        loginAsAdmin,
        isLoggedIn,
        isAdmin,
        isGebruiker,
        loading,
        error
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};