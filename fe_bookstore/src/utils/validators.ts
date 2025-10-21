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

