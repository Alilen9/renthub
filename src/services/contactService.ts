import { apiFetch } from '@/services/api';
import { ContactUsFormData, BaseSuccessResponse } from '@/utils/contactUs';

export const sendContactInquiry = async (formData: ContactUsFormData): Promise<BaseSuccessResponse> => {
  return apiFetch<BaseSuccessResponse>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(formData),
  }, false);
};