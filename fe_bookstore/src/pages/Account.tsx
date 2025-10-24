import { BASE_URL } from "../config";
import Loading from "../components/Loading";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { useAccount } from "../hooks/useAccount";

const Account = () => {
  const {
    profile,
    editing,
    formData,
    avatarFile,
    loadingSave,
    pwForm,
    loadingChangePw,
    setEditing,
    setPwForm,
    handleChange,
    handleAvatarChange,
    handleSave,
    handleChangePassword,
  } = useAccount();

  if (!profile) return <Loading text="Đang tải thông tin..." />;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-lg mt-10 border border-gray-200">
      {/* Thông tin cá nhân */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
        <div className="relative group">
          <img
            src={
              avatarFile
                ? URL.createObjectURL(avatarFile)
                : profile.avatar
                ? `${BASE_URL}${profile.avatar}`
                : "/default-avatar.png"
            }
            alt={profile.full_name}
            className="w-36 h-36 rounded-full object-cover border-4 border-indigo-200 shadow-md transition-transform group-hover:scale-105"
          />
          {editing && (
            <label className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-sm text-center py-1 cursor-pointer rounded-b-full">
              Đổi ảnh
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="text-center md:text-left w-full md:w-2/3">
          {editing ? (
            <>
              <InputField
                label="Username"
                name="username"
                value={formData.username || ""}
                onChange={handleChange}
              />
              <InputField
                label="Họ và tên"
                name="full_name"
                value={formData.full_name || ""}
                onChange={handleChange}
              />
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 border-gray-300"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="M">Nam</option>
                  <option value="F">Nữ</option>
                  <option value="O">Khác</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-900">
                {profile.full_name}
              </h2>
              <p className="text-gray-500 text-lg">@{profile.username}</p>
              <p className="mt-2 text-gray-700 font-medium">
                {profile.gender === "M"
                  ? "Nam"
                  : profile.gender === "F"
                  ? "Nữ"
                  : "Khác"}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Các trường thông tin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField
          label="Email"
          type="email"
          name="email"
          disabled={!editing}
          value={formData.email || ""}
          onChange={handleChange}
        />
        <InputField
          label="Số điện thoại"
          name="phone"
          disabled={!editing}
          value={formData.phone || ""}
          onChange={handleChange}
        />
        <InputField
          label="Ngày sinh"
          type="date"
          name="date_of_birth"
          disabled={!editing}
          value={formData.date_of_birth?.split("T")[0] || ""}
          onChange={handleChange}
        />
        <InputField
          label="Điểm tích lũy"
          value={String(profile.loyalty_points || 0)}
          disabled
        />
        <div className="sm:col-span-2">
          <InputField
            label="Địa chỉ"
            name="address"
            disabled={!editing}
            value={formData.address || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Nút hành động */}
      <div className="flex justify-end gap-3 mt-8">
        {editing ? (
          <>
            <div className="w-40">
              <Button onClick={handleSave} loading={loadingSave}>
                Lưu
              </Button>
            </div>
            <div className="w-32">
              <Button
                onClick={() => setEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Hủy
              </Button>
            </div>
          </>
        ) : (
          <div className="w-48">
            <Button onClick={() => setEditing(true)}>Sửa thông tin</Button>
          </div>
        )}
      </div>

      {/* Khu vực đổi mật khẩu */}
      <div className="mt-12 border-t pt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Đổi mật khẩu
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            label="Mật khẩu hiện tại"
            type="password"
            name="old_password"
            value={pwForm.old_password}
            onChange={(e) =>
              setPwForm((p) => ({ ...p, old_password: e.target.value }))
            }
          />
          <InputField
            label="Mật khẩu mới"
            type="password"
            name="new_password"
            value={pwForm.new_password}
            onChange={(e) =>
              setPwForm((p) => ({ ...p, new_password: e.target.value }))
            }
          />
          <div className="sm:col-span-2">
            <InputField
              label="Xác nhận mật khẩu mới"
              type="password"
              name="confirm_password"
              value={pwForm.confirm_password}
              onChange={(e) =>
                setPwForm((p) => ({ ...p, confirm_password: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="flex justify-end mt-8 w-48">
          <Button onClick={handleChangePassword} loading={loadingChangePw}>
            Đổi mật khẩu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Account;
