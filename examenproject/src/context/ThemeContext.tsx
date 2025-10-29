import { createContext } from 'react';

export interface ThemeContextType {
    mode: 'light' | 'dark';
    toggleColorMode: () => void;
    setMode: (mode: 'light' | 'dark') => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);