import React from "react";
import Loading from "../Loading";
import { useOrder } from "../../hooks/useOrder";

interface OrderProps {
    show: boolean;
    onClose: () => void;
}

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    delivered: "bg-indigo-100 text-indigo-800",
    cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    paid: "Đã thanh toán",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy",
};

const Order: React.FC<OrderProps> = ({ show, onClose }) => {
    const { orders, loading } = useOrder(show);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/60 p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full mt-10 p-6 relative shadow-2xl border border-gray-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 text-lg font-bold transition-colors"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center sm:text-left">
                    🧾 Đơn hàng của tôi
                </h2>

                {loading ? (
                    <Loading text="Đang tải đơn hàng..." />
                ) : orders.length === 0 ? (
                    <p className="text-gray-500 text-center">
                        Bạn chưa có đơn hàng nào.
                    </p>
                ) : (
                    <div className="space-y-4 max-h-[70vh] overflow-auto pr-2">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all bg-white"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                                    <span className="font-semibold text-gray-800">
                                        {order.order_code}
                                    </span>
                                    <span className="text-sm text-gray-500 mt-1 sm:mt-0">
                                        {new Date(order.created_at).toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2 sm:gap-0">
                                    <p className="text-gray-700 font-medium">
                                        Tổng tiền:{" "}
                                        <span className="text-indigo-600">
                                            {Number(order.total_amount).toLocaleString()} VNĐ
                                        </span>
                                    </p>
                                    <span
                                        className={`px-2 py-1 rounded-full text-sm font-medium ${statusColors[order.status] ||
                                            "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {statusLabels[order.status] || order.status}
                                    </span>
                                </div>

                                <div className="border-t pt-2">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between text-gray-700 text-sm py-1 border-b last:border-b-0"
                                        >
                                            <span className="truncate max-w-[70%]">
                                                {item.book_name} x {item.quantity}
                                            </span>
                                            <span className="font-medium">
                                                {Number(item.subtotal).toLocaleString()} VNĐ
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Order;
