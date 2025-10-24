import { useEffect, useRef, useState } from "react";
import { cartApi } from "../apis/cartApi";
import type { Cart, CartItem } from "../types/Cart";
import { validateQuantity } from "../utils/validators";

export const useCart = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [clearing, setClearing] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [localQuantities, setLocalQuantities] = useState<{ [id: number]: number }>({});

    const debounceTimers = useRef<{ [id: number]: ReturnType<typeof setTimeout> }>({});

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await cartApi.getCart();
            if (res.status === "success") setCart(res.data);
            else setCart(null);
        } catch (err) {
            console.error("Lỗi khi tải giỏ hàng:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleRemoveItem = async (item: CartItem) => {
        setUpdatingId(item.id);
        try {
            await cartApi.removeItem(item.book_id);
            const res = await cartApi.getCart();
            if (res.status === "success") setCart(res.data);
            setLocalQuantities((prev) => {
                const copy = { ...prev };
                delete copy[item.id];
                return copy;
            });
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleQuantityChange = (item: CartItem, delta: number) => {
        const currentQty = localQuantities[item.id] ?? item.quantity;
        const newQty = currentQty + delta;

        if (newQty <= 0) {
            handleRemoveItem(item);
            return;
        }

        setLocalQuantities((prev) => ({ ...prev, [item.id]: newQty }));

        if (debounceTimers.current[item.id]) {
            clearTimeout(debounceTimers.current[item.id]);
        }

        debounceTimers.current[item.id] = setTimeout(async () => {
            setUpdatingId(item.id);
            try {
                await cartApi.setItemQuantity(item.book_id, newQty);
                const res = await cartApi.getCart();
                if (res.status === "success") setCart(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setUpdatingId(null);
            }
        }, 500);
    };

    const handleSetQuantity = async (item: CartItem, newQty: number) => {
        const error = validateQuantity(newQty);
        if (error) {
            window.alert(error);
            return;
        }

        if (newQty <= 0) {
            handleRemoveItem(item);
            return;
        }

        setUpdatingId(item.id);
        try {
            await cartApi.setItemQuantity(item.book_id, newQty);
            const res = await cartApi.getCart();
            if (res.status === "success") setCart(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setUpdatingId(null);
        }
    };

    const confirmClearCart = () => setShowConfirm(true);

    const handleConfirmClear = async () => {
        setShowConfirm(false);
        setClearing(true);
        try {
            await cartApi.clearCart();
            setCart(null);
            setLocalQuantities({});
        } finally {
            setClearing(false);
        }
    };

    return {
        cart,
        loading,
        updatingId,
        clearing,
        showConfirm,
        setShowConfirm,
        localQuantities,
        handleQuantityChange,
        handleSetQuantity,
        handleRemoveItem,
        confirmClearCart,
        handleConfirmClear,
        setLocalQuantities,
        fetchCart
    };
};
