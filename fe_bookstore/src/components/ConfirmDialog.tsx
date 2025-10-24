import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmDialogProps {
    title?: string;
    message: string;
    show: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

export default function ConfirmDialog({
    title = "Xác nhận hành động",
    message,
    show,
    onConfirm,
    onCancel,
    confirmText = "Đồng ý",
    cancelText = "Huỷ",
}: ConfirmDialogProps) {
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (show && confirmButtonRef.current) {
            confirmButtonRef.current.focus();
        }
    }, [show]);

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
                        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-md w-full text-center border border-gray-200 dark:border-gray-700"
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        {/* Tiêu đề */}
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                            {title}
                        </h3>

                        {/* Nội dung */}
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                            {message}
                        </p>

                        {/* Hai nút hành động */}
                        <div className="flex justify-center gap-4">
                            <motion.button
                                ref={confirmButtonRef}
                                onClick={onConfirm}
                                whileTap={{ scale: 0.95 }}
                                className="px-5 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                            >
                                {confirmText}
                            </motion.button>

                            <motion.button
                                onClick={onCancel}
                                whileTap={{ scale: 0.95 }}
                                className="px-5 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                            >
                                {cancelText}
                            </motion.button>
                        </div>

                        <motion.div
                            className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent"
                            animate={{
                                borderImageSource:
                                    "linear-gradient(120deg, #6366f1, #8b5cf6, #3b82f6, #6366f1)",
                                borderImageSlice: 1,
                            }}
                            transition={{
                                repeat: Infinity,
                                repeatType: "mirror",
                                duration: 3,
                            }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
