
import { Apartment } from "@/utils";
import { apiFetch } from "./api";

/**
 * Fetches a list of apartments from the API.
 * @param limit The maximum number of apartments to fetch.
 * @returns A promise that resolves to an array of apartments.
 */
export async function fetchApartments(limit?: number): Promise<Apartment[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const url = new URL(`${apiUrl}/api/houses`);
    if (limit) {
        url.searchParams.append('limit', String(limit));
    }

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error('Failed to fetch apartments');
        }
        const result = await response.json();
        return result.data.map((apartment: any) => ({
            ...apartment,
            image_urls: typeof apartment.image_urls === 'string' ? JSON.parse(apartment.image_urls) : apartment.image_urls || [],
        }));
    } catch (error) {
        console.error("Error fetching apartments:", error);
        return []; // Return an empty array on error
    }
}
export async function fetchListings(limit?: number): Promise<Apartment[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const url = new URL(`${apiUrl}/api/houses`);
    if (limit) {
        url.searchParams.append('limit', String(limit));
    }

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error('Failed to fetch apartments');
        }
        const result = await response.json();
        return result.data.map((apartment: any) => ({
            ...apartment,
            image_urls: typeof apartment.image_urls === 'string' ? JSON.parse(apartment.image_urls) : apartment.image_urls || [],
        }));
    } catch (error) {
        console.error("Error fetching apartments:", error);
        return []; // Return an empty array on error
    }
}

export const createListing = async (formData: FormData): Promise<Apartment> => {
  const data = await apiFetch<{ apartment: Apartment }>(
    '/api/houses',
    {
      method: 'POST',
      body: formData,
    }
  );
  return data.apartment;
};

export const updateListing = async (id: string, formData: FormData): Promise<Apartment> => {
    const response = await apiFetch<{ data: Apartment }>(
        `/api/houses/${id}`, // Correct endpoint for updating houses
        {
            method: 'PUT',
            body: formData,
        }
    );
    return response.data;
};

export const deleteHouse = async (id: string): Promise<{ success: boolean; message: string }> => {
    const data = await apiFetch<{ success: boolean; message:string }>(
        `/api/houses/${id}`, // Correct endpoint for deleting houses
        {
            method: 'DELETE',
            // No body is needed for the delete operation as per the backend route
        }
    );
    return data;
};
