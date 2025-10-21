import { useState } from "react";

import { authApi } from "../apis/authApi";
import { useRedirectIfLoggedIn } from "../hooks/useRedirectIfLoggedIn";
import InputField from "../components/InputField";
import Button from "../components/Button";
import AuthLink from "../components/AuthLink";
import Loading from "../components/Loading";
import { validateUsername, validateFullName, validatePhone, validatePassword } from "../utils/validators";


export default function RegisterPage() {
    useRedirectIfLoggedIn();

    const [formData, setFormData] = useState({ full_name: "", phone: "", username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: null });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const newErrors: { [key: string]: string | null } = {
            username: validateUsername(formData.username),
            full_name: validateFullName(formData.full_name),
            phone: validatePhone(formData.phone),
            password: validatePassword(formData.password),
        };

        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const res = await authApi.register(formData);
            setMessage({ type: res.status === "success" ? "success" : "error", text: res.message || "" });
        } catch (err: any) {
            setMessage({ type: "error", text: err?.message || "Lỗi hệ thống" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm border border-gray-100">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-indigo-100 p-3 rounded-full mb-3">
                        <span className="text-indigo-600 font-bold text-xl">📝</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 text-center">Đăng Ký Tài Khoản</h2>
                </div>

                {loading && <Loading text="Đang đăng ký..." />}
                {message && (
                    <div className={`p-3 rounded-md text-center ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Họ và tên" name="full_name" value={formData.full_name} onChange={handleChange} error={errors.full_name} />
                    <InputField label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} />
                    <InputField label="Tên đăng nhập" name="username" value={formData.username} onChange={handleChange} error={errors.username} />
                    <InputField label="Mật khẩu" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />

                    <Button type="submit" loading={loading}>Đăng Ký</Button>
                </form>

                <AuthLink to="/login" text="Bạn đã có tài khoản?" actionText="Đăng Nhập" />
            </div>
        </div>
    );
}
