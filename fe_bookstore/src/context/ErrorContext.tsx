import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

type AlertType = "success" | "error";

type ErrorContextType = {
    alert: { type: AlertType; message: string } | null;
    setAlert: (type: AlertType, message: string | null) => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

let setGlobalAlertFn: ((type: AlertType, message: string | null) => void) | null = null;

/**
 * Gọi ở bất kỳ đâu trong app:
 * setGlobalAlert("success", "Cập nhật thành công!");
 * setGlobalAlert("error", "Đăng nhập thất bại!");
 */
export function setGlobalAlert(type: AlertType, message: string | null) {
    if (setGlobalAlertFn) {
        setGlobalAlertFn(type, message);
    } else {
        console.warn("setGlobalAlert được gọi khi ErrorProvider chưa được khởi tạo");
    }
}

export function ErrorProvider({ children }: { children: ReactNode }) {
    const [alert, setAlertState] = useState<{ type: AlertType; message: string } | null>(null);

    setGlobalAlertFn = (type, message) => {
        if (message) setAlertState({ type, message });
        else setAlertState(null);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") setAlertState(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <ErrorContext.Provider
            value={{
                alert,
                setAlert: (type, message) => {
                    if (message) setAlertState({ type, message });
                    else setAlertState(null);
                },
            }}
        >
            {children}

            <AnimatePresence>
                {alert && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className={`text-center p-6 rounded-2xl shadow-lg max-w-md w-full mx-4 ${alert.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                        >
                            <h2 className="text-lg font-bold mb-2">
                                {alert.type === "success" ? "Thành công" : "Đã xảy ra lỗi"}
                            </h2>
                            <p className="text-sm">{alert.message}</p>
                            <button
                                className={`mt-4 px-4 py-2 rounded-lg text-white ${alert.type === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                                    } transition`}
                                onClick={() => setAlertState(null)}
                                autoFocus
                            >
                                Đóng
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ErrorContext.Provider>
    );
}

export function useErrorStore() {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error("useErrorStore must be used within an ErrorProvider");
    }
    return context;
}
