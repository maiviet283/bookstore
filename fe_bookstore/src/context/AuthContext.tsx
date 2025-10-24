import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authApi } from "../apis/authApi";

// Giữ trạng thái đăng nhập, thông tin user, token, 
// và cung cấp các hàm tiện ích như logout, updateProfile, setAuth, setMessage cho toàn app.

type AuthContextType = {
    user: any | null;
    isAuthenticated: boolean;
    loading: boolean;
    logout: () => Promise<void>;
    updateProfile: (data: any) => Promise<any>;
    setAuth: (user: any, authenticated: boolean) => void;
    setMessage: (msg: string, type?: "success" | "error") => void;
    message: { text: string; type: "success" | "error" } | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
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
        setMessageState(null);
        setTimeout(() => {
            setMessageState({ text, type });
        }, 10);
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

    const updateProfile = async (data: any) => {
        try {
            const res = await authApi.updateProfile(data);
            if (res.status === "success" && res.data) {
                setAuth(res.data, true);
                setMessage("Cập nhật thông tin thành công", "success");
            } else {
                setMessage(res.message || "Cập nhật thất bại", "error");
            }
            return res;
        } catch (error) {
            setMessage("Lỗi khi cập nhật thông tin", "error");
            return { status: "error", message: "Lỗi khi cập nhật thông tin", data: null };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                logout,
                updateProfile,
                setAuth,
                setMessage,
                message,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};
