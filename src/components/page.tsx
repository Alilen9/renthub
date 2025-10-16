const StatCard = ({ title, value, change }: { title: string, value: string, change: string }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <p className={`text-sm mt-2 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</p>
    </div>
);

const RecentActivityItem = ({ description, time }: { description: string, time: string }) => (
    <li className="py-3 border-b border-gray-200">
        <p className="text-sm">{description}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
    </li>
);

export default function AdminDashboardPage() {
    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Revenue" value="$40,389" change="+12.5% this month" />
                <StatCard title="Occupancy Rate" value="92%" change="-1.2% this month" />
                <StatCard title="Open Maintenance" value="12" change="+3 new today" />
                <StatCard title="New Tenants" value="5" change="+2 this week" />
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                <ul>
                    <RecentActivityItem
                        description="Payment of $1,200 received from John Doe for Property #102."
                        time="15 minutes ago"
                    />
                    <RecentActivityItem
                        description="New maintenance request for 'Leaky Faucet' in Property #205."
                        time="1 hour ago"
                    />
                    <RecentActivityItem
                        description="Jane Smith signed the lease for Property #301."
                        time="3 hours ago"
                    />
                    <RecentActivityItem
                        description="Property #115 was marked as 'Vacant'."
                        time="Yesterday"
                    />
                </ul>
            </div>
        </>
    );
}