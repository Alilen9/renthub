import { ResetPasswordResponse, ChangePasswordData, RegisterSuccessResponse } from './../utils/auth';
import { LoginSuccessResponse, RegisterFormData, LoginCredentials } from "@/utils/auth";
import { apiFetch } from '@/services/api';

export const loginUser = async (credentials: LoginCredentials, role: 'tenant' | 'landlord'): Promise<LoginSuccessResponse> => {
  const endpoint = '/api/auth/login';
  return apiFetch<LoginSuccessResponse>(endpoint, {
    method: 'POST',
    body: JSON.stringify({ ...credentials, role }),
  }, false);
};

export const loginAdmin = async (credentials: LoginCredentials): Promise<LoginSuccessResponse> => {
  const endpoint = '/api/admin/login';
  return apiFetch<LoginSuccessResponse>(endpoint, {
    method: 'POST',
    body: JSON.stringify(credentials),
  }, false);
};

export const registerUser = async (formData: RegisterFormData, role: 'tenant' | 'landlord'): Promise<RegisterSuccessResponse> => {
  const endpoint = role === 'tenant' ? '/api/auth/register/tenant' : '/api/auth/register';
  const body = {
    username: formData.email, // Using email as username for simplicity
    full_name: formData.full_name,
    email: formData.email,
    password: formData.password,
    phone: formData.phone,
    address: formData.address,
    business_name: formData.company_name,
  };

  return apiFetch<RegisterSuccessResponse>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  }, false);

};
/**
 * Sends a request to the server to initiate a password reset process.
 * @param email The user's email address.
 * @param role The user's role, either 'tenant' or 'landlord'.
 * @returns A promise that resolves with the success message from the server.
 */
export const requestPasswordReset = async (email: string, role: 'tenant' | 'landlord'): Promise<ResetPasswordResponse> => {
  const endpoint = `/api/auth/forgot-password/${role}`;

  const body = {
    email: email,
  };
  return apiFetch<ResetPasswordResponse>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  }, false);
  
};

interface ResetPasswordPayload {
  token: string;
  password: string;
  role: 'tenant' | 'landlord';
}

/**
 * Sends a request to the server to reset the user's password.
 * @param payload The reset token and new password.
 * @returns A promise that resolves with the success message from the server.
 */
export const resetPassword = async (
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> => {
  // The role is now part of the payload
  const endpoint = '/api/auth/reset-password';
  
  return apiFetch<ResetPasswordResponse>(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
  }, false);
};

/**
 * Sends a request to update the current user's password.
 * @param payload The current and new password.
 * @returns A promise that resolves with the success message from the server.
 */
export const updatePassword = async (
  payload: ChangePasswordData
): Promise<RegisterSuccessResponse> => {
  return apiFetch<RegisterSuccessResponse>('/api/auth/update-password', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};
// export const loginUser = async (
//   credentials: LoginCredentials,
//   role: "tenant" | "landlord"
// ): Promise<LoginSuccessResponse> => {
//   await new Promise((resolve) => setTimeout(resolve, 800));

//   // ✅ Allow any email/password combination
//   return {
//     token: "mock-token-123",
//     user: { email: credentials.email, role },
//   };
// };

// export const registerUser = async (): Promise<RegisterSuccessResponse> => {
//   await new Promise((resolve) => setTimeout(resolve, 800));
//   return { message: "Registered successfully (mock)" };
// };

// export const requestPasswordReset = async (
//   email: string,
//   role: "tenant" | "landlord"
// ): Promise<ResetPasswordResponse> => {
//   await new Promise((resolve) => setTimeout(resolve, 800));
//   return { message: `Password reset email sent to ${email} (${role})` };
// };

// export const resetPassword = async (): Promise<ResetPasswordResponse> => {
//   await new Promise((resolve) => setTimeout(resolve, 800));
//   return { message: "Password reset successful (mock)" };
// };

