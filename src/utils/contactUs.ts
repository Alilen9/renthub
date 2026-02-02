export interface ContactUsFormData {
  
  full_name: string
  email: string;
  message: string;

}

export interface BaseSuccessResponse {
  success: true;
  message?: string;
}