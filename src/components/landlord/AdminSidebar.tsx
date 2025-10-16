'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarNavItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/properties', label: 'Properties' },
    { href: '/admin/tenants', label: 'Tenants' },
    { href: '/admin/payments', label: 'Payments' },
    { href: '/admin/settings', label: 'Settings' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 flex-shrink-0 bg-gray-800 text-white p-4 hidden md:block">
            <div className="text-2xl font-bold mb-8">RentHub Admin</div>
            <nav>
                <ul>
                    {sidebarNavItems.map((item) => (
                        <li key={item.href} className="mb-2">
                            <Link
                                href={item.href}
                                className={`block p-2 rounded hover:bg-gray-700 ${
                                    pathname === item.href ? 'bg-gray-900' : ''
                                }`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}