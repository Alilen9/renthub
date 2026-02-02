'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import FullPageLoader from '@/components/FullPageLoader';
import { X, User, LogOut, Menu } from 'lucide-react';
import TenantSidebar from '@/components/tenants/TenantSidebar';
import { colors } from '@/utils/colors';
import { Metadata } from 'next';




export default function ProtectedTenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [barName, setBarName] = useState("Dashboard")

  
  useEffect(() => {
    if (pathname === "/tenant/booking-system"){
      setBarName("Dashboard")
    }else if (pathname === "/tenant/chat"){
      setBarName("Chat")
    }
    else if (pathname === "/tenant/lease-finalisation"){
      setBarName("Lease")
    }else if (pathname === "/tenant/listing"){
      setBarName("Listing")
    }else if (pathname === "/tenant/reserve"){
      setBarName("reserve")
    }else if (pathname === "/tenant/settings"){
      setBarName("Settings")
    }else {
      setBarName("Dashboard")
    }
  });

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || user?.role !== 'tenant') {
        // If not authenticated or not an admin, redirect to the Tenant login page.
        router.replace('/');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // While loading or if the user is not a confirmed Tenant, show a loader.
  // This prevents flashing admin content to unauthorized users before the redirect happens.
  if (isLoading || !isAuthenticated || user?.role !== 'tenant') {
    return <FullPageLoader />;
  }

  // If we reach here, the user is an authenticated Tenant.
  // Render the shared admin dashboard layout and the specific page content.
  return <div className="min-h-screen bg-gray-50">
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} style={{backgroundColor: colors.maroon}}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col shadow-xl">
                    <div className="flex h-16 items-center justify-between px-4 bg-white">
                        <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold">RentHub</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="rounded-md p-2 text-gray-400 hover:text-white"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <TenantSidebar onLinkClick={() => setSidebarOpen(false)} />
                    <div className="border-t border-gray-200 p-4 bg-white">
                        <div className="flex items-center space-x-3 mb-3">
                            {isLoading ? (
                                <>
                                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center"><User className="h-4 w-4 text-blue-600" /></div>
                                    <div><p className="text-sm font-medium text-gray-900">{user?.username}</p><p className="text-xs text-gray-500">{user.email}</p></div>
                                </>
                            )}
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center w-full px-2 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-20 rounded-md transition-colors cursor-pointer"
                        >
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white shadow-lg">
                    <div className="flex h-16 items-center px-4 bg-gray-900">
                        <span className="text-xl font-bold text-white">RentHub</span>
                    </div>
                    <TenantSidebar />
                    <div className="border-t border-gray-200 p-4" style={{ backgroundColor: colors.maroon }}>
                        <div className="flex items-center space-x-3 mb-3">
                             {isLoading ? (
                                <>
                                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center"><User className="h-5 w-5 " /></div>
                                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{user.username}</p><p className="text-xs text-white truncate">{user.email}</p></div>
                                </>
                            )}
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center w-full cursor-pointer px-2 py-2 text-sm text-white hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                        >
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64 flex flex-col min-h-screen" >
                <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow-sm lg:hidden">
                    <button
                        type="button"
                        className="border-r border-gray-200 cursor-pointer px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex flex-1 justify-center items-center">
                        <span className="text-lg font-semibold text-gray-900">{barName}</span>
                    </div>
                </div>
                <main className="flex-1 p-4 lg:p-0">{children}</main>
            </div>
        </div>;
}