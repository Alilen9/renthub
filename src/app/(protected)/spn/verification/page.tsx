"use client";

import SPNSidebar from "@/components/spn/SPNSidebar";
import { useState, ChangeEvent } from "react";

type DocStatus = "Pending" | "Verified" | "Rejected";

interface Document {
  id: number;
  name: string;
  status: DocStatus;
  file?: File;
}

export default function SPNVerificationPage() {
  const [documents, setDocuments] = useState<Document[]>([
    { id: 1, name: "National ID / Passport", status: "Verified" },
    { id: 2, name: "Professional Certificate", status: "Pending" },
    { id: 3, name: "Bank Details", status: "Pending" },
  ]);

  const handleFileUpload = (id: number, e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === id ? { ...doc, file, status: "Pending" } : doc
      )
    );
  };

  const getStatusColor = (status: DocStatus) => {
    switch (status) {
      case "Verified":
        return "text-green-600";
      case "Rejected":
        return "text-red-600";
      case "Pending":
        return "text-yellow-600";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      <SPNSidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Account Verification</h1>

          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 space-y-6">
            <h2 className="text-lg font-semibold mb-4">Documents</h2>

            <ul className="space-y-4">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex-1">
                    <span className="font-medium">{doc.name}</span>
                    <span className={`ml-2 font-semibold ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>

                  <div className="mt-2 md:mt-0 flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(doc.id, e)}
                      className="text-black"
                    />
                    {doc.file && <span className="text-sm text-gray-700">{doc.file.name}</span>}
                  </div>
                </li>
              ))}
            </ul>

            <button
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              onClick={() => alert("Documents submitted for verification")}
            >
              Submit Documents
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
