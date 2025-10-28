import React, { useState, type ReactNode } from "react";
import { AuthContext, type User, type AuthContextType } from "./AuthContext";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const loginAsUser = () => setUser({ username: "Jan Peters", role: "gebruiker" });
    const loginAsAdmin = () => setUser({ username: "Admin User", role: "admin" });
    const logout = () => setUser(null);

    const isLoggedIn = () => user !== null;
    const isAdmin = () => user?.role === "admin";
    const isGebruiker = () => user?.role === "gebruiker";

    const value: AuthContextType = {
        user,
        loginAsUser,
        loginAsAdmin,
        logout,
        isLoggedIn,
        isAdmin,
        isGebruiker,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
