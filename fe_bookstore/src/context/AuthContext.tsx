import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authApi } from "../apis/authApi";

type AuthContextType = {
    user: any | null;
    isAuthenticated: boolean;
    loading: boolean;
    logout: () => Promise<void>;
    setAuth: (user: any, authenticated: boolean) => void;
    setMessage: (msg: string, type?: "success" | "error") => void;
    message: { text: string; type: "success" | "error" } | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // để chờ load profile
    const [message, setMessageState] = useState<{ text: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            fetchProfile().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    async function fetchProfile() {
        try {
            const res = await authApi.getProfile();
            if (res.data) setAuth(res.data, true);
        } catch {
            localStorage.removeItem("access_token");
            setAuth(null, false);
        }
    }

    const setAuth = (user: any, authenticated: boolean) => {
        setUser(user);
        setIsAuthenticated(authenticated);
    };

    const setMessage = (text: string, type: "success" | "error" = "success") => {
        setMessageState({ text, type });
        if (text) setTimeout(() => setMessageState(null), 3000);
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch {
            console.warn("Logout failed or token expired, forcing logout");
        } finally {
            setAuth(null, false);
            localStorage.removeItem("access_token");
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, logout, setAuth, setMessage, message }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};
