import { apiFetch } from '@/services/api';

export interface SupportTicket {
    id: number;
    creator_id: number;
    subject: string;
    status: 'open' | 'closed' | 'in_progress';
    created_at: string;
    updated_at: string;
    creator_name?: string;
    creator_email?: string;
    creator_role?: 'tenant' | 'landlord';
}

export interface SupportMessage {
    id: number;
    ticket_id: number;
    sender_id: number;
    sender_role: 'tenant' | 'landlord' | 'admin';
    message: string;
    created_at: string;
}

export interface SupportTicketWithMessages extends SupportTicket {
    messages: SupportMessage[];
}

/**
 * Fetches all support tickets for the currently logged-in tenant.
 */
export const fetchTenantChats = async (): Promise<SupportTicket[]> => {
    const response = await apiFetch<{ tickets: SupportTicket[] }>('/api/support/tickets');
    return response.tickets;
};



/**
 * Fetches all support tickets for the currently logged-in tenant.
 */
export const sendTenantMessage = async (): Promise<SupportTicket[]> => {
    const response = await apiFetch<{ tickets: SupportTicket[] }>('/api/support/tickets');
    return response.tickets;
};

/**
 * Fetches a single support ticket by its ID, including all messages.
 * @param ticketId The ID of the ticket to fetch.
 */
export const fetchChatMessages = async (ticketId: string | number): Promise<SupportTicketWithMessages> => {
    const response = await apiFetch<{ ticket: SupportTicketWithMessages }>(`/api/support/tickets/${ticketId}`);
    return response.ticket;
};

/**
 * Creates a new support ticket.
 * @param subject The subject of the ticket.
 * @param message The initial message for the ticket.
 */
export const createChat = async (subject: string, message: string): Promise<{ ticket: SupportTicket }> => {
    return apiFetch<{ ticket: SupportTicket }>('/api/support/tickets', {
        method: 'POST',
        body: JSON.stringify({ subject, message }),
    });
};

/**
 * Adds a reply to an existing support ticket.
 * @param ticketId The ID of the ticket to reply to.
 * @param message The content of the reply message.
 */
export const replyToChat = async (ticketId: string | number, message: string): Promise<{ message: SupportMessage }> => {
    return apiFetch<{ message: SupportMessage }>(`/api/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message }),
    });
};