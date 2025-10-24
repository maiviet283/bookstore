import { useEffect, useState, useCallback } from "react";
import { orderApi } from "../apis/orderApi";
import type { Order } from "../types/Order";
import { useAuth } from "../context/AuthContext";

export const useCreateOrder = (show: boolean) => {
    const { user, setMessage } = useAuth();

    // Trạng thái dữ liệu
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Trạng thái form
    const [shippingAddress, setShippingAddress] = useState(user?.address || "");
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // 🌀 Lấy danh sách đơn hàng
    const fetchOrders = useCallback(async () => {
        if (!show) return;
        try {
            setLoading(true);
            setError(null);
            const res = await orderApi.getOrders();
            setOrders(res.data || []);
        } catch (err: any) {
            console.error("Lỗi khi tải đơn hàng:", err);
            setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    }, [show]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // 🧾 Hàm gửi yêu cầu tạo đơn hàng
    const handleSubmit = useCallback(
        async (onSuccess?: () => void, onClose?: () => void) => {
            if (!shippingAddress.trim()) {
                setMessage("Vui lòng nhập địa chỉ giao hàng", "error");
                return;
            }

            setSubmitting(true);
            try {
                const payload = {
                    shipping_address: shippingAddress,
                    payment_method: paymentMethod as
                        | "cod"
                        | "momo"
                        | "zalopay"
                        | "stripe"
                        | "paypal",
                    note,
                };

                const res = await orderApi.createOrder(payload);

                if (res.status === "success") {
                    setMessage("✅ Đặt hàng thành công!", "success");
                    console.log("Đơn hàng đã được tạo:", res.data);
                    onClose?.();
                    onSuccess?.();
                    fetchOrders(); // reload lại đơn hàng
                } else {
                    setMessage(res.message || "Đặt hàng thất bại", "error");
                }
            } catch (error) {
                console.error(error);
                setMessage("Lỗi khi gửi yêu cầu đặt hàng", "error");
            } finally {
                setSubmitting(false);
            }
        },
        [shippingAddress, paymentMethod, note, fetchOrders, setMessage]
    );

    return {
        // Dữ liệu đơn hàng
        orders,
        loading,
        error,

        // Form control
        shippingAddress,
        setShippingAddress,
        paymentMethod,
        setPaymentMethod,
        note,
        setNote,
        submitting,

        // Hành động
        handleSubmit,
    };
};
