import { createContext } from "react";

export interface User {
    username: string;
    role: "admin" | "user";
}

export interface AuthContextType {
    user: User | null;
    loginAsUser: () => void;
    loginAsAdmin: () => void;
    logout: () => void;
    isLoggedIn: () => boolean;
    isAdmin: () => boolean;
    isGebruiker: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
