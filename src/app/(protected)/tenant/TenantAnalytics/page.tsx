"use client";

import React from "react";
import TenantSidebar from "@/components/tenants/TenantSidebar";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

// ---------------- Sample Data ----------------
const tenantRentPayments = [
  { month: "Jan", amount: 1200, status: "Paid" },
  { month: "Feb", amount: 1200, status: "Paid" },
  { month: "Mar", amount: 1200, status: "Pending" },
  { month: "Apr", amount: 1200, status: "Paid" },
  { month: "May", amount: 1200, status: "Overdue" },
];

const tenantMaintenanceRequests = [
  { id: "1", title: "Leaky faucet", category: "Plumbing", status: "Resolved", staffAssigned: "John Doe" },
  { id: "2", title: "Broken window", category: "Glasswork", status: "In Progress", staffAssigned: "Jane Smith" },
  { id: "3", title: "Heater not working", category: "Electrical", status: "Open", staffAssigned: "Mike Johnson" },
];

const staffContacts = [
  { name: "John Doe", role: "Plumber", phone: "0712345678" },
  { name: "Jane Smith", role: "Glass Technician", phone: "0723456789" },
  { name: "Mike Johnson", role: "Electrician", phone: "0734567890" },
];

// ---------------- Tenant Analytics Page ----------------
const TenantAnalyticsPage = () => {
  return (
    <div className="flex text-black"> {/* Force all text inside to black */}


      <main className="flex-1 p-6 space-y-10 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-black">Tenant Analytics Report</h1>

        {/* Rent Payment History */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-black">Rent Payment History</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tenantRentPayments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#000" /> {/* X-axis labels black */}
              <YAxis stroke="#000" /> {/* Y-axis labels black */}
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(_, __, props: any) => {
                  const dataPoint = props?.payload?.[0]?.payload;
                  if (!dataPoint) return ["", ""];
                  return [`$${dataPoint.amount}`, dataPoint.status];
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#58181C"
                strokeWidth={2}
                dot={{ stroke: "#58181C", strokeWidth: 2, r: 5, fill: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* Maintenance Request Log */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-black">Maintenance Request Log</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tenantMaintenanceRequests}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" stroke="#000" />
              <YAxis stroke="#000" />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(_, __, props: any) => {
                  const dataPoint = props?.payload?.[0]?.payload;
                  if (!dataPoint) return ["", ""];
                  return [dataPoint.status, `Staff: ${dataPoint.staffAssigned}`];
                }}
              />
              <Bar dataKey="status" fill="#C81E1E" />
            </BarChart>
          </ResponsiveContainer>

          {/* Staff Table */}
          <div className="mt-6">
            <h3 className="text-xl font-medium mb-2 text-black">Staff Contacts</h3>
            <table className="w-full border text-left text-black">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Phone</th>
                </tr>
              </thead>
              <tbody>
                {staffContacts.map((staff) => (
                  <tr key={staff.phone} className="hover:bg-gray-50">
                    <td className="p-2 border">{staff.name}</td>
                    <td className="p-2 border">{staff.role}</td>
                    <td className="p-2 border">{staff.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TenantAnalyticsPage;
