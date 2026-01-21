"use client";

import SPNSidebar from "@/components/spn/SPNSidebar";
import { useState, useMemo } from "react";

// Dummy tasks
const dummyTasks = [
  { id: 1, property: "Property 1", description: "Fix leaking pipe", due: "2025-11-20", status: "Pending", priority: "High" },
  { id: 2, property: "Property 2", description: "Replace light bulb", due: "2025-11-18", status: "Completed", priority: "Low" },
  { id: 3, property: "Property 3", description: "Paint walls", due: "2025-11-25", status: "Pending", priority: "Medium" },
  { id: 4, property: "Property 4", description: "Clean gutters", due: "2025-11-15", status: "Pending", priority: "High" },
];

export default function SPNTasksPage() {
  const [tasks, setTasks] = useState(dummyTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.property.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  // Stats
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => t.status === "Pending").length;
  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const overdueTasks = tasks.filter(t => t.status === "Pending" && new Date(t.due) < new Date()).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SPNSidebar />

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-black">Tasks</h1>

          {/* Search and Filter */}
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Search tasks..."
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow text-center border border-gray-100">
            <p className="text-gray-500">Total Tasks</p>
            <h2 className="text-2xl font-bold text-indigo-600">{totalTasks}</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center border border-gray-100">
            <p className="text-gray-500">Pending</p>
            <h2 className="text-2xl font-bold text-yellow-600">{pendingTasks}</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center border border-gray-100">
            <p className="text-gray-500">Completed</p>
            <h2 className="text-2xl font-bold text-green-600">{completedTasks}</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center border border-gray-100">
            <p className="text-gray-500">Overdue</p>
            <h2 className="text-2xl font-bold text-red-600">{overdueTasks}</h2>
          </div>
        </div>

        {/* Task Table */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Task List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-black">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Property</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Priority</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No tasks found.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map(task => (
                    <tr key={task.id} className="border-b">
                      <td className="px-4 py-2">{task.property}</td>
                      <td className="px-4 py-2">{task.description}</td>
                      <td className="px-4 py-2">{task.due}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-white text-sm ${
                          task.priority === "High" ? "bg-red-500" :
                          task.priority === "Medium" ? "bg-yellow-500" :
                          "bg-green-500"
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-3 py-1 rounded-full text-white text-sm ${
                          task.status === "Completed" ? "bg-green-500" : 
                          new Date(task.due) < new Date() ? "bg-red-500" : "bg-yellow-500"
                        }`}>
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
