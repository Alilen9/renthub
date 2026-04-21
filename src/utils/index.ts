export interface Apartment {
    id: number;
    name: string;
    description: string;
    price: number;
    location: string;
    category: string;
    image_urls: string[];
    video_url?: string;
    landlord_username: string;
    business_name?: string;
    is_verified?: boolean; // ✅ Added for verification status
    verified?: boolean;   // ✅ Alias for frontend compatibility
}