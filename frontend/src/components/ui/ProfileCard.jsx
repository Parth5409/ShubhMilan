import { Link } from 'react-router-dom'
import { ShieldCheck, Star } from 'lucide-react'
import { getCompatibilityColor, truncateText } from '../../utils/helpers'

export const ProfileCard = ({ profile, onSendInterest, disabled, sent }) => {
  return (
    <article className="overflow-hidden rounded-[2rem] bg-white shadow-card ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden bg-slate-900">
        <img src={profile.profile_photo_url || 'https://via.placeholder.com/400'} alt={profile.basic_info?.full_name || 'User'} className="h-64 w-full object-cover" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
          <ShieldCheck size={16} /> {profile.verification?.status || 'pending'}
        </div>
        <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-2 text-xs font-semibold text-white">
          <Star size={14} /> {profile.compatibility || 0}% match
        </div>
      </div>
      <div className="space-y-4 p-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{profile.basic_info?.full_name || 'Unknown'}, {profile.basic_info?.age || 'N/A'}</h3>
          <p className="text-sm text-slate-500">{profile.basic_info?.city || 'Unknown'} · {profile.professional_info?.occupation || 'Unknown'}</p>
        </div>
        <p className="text-sm leading-6 text-slate-600">{truncateText(profile.ai_profile?.bio || 'No bio available.', 120)}</p>
        <div className="flex flex-wrap gap-2">
          {(profile.ai_profile?.interests || []).slice(0, 3).map((interest) => (
            <span key={interest} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{interest}</span>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to={`/profile/${profile.id}`}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            View Profile
          </Link>
          <div className="flex items-center justify-between gap-4">
            <span className={`rounded-full px-3 py-2 text-sm font-semibold text-white shadow-sm ${getCompatibilityColor(profile.compatibility)}`}>
              Soul match {profile.compatibility}%
            </span>
            <button
              onClick={() => onSendInterest(profile.id)}
              disabled={disabled}
              className="inline-flex items-center justify-center rounded-full bg-soul-dark px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sent ? 'Sent ✓' : 'Send Interest'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
