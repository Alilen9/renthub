"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Send, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { fetchTicketById, replyToTicket, SupportTicketWithMessages } from '@/services/supportService';
import { useAuth } from '@/context/AuthContext';

function getStatusClass(status: SupportTicketWithMessages['status']) {
    switch (status) {
        case 'open': return 'bg-green-100 text-green-800';
        case 'in_progress': return 'bg-yellow-100 text-yellow-800';
        case 'closed': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

export default function TicketDetailPage() {
    const { ticketId } = useParams();
    const { user } = useAuth();
    const [ticket, setTicket] = useState<SupportTicketWithMessages | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reply, setReply] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ticketId) {
            const loadTicket = async () => {
                try {
                    setIsLoading(true);
                    const data = await fetchTicketById(ticketId as string);
                    setTicket(data);
                } catch (err: unknown) {
                    setError('Failed to load ticket details. It may not exist or you may not have permission to view it.');
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };
            loadTicket();
        }
    }, [ticketId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [ticket?.messages]);

    const handleReply = async () => {
        if (!reply.trim() || !ticketId) return;
        setIsReplying(true);
        try {
            const { message: newMsg } = await replyToTicket(ticketId as string, reply);
            setTicket(prev => prev ? { ...prev, messages: [...prev.messages, newMsg], status: 'open' } : null);
            setReply('');
        } catch (err: unknown) {
            alert(`Error sending reply: ${(err as Error).message}`);
        } finally {
            setIsReplying(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin text-[#C81E1E] w-8 h-8" /></div>;
    }

    if (error) {
        return <div className="flex flex-col justify-center items-center min-h-screen text-red-500"><AlertTriangle className="w-12 h-12 mb-4" />{error}</div>;
    }

    if (!ticket) {
        return <div className="flex justify-center items-center min-h-screen">Ticket not found.</div>;
    }

    return (
        <div className="flex-1 p-8 bg-white text-black flex flex-col h-screen">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <div>
                    <Link href="/tenant/support" className="text-[#C81E1E] hover:underline flex items-center gap-2 mb-2">
                        <ArrowLeft size={18} /> Back to All Tickets
                    </Link>
                    <h1 className="text-2xl font-bold text-[#58181C]">Ticket #{ticket.id}: {ticket.subject}</h1>
                </div>
                <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${getStatusClass(ticket.status)}`}>
                    {ticket.status.replace('_', ' ')}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 p-6 rounded-lg space-y-4">
                {ticket.messages.map(msg => {
                    const isAdmin = msg.sender_role === 'admin';
                    const isCurrentUser = !isAdmin && msg.sender_id === user?.id;
                    return (
                        <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xl p-4 rounded-xl shadow-sm ${isCurrentUser ? 'bg-[#C81E1E] text-white rounded-br-none' : (isAdmin ? 'bg-blue-100 text-blue-900 rounded-bl-none' : 'bg-gray-200 text-gray-800 rounded-bl-none')}`}>
                                <p className="font-bold text-sm mb-1">{isAdmin ? 'Support Team' : (isCurrentUser ? 'You' : 'Them')}</p>
                                <p className="text-base whitespace-pre-wrap">{msg.message}</p>
                                <p className={`text-xs mt-2 text-right ${isCurrentUser ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {new Date(msg.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold mb-2">Post a Reply</h3>
                <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder={ticket.status === 'closed' ? "Replying will re-open this ticket." : "Type your message here..."}
                    className="w-full p-3 border border-gray-300 rounded-lg text-black mb-3"
                    rows={4}
                    disabled={isReplying}
                />
                <button
                    onClick={handleReply}
                    disabled={isReplying || !reply.trim()}
                    className="bg-[#C81E1E] text-white px-6 py-2 rounded-lg hover:bg-[#58181C] transition font-medium flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isReplying ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                    Send Reply
                </button>
            </div>
        </div>
    );
}
