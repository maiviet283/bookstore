import { useEffect, useState } from "react";
import { cartApi } from "../apis/cartApi";
import type { Cart, CartItem } from "../types/Cart";

import { validateQuantity } from "../utils/validators";
import Loading from "../components/Loading";
import Button from "../components/Button";
import { BASE_URL } from "../config";

const Cart = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [clearing, setClearing] = useState(false);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await cartApi.getCart();
            if (res.status === "success") {
                setCart(res.data);
            } else {
                setCart(null);
            }
        } catch (err) {
            console.error("Lỗi khi tải giỏ hàng:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantity = async (item: CartItem, action: "add" | "remove") => {
        setUpdatingId(item.id);
        try {
            if (action === "add") {
                await cartApi.addItem(item.book_id, 1);
            } else {
                if (item.quantity <= 1) {
                    await cartApi.removeItem(item.book_id);
                } else {
                    await cartApi.removeItem(item.book_id, 1);
                }
            }

            const res = await cartApi.getCart();
            if (res.status === "success") setCart(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleClearCart = async () => {
        if (!cart || cart.items.length === 0) return;
        if (!window.confirm("Bạn có chắc muốn xoá toàn bộ giỏ hàng?")) return;
        setClearing(true);
        try {
            await cartApi.clearCart();
            setCart(null);
        } finally {
            setClearing(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleSetQuantity = async (item: CartItem, newQty: number) => {
        const error = validateQuantity(newQty);

        if (error) {
            alert(error);
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


    if (loading) return <Loading text="Đang tải giỏ hàng..." />;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="text-center py-10 text-gray-600">
                <h2 className="text-2xl font-semibold mb-3">Giỏ hàng của bạn trống</h2>
                <p>Hãy thêm một vài cuốn sách vào giỏ để bắt đầu mua sắm nhé!</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">🛒 Giỏ hàng của bạn</h1>

            <div className="space-y-4">
                {cart.items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-4 border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                    >
                        <img
                            src={`${BASE_URL}${item.book_image || ""}`}
                            alt={item.book_name}
                            className="w-20 h-28 object-cover rounded-md"
                        />

                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">{item.book_name}</h3>
                            <p className="text-gray-500">
                                Giá: {item.book_price.toLocaleString()} ₫
                            </p>

                            <div className="flex items-center mt-2 gap-2">
                                <Button
                                    className="w-8 h-8 rounded-full !p-0"
                                    onClick={() => handleQuantity(item, "remove")}
                                    disabled={updatingId === item.id}
                                >
                                    -
                                </Button>
                                <input
                                    type="number"
                                    min={0}
                                    className="w-16 border rounded-lg text-center"
                                    value={item.quantity}
                                    onChange={(e) => handleSetQuantity(item, Number(e.target.value))}
                                />
                                <Button
                                    className="w-8 h-8 rounded-full !p-0"
                                    onClick={() => handleQuantity(item, "add")}
                                    disabled={updatingId === item.id}
                                >
                                    +
                                </Button>
                            </div>
                        </div>

                        <div className="text-right font-semibold text-indigo-600">
                            {(item.book_price * item.quantity).toLocaleString()} ₫
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 border-t pt-4 flex justify-between items-center">
                <div className="text-lg">
                    <span className="font-semibold">Tổng tiền: </span>
                    <span className="text-indigo-600 font-bold text-2xl">
                        {cart.total_amount.toLocaleString()} ₫
                    </span>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={handleClearCart}
                        loading={clearing}
                        className="bg-red-500 hover:bg-red-600 w-40"
                    >
                        Xoá toàn bộ
                    </Button>
                    <Button disabled={clearing} className="w-40">
                        Thanh toán
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
