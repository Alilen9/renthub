export default function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-48 bg-gray-300" />

      <div className="p-4 space-y-4">
        {/* Title placeholder */}
        <div className="h-6 bg-gray-300 rounded w-3/4" />
        
        {/* Description placeholder */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded" />
          <div className="h-4 bg-gray-300 rounded w-5/6" />
        </div>

        {/* Location placeholder */}
        <div className="h-4 bg-gray-300 rounded w-1/2" />

        <div className="flex justify-between items-center pt-2">
          {/* Price placeholder */}
          <div className="h-8 bg-gray-300 rounded w-1/4" />
          {/* Button placeholder */}
          <div className="h-8 bg-gray-300 rounded-lg w-20" />
        </div>
      </div>
    </div>
  );
}
