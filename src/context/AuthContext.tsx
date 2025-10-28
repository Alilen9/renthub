'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser, loginAdmin } from '@/services/authService';
import { User, RegisterFormData, ApiUser, LoginCredentials } from '@/utils/auth';

// The LoginCredentials type should be defined in your auth types file,
// but is included here for clarity if it's missing.

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials, role: 'tenant' | 'landlord' | 'admin', redirectUrl?: string | null) => Promise<{ success: boolean; error?: string; }>;
  register: (formData: RegisterFormData, role: 'tenant' | 'landlord') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for token and user info in sessionStorage on initial load
    const storedToken = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const setSession = (sessionToken: string, userData: ApiUser, role: 'tenant' | 'landlord' | 'admin') => {
    const userInfo: User = {
        id: userData.id,
        username: userData.username || '',
        full_name: userData.full_name,
        email: userData.email,
        role: role,
        company_name: userData.business_name || userData.company_name,
        phone: userData.phone,
        address: userData.address,
        is_verified: userData.is_verified,
    };
    
    sessionStorage.setItem('token', sessionToken);
    sessionStorage.setItem('user', JSON.stringify(userInfo));
    setToken(sessionToken);
    setUser(userInfo);

  };

  const login = async (credentials: LoginCredentials, role: 'tenant' | 'landlord' | 'admin', redirectUrl?: string | null) => {
    setIsLoading(true);
    try {
      const data = role === 'admin'
        ? await loginAdmin(credentials)
        : await loginUser(credentials, role);
      const userData = data.user;
      if (!userData) {
        return { success: false, error: 'Login successful, but no user data received.' };
      }
      setSession(data.token, userData, role);
      console.log(userData)

      if (redirectUrl && redirectUrl.startsWith('/')) {
        router.push(redirectUrl);
      } else {
        switch (role) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'landlord':
            router.push('/landlord/dashboard');
            break;
          case 'tenant':
          default:
            router.push('/tenant/dashboard');
            break;
        }
      }
      return { success: true };
    } catch (error) {
      console.error("Login API call failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: RegisterFormData, role: 'tenant' | 'landlord') => {

    try {
      setIsLoading(true);
      const result = await registerUser(formData, role);
      const loginPath = role === 'tenant' ? '/auth/buyer/login' : '/auth/seller/login';
      setTimeout(() => {
        router.push(`${loginPath}?registered=true`);
      }, 2000);
      return { success: true };
    } catch (error) {
      console.error("Registration API call failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    const role = user?.role; // Get role before clearing user state
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('verificationBannerDismissed'); // Clear banner state on logout
    setToken(null);
    setUser(null);
    
    let loginPath = '/';
    if (role === 'landlord') {
      loginPath = '/';
    } else if (role === 'admin') {
      loginPath = '/';
    }
    router.push(loginPath);
  };

  const value = {
    user,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};