import { useCart } from "../hooks/useCart";
import Loading from "../components/Loading";
import Button from "../components/Button";
import ConfirmDialog from "../components/ConfirmDialog";
import { BASE_URL } from "../config";
import { useState } from "react";
import Order from "../components/order/Order";
import CreateOrder from "../components/order/CreateOrder";

const Cart = () => {
    const {
        cart,
        loading,
        updatingId,
        clearing,
        showConfirm,
        setShowConfirm,
        localQuantities,
        handleQuantityChange,
        handleSetQuantity,
        confirmClearCart,
        handleConfirmClear,
        setLocalQuantities,
        fetchCart,
    } = useCart();

    const [showOrders, setShowOrders] = useState(false);
    const [showCreateOrder, setShowCreateOrder] = useState(false);

    if (loading) return <Loading text="Đang tải giỏ hàng..." />;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="text-center py-20 text-gray-700">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    🛒 Giỏ hàng trống
                </h2>

                <p className="text-gray-500 mb-6">
                    Hãy thêm vài cuốn sách vào giỏ để bắt đầu mua sắm nhé 📚
                </p>

                <Button
                    onClick={() => setShowOrders(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 
                 bg-indigo-600 hover:bg-indigo-700 text-white 
                 font-semibold rounded-xl shadow-md hover:shadow-lg 
                 transition-all duration-200 ease-out text-sm"
                    style={{ width: "auto" }}
                >
                    📝 Xem đơn hàng
                </Button>
                <Order show={showOrders} onClose={() => setShowOrders(false)} />
            </div>
        );

    }

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-snug">
                    🛒 Giỏ Hàng
                </h1>
                <Button
                    onClick={() => setShowOrders(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg whitespace-nowrap flex items-center justify-center gap-1 text-sm min-w-fit"
                    style={{ width: "fit-content" }}
                >
                    📝 Đơn Hàng
                </Button>
            </div>

            <div className="space-y-4">
                {cart.items.map((item) => {
                    const qty = localQuantities[item.id] ?? item.quantity;
                    return (
                        <div
                            key={item.id}
                            className={`flex flex-col sm:flex-row items-center sm:items-start gap-4 border rounded-2xl p-4 shadow-sm bg-white transition-all ${updatingId === item.id
                                ? "opacity-60 scale-[0.99]"
                                : "hover:shadow-md"
                                }`}
                        >
                            <img
                                src={`${BASE_URL}${item.book_image || ""}`}
                                alt={item.book_name}
                                className="w-32 h-44 sm:w-24 sm:h-32 object-cover rounded-xl border flex-shrink-0"
                            />
                            <div className="flex-1 w-full text-center sm:text-left">
                                <h3 className="font-semibold text-lg sm:text-xl text-gray-800 line-clamp-2">{item.book_name}</h3>
                                <p className="text-gray-500 text-sm sm:text-base">
                                    Giá: {item.book_price.toLocaleString()} ₫
                                </p>
                                <div className="flex justify-center sm:justify-start items-center mt-3 gap-2 sm:gap-3">
                                    <Button
                                        className="w-10 h-10 text-xl font-bold rounded-full 
                                                    bg-gradient-to-br from-red-500 to-red-600 text-white 
                                                    hover:from-red-600 hover:to-red-700 
                                                    active:scale-90 active:brightness-90 
                                                    shadow-md hover:shadow-lg 
                                                    transition-all duration-200 ease-out !p-0"
                                        onClick={() => handleQuantityChange(item, -1)}
                                        disabled={updatingId === item.id}
                                    >
                                        -
                                    </Button>
                                    <input
                                        className="w-14 sm:w-16 h-9 sm:h-10 text-center border border-gray-300 rounded-lg text-base font-medium text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none 
                                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"                                        type="number"
                                        min={0}
                                        value={qty || ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === "") {
                                                setLocalQuantities((prev) => ({ ...prev, [item.id]: 0 }));
                                                return;
                                            }
                                            const num = Number(val);
                                            if (isNaN(num) || num < 1) return;
                                            setLocalQuantities((prev) => ({ ...prev, [item.id]: num }));
                                        }}
                                        onBlur={(e) => {
                                            const val = Number(e.target.value);
                                            if (val >= 1) handleSetQuantity(item, val);
                                        }}
                                    />
                                    <Button
                                        className="w-10 h-10 text-xl font-bold rounded-full 
                                                    bg-gradient-to-br from-indigo-500 to-indigo-600 text-white 
                                                    hover:from-indigo-600 hover:to-indigo-700 
                                                    active:scale-90 active:brightness-90 
                                                    shadow-md hover:shadow-lg 
                                                    transition-all duration-200 ease-out !p-0"
                                        onClick={() => handleQuantityChange(item, +1)}
                                        disabled={updatingId === item.id}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                            <div className="text-indigo-600 font-semibold text-lg sm:text-xl text-center sm:text-right min-w-[100px]">
                                {(item.book_price * qty).toLocaleString()} ₫
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 border-t pt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left text-lg">
                    <span className="font-semibold text-gray-700">Tổng tiền: </span>
                    <span className="text-indigo-600 font-bold text-2xl">{cart.total_amount.toLocaleString()} VNĐ</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button
                        onClick={confirmClearCart}
                        loading={clearing}
                        className="bg-red-500 hover:bg-red-600 w-full sm:w-40"
                    >
                        Xoá toàn bộ
                    </Button>
                    <Button
                        disabled={clearing}
                        onClick={() => setShowCreateOrder(true)}
                        className="w-full sm:w-40 bg-indigo-600 hover:bg-indigo-500"
                    >
                        Thanh toán
                    </Button>
                </div>
            </div>

            <ConfirmDialog
                title="Xác nhận xoá giỏ hàng"
                message="Bạn có chắc chắn muốn xoá toàn bộ sản phẩm trong giỏ hàng không? Hành động này không thể hoàn tác."
                show={showConfirm}
                onConfirm={handleConfirmClear}
                onCancel={() => setShowConfirm(false)}
                confirmText="Đồng ý"
                cancelText="Huỷ"
            />

            <Order show={showOrders} onClose={() => setShowOrders(false)} />
            <CreateOrder
                show={showCreateOrder}
                onClose={() => setShowCreateOrder(false)}
                onSuccess={() => {
                    fetchCart();
                }}
            />
        </div>
    );
};

export default Cart;
