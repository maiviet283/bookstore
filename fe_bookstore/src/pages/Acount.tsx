import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { authApi } from "../apis/authApi";
import { BASE_URL } from "../config";
import type { Customer } from "../types/Customer";
import Loading from "../components/Loading";


const Account = () => {
    const { user, setAuth, setMessage } = useAuth();
    const [profile, setProfile] = useState<Customer | null>(user);

    useEffect(() => {
        if (!profile) {
            authApi.getProfile()
                .then(res => {
                    if (res.status === "success" && res.data) {
                        setProfile(res.data);
                        setAuth(res.data, true);
                    } else {
                        setMessage(res.message || "Không thể tải thông tin", "error");
                    }
                })
                .catch(() => {
                    setMessage("Lỗi khi lấy thông tin tài khoản", "error");
                });
        }
    }, [profile, setAuth, setMessage]);

    if (!profile) {
        return (
            <Loading text="Đang Tải Thông Tin....." />
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
                <div className="flex-shrink-0">
                    <img
                        src={profile.avatar ? `${BASE_URL}${profile.avatar}` : "/default-avatar.png"}
                        alt={profile.full_name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-md"
                    />
                </div>
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-semibold text-gray-900">{profile.full_name}</h2>
                    <p className="text-gray-600 text-lg">@{profile.username}</p>
                    <p className="mt-2 text-gray-700 font-medium">
                        {profile.gender === "M" ? "Nam" : profile.gender === "F" ? "Nữ" : "Khác"} | {profile.date_of_birth || "Chưa cập nhật"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 bg-indigo-50 rounded-lg shadow-sm">
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-800">{profile.email || "Chưa cập nhật"}</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg shadow-sm">
                    <span className="font-medium text-gray-700">Số điện thoại:</span>
                    <p className="text-gray-800">{profile.phone || "Chưa cập nhật"}</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg shadow-sm sm:col-span-2">
                    <span className="font-medium text-gray-700">Địa chỉ:</span>
                    <p className="text-gray-800">{profile.address || "Chưa cập nhật"}</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg shadow-sm">
                    <span className="font-medium text-gray-700">Điểm thưởng:</span>
                    <p className="text-gray-800">{profile.loyalty_points}</p>
                </div>
            </div>
        </div>
    );
};

export default Account;
