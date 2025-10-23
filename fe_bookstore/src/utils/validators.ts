export function validateUsername(username: string) {
  if (!username) return "Username không được để trống";
  if (/\s/.test(username)) return "Username không được chứa khoảng trắng";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username chỉ được chứa chữ, số, gạch dưới";
  return null;
}

export function validateFullName(full_name: string) {
  if (!full_name) return "Họ và tên không được để trống";
  if (!/^[a-zA-Z\sÀ-ỹ]+$/.test(full_name)) return "Họ và tên không được chứa số hoặc ký tự đặc biệt";
  return null;
}

export function validatePhone(phone: string) {
  if (!phone) return "Số điện thoại không được để trống";
  if (!/^\d{9,11}$/.test(phone)) return "Số điện thoại không hợp lệ";
  return null;
}

export function validatePassword(password: string) {
  if (!password) return "Mật khẩu không được để trống";
  if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
  return null;
}

export function validateUsernameOrPhone(value: string) {
  if (!value) return "Username hoặc số điện thoại không được để trống";
  if (/\s/.test(value)) return "Username/số điện thoại không được chứa khoảng trắng";
  return null;
}

export function validateEmail(email: string) {
  if (!email) return "Email không được để trống";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "Email không hợp lệ";
  return null;
}

export function validateAddress(address: string) {
  if (!address) return "Địa chỉ không được để trống";
  if (address.length < 5) return "Địa chỉ quá ngắn";
  return null;
}

export function validateDateOfBirth(dateStr: string) {
  if (!dateStr) return "Ngày sinh không được để trống";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Ngày sinh không hợp lệ";

  const today = new Date();
  if (date > today) return "Ngày sinh không được lớn hơn ngày hiện tại";

  const age = today.getFullYear() - date.getFullYear();
  if (age < 10) return "Tuổi phải từ 10 trở lên";
  return null;
}

export function validateQuantity(quantity: number, maxStock?: number) {
  if (isNaN(quantity)) return "Số lượng không hợp lệ";
  if (quantity < 0) return "Số lượng không được âm";
  if (quantity === 0) return "Nếu muốn xoá sản phẩm, hãy chọn nút xoá hoặc nhập 0 để xác nhận";
  if (!Number.isInteger(quantity)) return "Số lượng phải là số nguyên";
  if (maxStock && quantity > maxStock)
    return `Số lượng vượt quá tồn kho (${maxStock})`;
  if (quantity > 999)
    return "Số lượng không được vượt quá 999 sản phẩm";
  return null;
}
