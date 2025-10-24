import { useEffect, useState, useCallback } from "react";
import { orderApi } from "../apis/orderApi";
import type { Order } from "../types/Order";

export const useOrder = (show: boolean) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        if (show) fetchOrders();
    }, [show, fetchOrders]);

    const reloadOrders = useCallback(() => {
        fetchOrders();
    }, [fetchOrders]);

    return {
        orders,
        loading,
        error,
        reloadOrders,
    };
};
