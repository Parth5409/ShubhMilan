export const StepIndicator = ({ step, total }) => {
  const percent = Math.round((step / total) * 100)
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-medium text-slate-600">
        <span>Step {step} of {total}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-soul-dark" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
