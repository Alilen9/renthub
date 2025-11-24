import { apiFetch } from '@/services/api';

export interface Chats {
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

export interface ChatMessage {
    id: number;
    ticket_id: number;
    sender_id: number;
    sender_role: 'tenant' | 'landlord' ;
    message: string;
    created_at: string;
}

export interface SupportTicketWithMessages extends Chats {
    messages: ChatMessage[];
}

/**
 * Fetches all support tickets for the currently logged-in tenant.
 */
export const fetchTenantChats = async (): Promise<Chats[]> => {
    const response = await apiFetch<{ chats: Chats[] }>('/api/chat/conversations');
    return response.chats;
};



/**
 * Fetches all support tickets for the currently logged-in tenant.
 */
export const sendTenantMessage = async (): Promise<Chats[]> => {
    const response = await apiFetch<{ chats: Chats[] }>('/api/chat/tickets');
    return response.chats;
};

/**
 * Fetches a single support ticket by its ID, including all messages.
 * @param ticketId The ID of the ticket to fetch.
 */
export const fetchChatMessages = async (chatId: string | number): Promise<SupportTicketWithMessages> => {
    const response = await apiFetch<{ chat: SupportTicketWithMessages }>(`/api/chat/conversations/${chatId}`);
    return response.chat;
};

/**
 * Creates a new support ticket.
 * @param subject The subject of the ticket.
 * @param message The initial message for the ticket.
 */
export const createChat = async (subject: string, message: string): Promise<{ ticket: Chats }> => {
    return apiFetch<{ ticket: Chats }>('/api/chat/tickets', {
        method: 'POST',
        body: JSON.stringify({ subject, message }),
    });
};

/**
 * Adds a reply to an existing support ticket.
 * @param ticketId The ID of the ticket to reply to.
 * @param message The content of the reply message.
 */
export const replyToChat = async (ticketId: string | number, message: string): Promise<{ message: ChatMessage }> => {
    return apiFetch<{ message: ChatMessage }>(`/api/chat/tickets/${ticketId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message }),
    });
};