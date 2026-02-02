"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Search,
  PlusCircle,
  Mail,
  Download,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import { saveAs } from "file-saver";

/* ---------------------------
  Types
----------------------------*/
type PaymentStatus = "Paid" | "Pending" | "Overdue";

type Tenant = {
  id: string;
  name: string;
  property: string;
  rent: number;
  dueDate: string; // ISO date
  leaseStart: string;
  leaseEnd: string;
  status: PaymentStatus;
  contactEmail?: string;
  contactPhone?: string;
  payments?: { date: string; amount: number; status: PaymentStatus }[];
};

/* ---------------------------
  Helpers: storage & utils
----------------------------*/
const STORAGE_KEY = "tunyce_tenants_v1";

const loadTenants = (): Tenant[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Tenant[];
  } catch (e) {
    console.error("Failed to parse tenants from localStorage", e);
    return [];
  }
};

const saveTenants = (arr: Tenant[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
};

const uid = (prefix = "t") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

const formatKsh = (n: number) => `Ksh ${n.toLocaleString()}`;

const todayISO = () => new Date().toISOString().slice(0, 10);

/* ---------------------------
  Demo sample data (only when empty)
----------------------------*/
const sampleTenants = (): Tenant[] => [
  {
    id: "t1",
    name: "John Mwangi",
    property: "Greenview Apt 3",
    rent: 15000,
    dueDate: "2025-11-05",
    leaseStart: "2025-01-01",
    leaseEnd: "2025-12-31",
    status: "Paid",
    contactEmail: "john@example.com",
    contactPhone: "0712000000",
    payments: [
      { date: "2025-10-05", amount: 15000, status: "Paid" },
      { date: "2025-09-05", amount: 15000, status: "Paid" },
    ],
  },
  {
    id: "t2",
    name: "Jane Wambui",
    property: "Sunset Villa",
    rent: 18000,
    dueDate: "2025-11-10",
    leaseStart: "2025-02-01",
    leaseEnd: "2026-01-31",
    status: "Pending",
    contactEmail: "jane@example.com",
    contactPhone: "0712111111",
    payments: [{ date: "2025-10-10", amount: 0, status: "Pending" }],
  },
  {
    id: "t3",
    name: "Brian Otieno",
    property: "Royal Residency Block A",
    rent: 22000,
    dueDate: "2025-10-28",
    leaseStart: "2024-10-01",
    leaseEnd: "2025-09-30",
    status: "Overdue",
    contactEmail: "brian@example.com",
    contactPhone: "0712222222",
    payments: [
      { date: "2025-09-28", amount: 0, status: "Overdue" },
      { date: "2025-08-28", amount: 22000, status: "Paid" },
    ],
  },
];

/* ---------------------------
  Main Page
----------------------------*/
export default function TenantManagementPage() {
  // data
  const [tenants, setTenants] = useState<Tenant[]>([]);
  // ui
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | PaymentStatus>("All");
  const [filterProperty, setFilterProperty] = useState<string>("All properties");
  const [selected, setSelected] = useState<Tenant | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [dark, setDark] = useState(false);

  // load
  useEffect(() => {
    const saved = loadTenants();
    if (saved.length === 0) {
      const demo = sampleTenants();
      saveTenants(demo);
      setTenants(demo);
    } else {
      setTenants(saved);
    }
  }, []);

  // derived lists
  const properties = useMemo(() => {
    const uniq = Array.from(new Set(tenants.map((t) => t.property)));
    return ["All properties", ...uniq];
  }, [tenants]);

  const filtered = useMemo(() => {
    return tenants.filter((t) => {
      if (filterStatus !== "All" && t.status !== filterStatus) return false;
      if (filterProperty !== "All properties" && t.property !== filterProperty)
        return false;
      if (!search) return true;
      const term = search.toLowerCase();
      return (
        t.name.toLowerCase().includes(term) ||
        t.property.toLowerCase().includes(term)
      );
    });
  }, [tenants, search, filterStatus, filterProperty]);

  /* ---------------------------
    Summary cards
  ----------------------------*/
  const totals = useMemo(() => {
    const totalRent = tenants.reduce((s, t) => s + t.rent, 0);
    const counts = {
      Paid: tenants.filter((t) => t.status === "Paid").length,
      Pending: tenants.filter((t) => t.status === "Pending").length,
      Overdue: tenants.filter((t) => t.status === "Overdue").length,
    };
    return { totalRent, ...counts, active: tenants.length };
  }, [tenants]);

  /* ---------------------------
    Charts data
  ----------------------------*/
  // rent trend: sum rents by month (based on dueDate)
  const rentTrend = useMemo(() => {
    // last 6 months (labels)
    const months: { label: string; key: string }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString(undefined, { month: "short" });
      months.push({ key, label });
    }
    const data = months.map((m) => {
      const sum = tenants.reduce((s, t) => {
        // check tenant payments and due month
        if (!t.dueDate) return s;
        const dd = new Date(t.dueDate);
        const key = `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, "0")}`;
        return key === m.key ? s + t.rent : s;
      }, 0);
      return { name: m.label, rent: sum };
    });
    return data;
  }, [tenants]);

  const breakdown = useMemo(() => {
    const paid = tenants.filter((t) => t.status === "Paid").length;
    const pending = tenants.filter((t) => t.status === "Pending").length;
    const overdue = tenants.filter((t) => t.status === "Overdue").length;
    return [
      { name: "Paid", value: paid },
      { name: "Pending", value: pending },
      { name: "Overdue", value: overdue },
    ];
  }, [tenants]);

  /* ---------------------------
    Actions
  ----------------------------*/
  const openDetails = (t: Tenant) => setSelected(t);

  const closeDetails = () => setSelected(null);

  const sendReminder = (t: Tenant) => {
    // Simulated reminder; in future call an API or integrate with messaging provider
    alert(
      `Reminder sent to ${t.name}\nPhone: ${t.contactPhone ?? "N/A"}\nEmail: ${
        t.contactEmail ?? "N/A"
      }`
    );
  };

  const remindAll = () => {
    const pending = tenants.filter((t) => t.status !== "Paid");
    if (pending.length === 0) {
      alert("No pending/overdue tenants to remind.");
      return;
    }
    // simulated
    alert(`Reminders sent to ${pending.length} tenants (simulated).`);
  };

  const handleAddTenant = (payload: Omit<Tenant, "id" | "payments">) => {
    const newTenant: Tenant = {
      ...payload,
      id: uid("t"),
      payments: payload.status === "Paid" ? [{ date: todayISO(), amount: payload.rent, status: "Paid" }] : [],
    };
    const updated = [newTenant, ...tenants];
    setTenants(updated);
    saveTenants(updated);
    setShowAdd(false);
  };

  const exportCSV = () => {
    const headers = [
      "id",
      "name",
      "property",
      "rent",
      "dueDate",
      "leaseStart",
      "leaseEnd",
      "status",
      "email",
      "phone",
    ];
    const rows = tenants.map((t) =>
      headers
        .map((h) => {
          const key = (h === "email" ? "contactEmail" : h === "phone" ? "contactPhone" : h) as keyof Tenant;
          const val = t[key];
          return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val ?? "";
        })
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `tenants_export_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const toggleDark = () => {
    setDark((d) => !d);
    // optional: set css class on document body
    if (!dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  /* ---------------------------
    Render
  ----------------------------*/
  return (
    <div className={`min-h-screen p-6 ${dark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold"> Tenant Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              View tenants, track payments, manage leases and contact tenants.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              title="Toggle theme"
              className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />} <span className="text-sm">{dark ? "Light" : "Dark"}</span>
            </button>

            <button
              onClick={() => setShowAdd(true)}
              className="bg-[#C81E1E] text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 hover:opacity-95"
            >
              <PlusCircle size={16} /> Add Tenant
            </button>
          </div>
        </div>

        {/* Summary + Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-2xl shadow ${dark ? "bg-gray-800" : "bg-white"}`}>
            <div className="text-sm text-gray-500">Total Rent (sum)</div>
            <div className="text-xl font-semibold mt-2">{formatKsh(totals.totalRent)}</div>
            <div className="text-xs text-gray-400 mt-2">Active tenants: {totals.active}</div>
          </div>

          <div className={`p-4 rounded-2xl shadow ${dark ? "bg-gray-800" : "bg-white"}`}>
            <div className="text-sm text-gray-500">Pending Payments</div>
            <div className="text-xl font-semibold mt-2">{totals.Pending}</div>
            <div className="text-xs text-gray-400 mt-2">Follow up with tenants</div>
          </div>

          <div className={`p-4 rounded-2xl shadow ${dark ? "bg-gray-800" : "bg-white"}`}>
            <div className="text-sm text-gray-500">Overdue</div>
            <div className="text-xl font-semibold mt-2">{totals.Overdue}</div>
            <div className="text-xs text-gray-400 mt-2">Take action on overdue rents</div>
          </div>

          <div className={`p-4 rounded-2xl shadow flex flex-col justify-between ${dark ? "bg-gray-800" : "bg-white"}`}>
            <div>
              <div className="text-sm text-gray-500">Quick Actions</div>
              <div className="flex gap-2 mt-3">
                <button onClick={remindAll} className="px-3 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Bell size={16} /> Remind All
                </button>
                <button onClick={exportCSV} className="px-3 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700 inline-flex items-center gap-2">
                  <Download size={16} /> Export CSV
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-400 mt-3">
              Payment statuses updated manually or via API.
            </div>
          </div>
        </div>

        {/* Search & filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className={`flex items-center gap-2 flex-1 p-2 rounded-xl border ${dark ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
            <Search size={18} className={dark ? "text-gray-300" : "text-gray-400"} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tenant or property..."
              className={`flex-1 bg-transparent outline-none text-sm ${dark ? "text-gray-100" : "text-gray-700"}`}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as PaymentStatus | "All")}
            className={`p-2 rounded-xl border ${dark ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white"}`}
          >
            <option value="All">All statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            className={`p-2 rounded-xl border ${dark ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white"}`}
          >
            {properties.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Main grid: table + charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table */}
          <div className={`col-span-2 bg-white rounded-2xl shadow p-4 ${dark ? "bg-gray-800" : ""}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={`${dark ? "text-gray-300" : "text-gray-600"} text-left`}>
                  <tr>
                    <th className="py-3 px-4">Tenant</th>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Rent</th>
                    <th className="py-3 px-4">Due</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{t.name}</td>
                      <td className="py-3 px-4">{t.property}</td>
                      <td className="py-3 px-4">{t.rent.toLocaleString()}</td>
                      <td className="py-3 px-4">{t.dueDate}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            t.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : t.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openDetails(t)}
                            className="px-3 py-1.5 bg-[#C81E1E] text-white rounded-lg text-sm hover:bg-[#58181C]"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => sendReminder(t)}
                            className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-100"
                          >
                            Send Reminder
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-gray-500">
                        No tenants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts */}
          <div className={`bg-white rounded-2xl shadow p-4 space-y-6 ${dark ? "bg-gray-800" : ""}`}>
            <div>
              <h3 className="text-sm text-gray-500 mb-2">Rent Trend (6 months)</h3>
              <div style={{ height: 160 }}>
                <ResponsiveContainer>
                  <LineChart data={rentTrend}>
                    <XAxis dataKey="name" tick={{ fill: dark ? "#E5E7EB" : "#6B7280" }} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="rent" stroke="#C81E1E" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-2">Payment Status</h3>
              <div style={{ height: 140 }}>
                <ResponsiveContainer>
                  <BarChart data={breakdown}>
                    <XAxis dataKey="name" tick={{ fill: dark ? "#E5E7EB" : "#6B7280" }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#58181C" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className={`w-full max-w-2xl rounded-2xl p-6 shadow-lg ${dark ? "bg-gray-900 text-gray-100" : "bg-white"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{selected.name}</h2>
                  <p className="text-sm text-gray-500">{selected.property}</p>
                </div>
                <button onClick={closeDetails} className="text-gray-500">Close</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2 text-sm">
                  <div><strong>Rent:</strong> {formatKsh(selected.rent)}</div>
                  <div><strong>Due Date:</strong> {selected.dueDate}</div>
                  <div><strong>Lease:</strong> {selected.leaseStart} → {selected.leaseEnd}</div>
                  <div><strong>Status:</strong> {selected.status}</div>
                </div>

                <div className="space-y-2 text-sm">
                  <div><strong>Email:</strong> {selected.contactEmail ?? "N/A"}</div>
                  <div><strong>Phone:</strong> {selected.contactPhone ?? "N/A"}</div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm text-gray-500 mb-2">Payment History</h3>
                <div className="bg-gray-50 rounded-xl p-3 text-sm">
                  {selected.payments && selected.payments.length > 0 ? (
                    <ul className="space-y-2">
                      {selected.payments.map((p, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{p.date}</span>
                          <span>{formatKsh(p.amount)}</span>
                          <span className={`ml-4 ${p.status === "Paid" ? "text-green-600" : p.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}>{p.status}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-400">No payments recorded</div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => { navigator.clipboard?.writeText(selected.contactPhone ?? ""); alert("Phone copied"); }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Copy Phone
                </button>

                <button
                  onClick={() => { sendReminder(selected); }}
                  className="px-4 py-2 bg-[#C81E1E] text-white rounded-lg"
                >
                  <Mail size={14} className="inline-block mr-2" />
                  Send Reminder
                </button>

                <button
                  onClick={() => { /* placeholder for open chat */ alert("Open chat (coming soon)"); }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Message
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Tenant Modal */}
        {showAdd && (
          <AddTenantModal
            onClose={() => setShowAdd(false)}
            onSubmit={(payload) => handleAddTenant(payload)}
            dark={dark}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------------------
  Add Tenant Modal Component
----------------------------*/
function AddTenantModal({
  onClose,
  onSubmit,
  dark,
}: {
  onClose: () => void;
  onSubmit: (payload: Omit<Tenant, "id" | "payments">) => void;
  dark?: boolean;
}) {
  const [name, setName] = useState("");
  const [property, setProperty] = useState("");
  const [rent, setRent] = useState<number | "">("");
  const [dueDate, setDueDate] = useState(todayISO());
  const [leaseStart, setLeaseStart] = useState(todayISO());
  const [leaseEnd, setLeaseEnd] = useState("");
  const [status, setStatus] = useState<PaymentStatus>("Pending");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const submit = () => {
    if (!name || !property || !rent) {
      alert("Please fill required fields (name, property, rent).");
      return;
    }
    onSubmit({
      name,
      property,
      rent: Number(rent),
      dueDate,
      leaseStart,
      leaseEnd,
      status,
      contactEmail: email,
      contactPhone: phone,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={`w-full max-w-2xl rounded-2xl p-6 ${dark ? "bg-gray-900 text-gray-100" : "bg-white"}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Tenant</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="p-3 rounded-lg border" placeholder="Tenant Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="p-3 rounded-lg border" placeholder="Property (e.g. Greenview Apt 3)" value={property} onChange={(e) => setProperty(e.target.value)} />
          <input className="p-3 rounded-lg border" placeholder="Rent (Ksh)" value={rent} onChange={(e) => setRent(e.target.value === "" ? "" : Number(e.target.value))} />
          <input type="date" className="p-3 rounded-lg border" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <input type="date" className="p-3 rounded-lg border" value={leaseStart} onChange={(e) => setLeaseStart(e.target.value)} />
          <input type="date" className="p-3 rounded-lg border" value={leaseEnd} onChange={(e) => setLeaseEnd(e.target.value)} />
          <select className="p-3 rounded-lg border" value={status} onChange={(e) => setStatus(e.target.value as PaymentStatus)}>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
          <input className="p-3 rounded-lg border" placeholder="Contact Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="p-3 rounded-lg border" placeholder="Contact Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button onClick={submit} className="px-4 py-2 rounded-lg bg-[#C81E1E] text-white">Add Tenant</button>
        </div>
      </div>
    </div>
  );
}
