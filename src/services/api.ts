import { getAuthToken } from '@/utils/authHelper';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Determines the appropriate login page URL based on the API endpoint.
 * @param endpoint - The API endpoint that was called.
 * @returns The path to the login page.
 */
const getLoginPath = (endpoint: string): string => {
    if (endpoint.includes('/landlord')) {
        return '/auth/landlord/login';
    }
    if (endpoint.includes('/admin')) {
        return '/admin/login';
    }
    return '/'; // Default for buyers
};

/**
 * A reusable fetch wrapper to centralize API calls, error handling, and authentication.
 * @param endpoint - The API endpoint to call (e.g., '/api/products').
 * @param options - The request options for the fetch call.
 * @param requiresAuth - Whether the endpoint requires an authentication token. Defaults to true.
 * @returns The JSON response data.
 * @throws An error with a user-friendly message if the fetch fails or the API returns an error.
 */
export const apiFetch = async <T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth = true
): Promise<T> => {
    const url = `${API_URL}${endpoint}`;
    const headers = new Headers(options.headers || {});

    if (requiresAuth) {
        const token = getAuthToken();
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        } else {
            console.warn(`Authentication token not found for a protected route: ${endpoint}`);
        }
    }

    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.append('Content-Type', 'application/json');
    }

    try {
        const response = await fetch(url, { ...options, headers });

        const data = await response.json().catch(() => {
            if (!response.ok) throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
            return {}; // For 204 No Content etc.
        });

        if (!response.ok || (data && data.success === false)) {
            const errorMessage = data.error || data.message || `Request failed with status ${response.status}`;

            // Check for various token-related error messages
            const isAuthError = ['Invalid or expired token', 'Invaid or expired token', 'Not authorized, token failed', 'Request failed with status 401: Unauthorized'].some(
                (msg) => errorMessage.includes(msg)
            );

            if (isAuthError) {
                if (typeof window !== 'undefined') {
                    toast.error("Your session has expired. Please log in again.");
                    // Redirect to homepage after a short delay to allow the user to see the toast.
                    setTimeout(() => {
                        sessionStorage.clear(); // Clear session storage
                        window.location.href = '/'; // Redirect to homepage
                    }, 2000);
                    throw new Error('Authentication error. Redirecting...');
                }
            }
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error('Network error: Unable to connect to the server.');
        }
        throw error;
    }
};