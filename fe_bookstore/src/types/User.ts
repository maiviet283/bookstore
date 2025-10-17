export interface User {
  id: number;
  avatar: string;
  full_name: string;
  gender: "M" | "F" | "O";
  date_of_birth: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  loyalty_points: number;
  created_at: string;
  updated_at: string;
}