import { apiFetch } from './api';

export interface LandlordProfile {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  notifications: boolean;
  profile_image_url?: string;
}

export async function getLandlordProfile(): Promise<LandlordProfile> {
  // Assuming the backend has an endpoint to get the logged-in landlord's profile
  const result = await apiFetch<{ data: LandlordProfile }>('/api/landlords/profile');
  return result.data;
}

export async function updateLandlordProfile(formData: FormData): Promise<LandlordProfile> {
  // Assuming the backend has an endpoint to update the profile
  const result = await apiFetch<{ data: LandlordProfile }>('/api/landlords/profile', {
    method: 'PUT',
    body: formData,
  });
  return result.data;
}
