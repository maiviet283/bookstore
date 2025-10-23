export interface Customer {
  id: number;
  avatar: string | null;
  full_name: string;
  gender: "M" | "F" | "O" | null;
  date_of_birth: string | null;
  email: string;
  phone: string;
  address: string;
  username: string;
  loyalty_points: number;
  created_at: string;
  updated_at: string;
}

export interface LoginData {
  username_or_phone: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterData {
  full_name: string;
  phone: string;
  username: string;
  password: string;
}

export interface UpdateCustomerData {
  avatar?: File | string | null;
  username?: string;
  full_name?: string;
  gender?: "M" | "F" | "O" | null;
  date_of_birth?: string | null;
  email?: string;
  phone?: string;
  address?: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}