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

export const loginUser = async (
  credentials: LoginCredentials,
  role: "tenant" | "landlord"
): Promise<LoginSuccessResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // ✅ Allow any email/password combination
  return {
    token: "mock-token-123",
    user: { email: credentials.email, role },
  };
};

export const registerUser = async (): Promise<RegisterSuccessResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { message: "Registered successfully (mock)" };
};

export const requestPasswordReset = async (
  email: string,
  role: "tenant" | "landlord"
): Promise<ResetPasswordResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { message: `Password reset email sent to ${email} (${role})` };
};

export const resetPassword = async (): Promise<ResetPasswordResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { message: "Password reset successful (mock)" };
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