import { apiFetch } from '@/services/api';

export interface TenantProfile {
    full_name: string;
    email: string;
    phone: string;
}

export interface TenantNotifications {
    email_notifications: boolean;
    sms_notifications: boolean;
    app_notifications: boolean;
}

export interface TenantSettings extends TenantProfile, TenantNotifications {}

/**
 * Fetches the current tenant's settings.
 */
export const fetchTenantSettings = async (): Promise<TenantSettings> => {
    const response = await apiFetch<{ data: TenantSettings }>("/api/settings/tenant", { method: "GET" });
    return response.data;
};

/**
 * Updates the tenant's profile information.
 * @param profile - The profile data to update.
 */
export const updateTenantProfile = async (profile: Partial<TenantProfile>) => {
    return apiFetch("/api/settings/profile/tenant", {
        method: "PUT",
        body: JSON.stringify(profile),
    });
};

/**
 * Updates a single notification preference for the tenant.
 * @param preference - An object with the notification key and its new boolean value.
 */
export const updateTenantNotification = async (preference: Partial<TenantNotifications>) => {
    return apiFetch("/api/settings/notifications/tenant", {
        method: "PUT",
        body: JSON.stringify(preference),
    });
};