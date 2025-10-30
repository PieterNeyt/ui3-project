import { createContext } from "react";

export interface User {
    id: string;
    username: string;
    role: "admin" | "user";
}

export interface AuthContextType {
    user: User | null;
    login: (userId: string) => Promise<void>;
    logout: () => void;
    loginAsUser: () => void;
    loginAsAdmin: () => void;
    isLoggedIn: () => boolean;
    isAdmin: () => boolean;
    isGebruiker: () => boolean;
    loading: boolean;
    error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);