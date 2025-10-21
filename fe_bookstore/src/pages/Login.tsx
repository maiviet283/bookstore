import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock } from "lucide-react";
import { authApi } from "../apis/authApi";
import { useAuth } from "../context/AuthContext";

import InputField from "../components/InputField";
import Button from "../components/Button";
import AuthLink from "../components/AuthLink";
import Loading from "../components/Loading";
import { validateUsernameOrPhone, validatePassword } from "../utils/validators";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username_or_phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [errors, setErrors] = useState<{ username_or_phone?: string | null; password?: string | null }>({});

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading, setAuth, setMessage: setGlobalMessage } = useAuth();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // validate trước khi gửi API
    const newErrors = {
      username_or_phone: validateUsernameOrPhone(formData.username_or_phone),
      password: validatePassword(formData.password),
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.login(formData);
      if (res.status === "success" && res.data?.access) {
        const profileRes = await authApi.getProfile();
        if (profileRes.data) {
          setAuth(profileRes.data, true);
          setGlobalMessage("Đăng nhập thành công", "success");
          navigate(from, { replace: true });
        }
      } else {
        setMessage({ type: "error", text: res.message || "Đăng nhập thất bại" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Sai thông tin đăng nhập hoặc lỗi máy chủ" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-indigo-100 p-3 rounded-full mb-3">
            <Lock className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Đăng nhập</h1>
        </div>

        {loading && <Loading text="Đang đăng nhập..." />}
        {message && (
          <div
            className={`p-3 rounded-md text-center ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Username hoặc Số điện thoại"
            name="username_or_phone"
            value={formData.username_or_phone}
            onChange={handleChange}
            placeholder="Nhập Username hoặc Số điện thoại"
            required
            error={errors.username_or_phone}
          />

          <InputField
            label="Mật khẩu"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu..."
            required
            error={errors.password}
          />

          <Button type="submit" loading={loading}>
            Đăng nhập
          </Button>
        </form>

        <AuthLink to="/register" text="Chưa có tài khoản?" actionText="Đăng ký ngay" />
      </div>
    </div>
  );
};

export default LoginPage;
