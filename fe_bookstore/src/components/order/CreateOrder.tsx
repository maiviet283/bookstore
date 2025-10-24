import React from "react";
import { useCreateOrder } from "../../hooks/useCreateOrder";
import Loading from "../Loading";

interface OrderProps {
    show: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const CreateOrder: React.FC<OrderProps> = ({ show, onClose, onSuccess }) => {
    const {
        loading,
        shippingAddress,
        setShippingAddress,
        paymentMethod,
        setPaymentMethod,
        note,
        setNote,
        submitting,
        handleSubmit,
    } = useCreateOrder(show);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/60 p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full mt-10 p-6 relative shadow-2xl border border-gray-200">
                {/* ❌ Nút đóng */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 text-lg font-bold transition-colors"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center sm:text-left">
                    🧾 Đặt Mua Tất Cả Các Sách Trong Giỏ Hàng
                </h2>

                {loading ? (
                    <Loading text="Đang tải đơn hàng..." />
                ) : (
                    <>
                        {/* 🔹 Form thông tin giao hàng */}
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Địa chỉ giao hàng
                                </label>
                                <input
                                    type="text"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Phương thức thanh toán
                                </label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                                    <option value="momo">MoMo</option>
                                    <option value="zalopay">ZaloPay</option>
                                    <option value="stripe">Stripe</option>
                                    <option value="paypal">PayPal</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Ghi chú (nếu có)
                                </label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="VD: Giao buổi chiều, gọi trước khi giao..."
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows={2}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => handleSubmit(onSuccess, onClose)}
                                disabled={submitting}
                                className={`px-6 py-2 rounded-xl font-semibold shadow-md transition-all ${submitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                    }`}
                            >
                                {submitting ? "⏳ Đang xử lý..." : "Xác nhận đặt hàng"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreateOrder;
