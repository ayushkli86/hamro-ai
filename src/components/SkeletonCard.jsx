export default function SkeletonCard() {
  return (
    <div className="bg-[#161616] border border-gray-800 rounded-xl p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div><div className="h-5 w-32 bg-gray-700 rounded mb-2" /><div className="h-3 w-20 bg-gray-700 rounded" /></div>
        <div className="h-4 w-12 bg-gray-700 rounded" />
      </div>
      <div className="h-10 bg-gray-700 rounded mb-4" />
      <div className="flex justify-between items-end mt-5">
        <div><div className="h-6 w-20 bg-gray-700 rounded mb-1" /><div className="h-3 w-24 bg-gray-700 rounded" /></div>
        <div className="h-9 w-28 bg-gray-700 rounded-lg" />
      </div>
    </div>
  )
}
