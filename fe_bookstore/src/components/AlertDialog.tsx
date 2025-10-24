import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AlertDialogProps {
    message: string;
    show: boolean;
    onClose: () => void;
    autoClose?: boolean;
    duration?: number;
}

export default function AlertDialog({
    message,
    show,
    onClose,
    autoClose = true,
    duration = 2000,
}: AlertDialogProps) {
    const okButtonRef = useRef<HTMLButtonElement>(null);
    const [progress, setProgress] = useState(0);

    // 🔁 Auto close + progress animation
    useEffect(() => {
        if (!show || !autoClose) return;
        let start: number | null = null;
        let frameId: number;

        const animate = (timestamp: number) => {
            if (start === null) start = timestamp;
            const elapsed = timestamp - start;
            const percentage = Math.min((elapsed / duration) * 100, 100);
            setProgress(percentage);

            if (elapsed < duration) frameId = requestAnimationFrame(animate);
            else onClose();
        };

        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [show, autoClose, duration, onClose]);

    // Focus vào nút OK khi hiển thị
    useEffect(() => {
        if (show && okButtonRef.current) {
            okButtonRef.current.focus();
        }
    }, [show]);

    const handleClose = () => {
        setProgress(0);
        onClose();
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative bg-white/80 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-8 max-w-sm w-full text-center overflow-hidden"
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {/* Hiệu ứng ánh sáng di chuyển */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent animate-pulse"
                        />

                        <p className="text-gray-800 font-medium mb-6 text-lg">
                            {message}
                        </p>

                        {/* --- Nút OK hiện đại --- */}
                        <div className="relative inline-flex items-center justify-center">
                            <motion.button
                                ref={okButtonRef}
                                onClick={handleClose}
                                className="relative z-10 bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-semibold tracking-wide hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-md transition-all"
                            >
                                OK
                            </motion.button>

                            {/* Viền chạy quanh nút (chữ nhật, không phải tròn) */}
                            <motion.div
                                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 rounded-b-lg"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "linear", duration: 0.1 }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
