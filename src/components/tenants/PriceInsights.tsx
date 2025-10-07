// src/components/PriceInsights.tsx
export default function PriceInsights({ price }: { price: number }) {
  const avg = 100000; // pretend average rent
  const fair = price <= avg ? "Fair" : "Above Average";

  return (
    <div className="p-4 bg-yellow-50 border rounded-xl">
      <p className="font-semibold">💡 Pricing Insights</p>
      <p className="text-sm text-gray-700">
        Average rent in this area is KES {avg.toLocaleString()}, this house is{" "}
        <span className="font-bold">{fair}</span>.
      </p>
    </div>
  );
}
