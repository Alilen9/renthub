"use client";


interface PackageSelectorProps {
  selected: string;
  onChange: (pkg: string) => void;
}

const packages = [
  {
    id: "free",
    label: "Free (Trial)",
    description:
      "Visible only in your county. Max 3 files (≤10MB each). Perfect for testing the service.",
    priceKsh: 0,
    priceUsd: 0,
  },
  {
    id: "standard",
    label: "Standard",
    description:
      "Reach people across multiple counties. Upload up to 10 files (photos, videos, 360°).",
    priceKsh: 1500,
    priceUsd: 12,
    popular: true,
  },
  {
    id: "premium",
    label: "Premium",
    description:
      "Visible across all Kenya and internationally. Maximum exposure for your listing.",
    priceKsh: 3000,
    priceUsd: 25,
    premium: true, // <-- Added premium property
  },
];

export default function PackageSelector({
  selected,
  onChange,
}: PackageSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Choose Package</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packages.map((pkg) => {
          const isSelected = selected === pkg.id;
          return (
            <div
              key={pkg.id}
              onClick={() => onChange(pkg.id)}
              className={`cursor-pointer border rounded-lg p-4 flex flex-col justify-between relative transition-all ${
                isSelected
                  ? "border-red-600 shadow-md bg-red-50"
                  : "border-gray-300 hover:border-red-400"
              }`}
            >
              {/* Badge for popular plan */}
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-gray-800 shadow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-3.5 w-3.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Most Popular
                  </span>
                </div>
              )}

              {/* Badge for premium plan */}
              {pkg.premium && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold text-white shadow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-3.5 w-3.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.615 1.517L11.516 6a.75.75 0 01-.42.42l-4.483 3.097a.75.75 0 00-.476 1.353l.764.763c.228.228.375.5.424.782l.626 3.064c.228 1.114 1.341 1.956 2.457 1.574l2.56-1.047a.75.75 0 01.996.793l-.368 1.838a.75.75 0 001.037.893l3.655-1.828a.75.75 0 01.76-.025l1.096.548c1.114.557 2.378-.456 2.378-1.722V6.653a.75.75 0 00-.31-.599L18.775 5.37a.75.75 0 01-.76-.025l-.723-.362V1.5c0-.853-1.096-1.282-1.748-.639L14.615 1.517z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Maximum Exposure
                  </span>
                </div>
              )}
              
              <div className="mt-2">
                <h4
                  className={`text-lg font-semibold ${
                    isSelected ? "text-red-600" : "text-gray-800"
                  }`}
                >
                  {pkg.label}
                </h4>
                <p className="mt-1 text-sm text-gray-600">{pkg.description}</p>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">Price:</p>
                <p className="font-bold text-gray-800">
                  {pkg.priceKsh === 0
                    ? "Free"
                    : `Ksh ${pkg.priceKsh.toLocaleString()}`}
                </p>
                {pkg.priceUsd > 0 && (
                  <p className="text-sm text-gray-500">≈ ${pkg.priceUsd} USD</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500">
        Selected package:{" "}
        <span className="font-semibold text-red-600">
          {packages.find((p) => p.id === selected)?.label}
        </span>
      </p>
    </div>
  );
}