"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LifeBuoy, PlusCircle, Loader2, AlertTriangle } from 'lucide-react';
import { fetchTenantTickets, createTicket, SupportTicket } from '@/services/supportService';

function getStatusClass(status: SupportTicket['status']) {
    switch (status) {
        case 'open':
            return 'bg-green-100 text-green-800';
        case 'in_progress':
            return 'bg-yellow-100 text-yellow-800';
        case 'closed':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

export default function SupportPage() {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadTickets = async () => {
            try {
                setIsLoading(true);
                const data = await fetchTenantTickets();
                console.log("data of tickets:", data);
                setTickets(data);
            } catch (err: any) {
                setError('Failed to load support tickets. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadTickets();
    }, []);

    const handleCreateTicket = async () => {
        // For this example, we'll use prompts. A modal form would be a better UX.
        const subject = prompt("Please enter a subject for your new ticket:");
        if (!subject) return;

        const message = prompt("Please describe your issue:");
        if (!message) return;

        setIsCreating(true);
        try {
            const { ticket } = await createTicket(subject, message);
            alert('Support ticket created successfully!');
            router.push(`/tenant/support/${ticket.id}`);
        } catch (err: any) {
            alert(`Error creating ticket: ${err.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex-1 p-8 bg-white text-black">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-[#58181C] flex items-center gap-2">
                    <LifeBuoy className="w-8 h-8" />
                    Support Center
                </h1>
                <button
                    onClick={handleCreateTicket}
                    disabled={isCreating}
                    className="bg-[#C81E1E] text-white px-5 py-2 rounded-lg hover:bg-[#58181C] transition font-medium flex items-center gap-2 disabled:bg-gray-400"
                >
                    {isCreating ? <Loader2 className="animate-spin" /> : <PlusCircle size={20} />}
                    Create New Ticket
                </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 shadow-lg rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-[#C81E1E] mb-4">Your Tickets</h2>
                {isLoading ? (
                    <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin text-[#C81E1E] w-8 h-8" /></div>
                ) : error ? (
                    <div className="text-red-500 flex items-center gap-2"><AlertTriangle /> {error}</div>
                ) : tickets.length === 0 ? (
                    <p className="text-gray-500">You have no support tickets.</p>
                ) : (
                    <ul className="space-y-3">
                        {tickets.map(ticket => (
                            <li key={ticket.id} className="border-b border-gray-200 last:border-b-0 py-3">
                                <Link href={`/tenant/support/${ticket.id}`} className="flex justify-between items-center hover:bg-gray-100 p-2 rounded-md transition-colors">
                                    <div>
                                        <p className="font-semibold text-gray-800">#{ticket.id} - {ticket.subject}</p>
                                        <p className="text-sm text-gray-500">
                                            Last updated: {new Date(ticket.updated_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClass(ticket.status)}`}>
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}