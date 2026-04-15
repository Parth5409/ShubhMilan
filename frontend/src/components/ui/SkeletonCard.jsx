export const SkeletonCard = () => {
  return (
    <div className="animate-pulse rounded-[2rem] bg-white p-6 shadow-card">
      <div className="mb-4 h-48 w-full rounded-3xl bg-slate-200"></div>
      <div className="space-y-3">
        <div className="h-5 w-3/4 rounded-full bg-slate-200"></div>
        <div className="h-4 w-1/2 rounded-full bg-slate-200"></div>
        <div className="h-4 w-full rounded-full bg-slate-200"></div>
        <div className="h-4 w-5/6 rounded-full bg-slate-200"></div>
        <div className="mt-4 flex items-center justify-between">
          <div className="h-10 w-24 rounded-full bg-slate-200"></div>
          <div className="h-10 w-28 rounded-full bg-slate-200"></div>
        </div>
      </div>
    </div>
  )
}
