import { BaseSuccessResponse, ContactUsFormData } from '@/utils/contactUs';
import { apiFetch } from '@/services/api';

export const contactUs = async (formData: ContactUsFormData, role: 'tenant' | 'landlord'): Promise<BaseSuccessResponse> => {
  const endpoint = '/api/contactUs';
  const body = {
    
    full_name: formData.full_name,
    email: formData.email,
    message: formData.message
  };

  return apiFetch<BaseSuccessResponse>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  }, false);

};


