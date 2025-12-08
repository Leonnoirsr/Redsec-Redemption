export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-12 animate-pulse">
      <div className="bg-gray-800 border-b border-gray-700 p-4 h-16"></div>
      
      <div className="container mx-auto p-4 pt-8 space-y-8">
        {/* Profile Header Skeleton */}
        <div className="flex items-center gap-6 bg-gray-800/50 p-6 rounded-2xl border border-gray-700 h-40">
          <div className="w-32 h-32 rounded-full bg-gray-700"></div>
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-700 rounded"></div>
            <div className="h-4 w-24 bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-lg h-24"></div>
          ))}
        </div>
      </div>
    </div>
  );
}


