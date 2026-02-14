// src/app/tenant/listing/[id]/page.tsx

import ListingDetailsClient from "@/components/tenants/ListingDetailsClient";



export default async function ListingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = await params;
  const { id } = resolved;

  return <ListingDetailsClient id={id} />;
}
