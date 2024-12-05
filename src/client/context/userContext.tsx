import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface UserContextType {
    userId: string | null;
    token: string | null;
    setUser: (userId: string, token: string) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [userId, setUserId] = useState<string | null>(localStorage.getItem("userId"));
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    useEffect(() => {
        // On mount, check if userId and token are in localStorage
        const storedUserId = localStorage.getItem("userId");
        const storedToken = localStorage.getItem("token");
        if (storedUserId && storedToken) {
            setUserId(storedUserId);
            setToken(storedToken);
        }
    }, []);

    const setUser = (userId: string, token: string) => {
        setUserId(userId);
        setToken(token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setUserId(null);
        setToken(null);
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
    };

    return (
        <UserContext.Provider value={{ userId, token, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
