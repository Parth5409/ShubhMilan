export const formatDate = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const truncateText = (text, length = 120) => {
  if (!text) return ''
  return text.length > length ? `${text.slice(0, length)}...` : text
}

export const getCompatibilityColor = (value) => {
  if (value >= 85) return 'bg-emerald-500'
  if (value >= 70) return 'bg-indigo-500'
  if (value >= 50) return 'bg-amber-500'
  return 'bg-rose-500'
}

export const getStatusClass = (status) => {
  switch (status) {
    case 'verified':
      return 'bg-emerald-100 text-emerald-700'
    case 'pending':
      return 'bg-amber-100 text-amber-700'
    case 'rejected':
      return 'bg-rose-100 text-rose-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}
