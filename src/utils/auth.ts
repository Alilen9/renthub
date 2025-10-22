export interface User {
  id: number;
  username: string;
  full_name?: string;
  email: string;
  role: 'tenant' | 'landlord' | 'admin';
  company_name?: string;
  phone?: string;
  address?: string;
  is_verified?: boolean;
}

export interface RegisterFormData {
  username: string;
  full_name: string
  email: string;
  password: string;
  phone?: string;
  address?: string;
  company_name?: string;
}

// Data from the API which might not perfectly match our User shape
export interface ApiUser extends Partial<User> {
  id: number;
  email: string;
  full_name?: string;
  username?: string;
  business_name?: string;
  is_verified?: boolean;
}

export interface LoginSuccessResponse {
  success: true;
  token: string;
  user: ApiUser;
}

export interface RegisterSuccessResponse {
  success: true;
  message?: string;
}
export interface ResetPasswordResponse {
  success: true;
  message?: string;
}
export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}
export interface BuyerProfileUpdate {
    fullName: string;
    phone: string;
    address: string;
}

export interface LoginCredentials { email: string; password: string; }


