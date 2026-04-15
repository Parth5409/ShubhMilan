export const CompatibilityBadge = ({ value }) => {
  const color = value >= 85 ? 'bg-emerald-500' : value >= 70 ? 'bg-indigo-500' : value >= 50 ? 'bg-amber-500' : 'bg-rose-500'
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`}></span>
      {value}% match
    </div>
  )
}
