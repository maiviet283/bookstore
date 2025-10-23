import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../apis/authApi";
import { setGlobalAlert } from "../context/ErrorContext";
import type { Customer, UpdateCustomerData, ChangePasswordData } from "../types/Customer";

import {
  validateUsername,
  validateFullName,
  validatePhone,
  validateEmail,
  validateAddress,
  validateDateOfBirth,
} from "../utils/validators";

export const useAccount = () => {
  const { user, setAuth, updateProfile } = useAuth();

  const [profile, setProfile] = useState<Customer | null>(user);
  const [formData, setFormData] = useState<Partial<UpdateCustomerData>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [editing, setEditing] = useState(false);

  const [pwForm, setPwForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loadingChangePw, setLoadingChangePw] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res: any = await authApi.getProfile();
        if (res.status === "success" && res.data) {
          setProfile(res.data);
          setFormData(res.data);
          setAuth(res.data, true);
        } else {
          setGlobalAlert("error", res.message || "Không thể tải thông tin.");
        }
      } catch {
        setGlobalAlert("error", "Lỗi khi tải thông tin tài khoản.");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  // ✅ validateForm fix lỗi TS
  const validateForm = () => {
    const errors = [
      validateUsername(formData.username || ""),
      validateFullName(formData.full_name || ""),
      validateEmail(formData.email || ""),
      validatePhone(formData.phone || ""),
      validateAddress(formData.address || ""),
      validateDateOfBirth(formData.date_of_birth || ""),
    ];
    const firstError = errors.find((msg) => msg !== null);
    if (firstError) {
      setGlobalAlert("error", firstError!);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoadingSave(true);
    try {
      const data = new FormData();
      if (formData.username) data.append("username", formData.username);
      if (formData.full_name) data.append("full_name", formData.full_name);
      if (formData.gender) data.append("gender", formData.gender);
      if (formData.email) data.append("email", formData.email);
      if (formData.phone) data.append("phone", formData.phone);
      if (formData.address) data.append("address", formData.address);
      if (formData.date_of_birth)
        data.append("date_of_birth", formData.date_of_birth);
      if (avatarFile) data.append("avatar", avatarFile);

      const res: any = await updateProfile(data);

      if (res?.status === "success") {
        setGlobalAlert("success", "Cập nhật thông tin thành công!");
        setEditing(false);

        const refreshed: any = await authApi.getProfile();
        if (refreshed?.status === "success" && refreshed?.data) {
          setProfile(refreshed.data);
          setAuth(refreshed.data, true);
        }
      } else {
        setGlobalAlert("error", res?.message || "Cập nhật thất bại!");
      }
    } catch {
      setGlobalAlert("error", "Lỗi khi cập nhật thông tin tài khoản!");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleChangePassword = async () => {
    const { old_password, new_password, confirm_password } = pwForm;

    if (!old_password || !new_password || !confirm_password) {
      return setGlobalAlert("error", "Vui lòng điền đầy đủ thông tin.");
    }
    if (new_password.length < 8) {
      return setGlobalAlert("error", "Mật khẩu mới phải có ít nhất 8 ký tự.");
    }
    if (new_password !== confirm_password) {
      return setGlobalAlert("error", "Mật khẩu xác nhận không khớp.");
    }

    setLoadingChangePw(true);
    try {
      const res: any = await authApi.changePassword({
        old_password,
        new_password,
      } as ChangePasswordData);
      if (res.status === "success") {
        setGlobalAlert("success", "Đổi mật khẩu thành công!");
        setPwForm({ old_password: "", new_password: "", confirm_password: "" });
      } else {
        setGlobalAlert("error", res.message || "Đổi mật khẩu thất bại!");
      }
    } catch {
      setGlobalAlert("error", "Đổi mật khẩu thất bại!");
    } finally {
      setLoadingChangePw(false);
    }
  };

  return {
    profile,
    editing,
    formData,
    avatarFile,
    loadingSave,
    pwForm,
    loadingChangePw,
    setEditing,
    setFormData,
    setAvatarFile,
    setPwForm,
    handleChange,
    handleAvatarChange,
    handleSave,
    handleChangePassword,
  };
};
