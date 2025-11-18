// MOCK AUTH SERVICE — offline testing version

interface LoginCredentials {
  email: string;
  password: string;
}

// ✅ Add serviceProvider to allowed roles
type Role = "tenant" | "landlord" | "serviceProvider";

interface LoginSuccessResponse {
  token: string;
  user: {
    email: string;
    role: Role;
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
  role: Role
): Promise<LoginSuccessResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // ✅ Allow any email/password combination
  return {
    token: "mock-token-123",
    user: { email: credentials.email, role },
  };
};

export const registerUser = async (
  p0: {
    username: string;
    full_name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    company_name?: string;
  },
  p1: Role
): Promise<RegisterSuccessResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { message: "Registered successfully (mock)" };
};

export const requestPasswordReset = async (
  email: string,
  role: Role
): Promise<ResetPasswordResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { message: `Password reset email sent to ${email} (${role})` };
};

export const resetPassword = async (): Promise<ResetPasswordResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { message: "Password reset successful (mock)" };
};
