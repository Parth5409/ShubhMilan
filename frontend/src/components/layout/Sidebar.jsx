import { Link } from 'react-router-dom'
import { Home, Heart, MessageSquare, ShieldCheck, Grid } from 'lucide-react'

export const Sidebar = ({ className = '' }) => {
  return (
    <aside className={`hidden w-72 shrink-0 flex-col gap-4 rounded-3xl bg-white/90 p-6 shadow-card lg:flex ${className}`}>
      <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-soul-dark">
          <Grid size={20} />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">ShubhMilan</p>
          <p className="text-base font-semibold text-slate-900">Digital Sanctuary</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <Link className="inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100" to="/dashboard">
          <Home size={18} /> Discover
        </Link>
        <Link className="inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100" to="/requests">
          <Heart size={18} /> Matches
        </Link>
        <Link className="inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100" to="/admin">
          <ShieldCheck size={18} /> Admin
        </Link>
      </nav>
    </aside>
  )
}
