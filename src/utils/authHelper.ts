/**
 * Retrieves the authentication token from session storage.
 * @returns The token string, or null if not found.
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('token');
};