
import { Apartment } from "@/utils";
import { apiFetch } from "./api";

/**
 * Fetches a list of apartments from the API.
 * @param limit The maximum number of apartments to fetch.
 * @returns A promise that resolves to an array of apartments.
 */
export async function fetchApartments(limit?: number): Promise<Apartment[]> {
    const path = limit ? `/api/houses?limit=${limit}` : "/api/houses";

    try {
        const result = await apiFetch<{ data: any[] }>(path);
        return result.data.map((apartment: any) => ({
            ...apartment,
            // Ensure image_urls is always an array
            image_urls:
                typeof apartment.image_urls === "string"
                    ? JSON.parse(apartment.image_urls)
                    : apartment.image_urls || [],
        }));
    } catch (error) {
        console.error("Error fetching apartments:", error);
        return []; // Return an empty array on error
    }
}
export async function fetchListings(limit?: number): Promise<Apartment[]> {
    const path = limit ? `/api/houses?limit=${limit}` : "/api/houses";

    try {
        // Using apiFetch to include authentication headers
        const result = await apiFetch<{ data: any[] }>(path);
        return result.data.map((apartment: any) => ({
            ...apartment,
            // Ensure image_urls is always an array
            image_urls:
                typeof apartment.image_urls === "string"
                    ? JSON.parse(apartment.image_urls)
                    : apartment.image_urls || [],
        }));
    } catch (error) {
        console.error("Error fetching apartments:", error);
        return []; // Return an empty array on error
    }
}

export const createListing = async (formData: FormData): Promise<Apartment> => {
  const data = await apiFetch<{ data: Apartment }>(
    '/api/houses',
    {
      method: 'POST',
      body: formData,
    }
  );
  return data.data;
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
