// MOCK AUTH SERVICE — offline testing version

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginSuccessResponse {
  token: string;
  user: {
    email: string;
    role: "tenant" | "landlord";
  };
}

interface RegisterSuccessResponse {
  message: string;
}

interface ResetPasswordResponse {
  message: string;
}

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
