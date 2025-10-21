import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../apis/authApi";
import { BASE_URL } from "../config";
import type { Customer, UpdateCustomerData } from "../types/Customer";
import Loading from "../components/Loading";

const Account = () => {
    const { user, setAuth, setMessage } = useAuth();
    const [profile, setProfile] = useState<Customer | null>(user);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<UpdateCustomerData>>({});
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    useEffect(() => {
        authApi.getProfile()
            .then(res => {
                if (res.status === "success" && res.data) {
                    setProfile(res.data);
                    setFormData(res.data);
                    setAuth(res.data, true);
                } else {
                    setMessage(res.message || "Không thể tải thông tin", "error");
                }
            })
            .catch(() => {
                setMessage("Lỗi khi lấy thông tin tài khoản", "error");
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        try {
            const data = new FormData();

            // Thêm các trường thông tin vào FormData
            if (formData.full_name) data.append("full_name", formData.full_name);
            if (formData.gender) data.append("gender", formData.gender);
            if (formData.email) data.append("email", formData.email);
            if (formData.phone) data.append("phone", formData.phone);
            if (formData.address) data.append("address", formData.address);

            // Thêm avatar nếu có
            if (avatarFile) {
                data.append("avatar", avatarFile);
            }

            const res = await authApi.updateProfile(data);

            if (res.status === "success" && res.data) {
                setProfile(res.data);
                setAuth(res.data, true);
                setMessage("Cập nhật thành công!", "success");
                setEditing(false);
            } else {
                setMessage(res.message || "Cập nhật thất bại", "error");
            }
        } catch (err) {
            setMessage("Lỗi khi cập nhật thông tin", "error");
        }
    };


    if (!profile) return <Loading text="Đang tải thông tin..." />;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="relative">
                    <img
                        src={
                            avatarFile
                                ? URL.createObjectURL(avatarFile)
                                : profile.avatar
                                    ? `${BASE_URL}${profile.avatar}`
                                    : "/default-avatar.png"
                        }
                        alt={profile.full_name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-md"
                    />
                    {editing && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="absolute bottom-0 left-0 w-full text-xs opacity-90 cursor-pointer"
                        />
                    )}
                </div>

                <div className="text-center md:text-left w-full md:w-2/3">
                    {editing ? (
                        <>
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name || ""}
                                onChange={handleChange}
                                className="border p-2 rounded w-full mb-2"
                            />
                            <select
                                name="gender"
                                value={formData.gender || ""}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="M">Nam</option>
                                <option value="F">Nữ</option>
                                <option value="O">Khác</option>
                            </select>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-semibold text-gray-900">{profile.full_name}</h2>
                            <p className="text-gray-600 text-lg">@{profile.username}</p>
                            <p className="mt-2 text-gray-700 font-medium">
                                {profile.gender === "M" ? "Nam" : profile.gender === "F" ? "Nữ" : "Khác"}
                            </p>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="font-medium text-gray-700">Email:</label>
                    <input
                        type="email"
                        name="email"
                        disabled={!editing}
                        value={formData.email || ""}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label className="font-medium text-gray-700">Số điện thoại:</label>
                    <input
                        type="text"
                        name="phone"
                        disabled={!editing}
                        value={formData.phone || ""}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="font-medium text-gray-700">Địa chỉ:</label>
                    <input
                        type="text"
                        name="address"
                        disabled={!editing}
                        value={formData.address || ""}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                {editing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Lưu lại
                        </button>
                        <button
                            onClick={() => setEditing(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                        >
                            Hủy
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setEditing(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Chỉnh sửa
                    </button>
                )}
            </div>
        </div>
    );
};

export default Account;
