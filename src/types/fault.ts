export type FaultStatus = "Pending" | "Assigned" | "Resolved";

export type Message = {
  sender: "Landlord" | "Tenant";
  content: string;
  timestamp: string;
};

export type Fault = {
  id: string;
  title: string;
  category: string;
  description: string;
  status: FaultStatus;
  tenantName: string;
  propertyType: string;
  propertyArea: string;
  serviceProvider?: string;
  dateReported: string;
  mediaUrl?: string;

  // Landlord response and priority
  response?: string;
  priority?: "High" | "Medium" | "Low";

  // New chat messages array
  messages?: Message[];

  // NEW properties for SaaS redesign
  tenantEmail?: string;
  tenantPhone?: string;
  unitNumber?: string;
  serviceProviderProgress?: number;
  expectedCompletion?: string;
};
