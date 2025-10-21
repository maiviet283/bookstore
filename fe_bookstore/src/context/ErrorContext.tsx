import { createContext, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ErrorContextType = {
    errorMessage: string | null;
    setErrorMessage: (msg: string | null) => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

let setGlobalErrorFn: ((msg: string | null) => void) | null = null;


export function setGlobalError(message: string | null) {
    if (setGlobalErrorFn) {
        setGlobalErrorFn(message);
    } else {
        console.warn("setGlobalError được gọi khi ErrorProvider chưa được khởi tạo");
    }
}

export function ErrorProvider({ children }: { children: ReactNode }) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    setGlobalErrorFn = setErrorMessage;

    return (
        <ErrorContext.Provider value={{ errorMessage, setErrorMessage }}>
            {children}

            <AnimatePresence>
                {errorMessage && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white text-red-600 text-center p-6 rounded-2xl shadow-lg max-w-md w-full mx-4"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                        >
                            <h2 className="text-lg font-bold mb-2">Đã xảy ra lỗi</h2>
                            <p className="text-sm">{errorMessage}</p>
                            <button
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                onClick={() => setErrorMessage(null)}
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
