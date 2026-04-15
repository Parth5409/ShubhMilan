import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getMatches, sendInterest } from '../api/mock'
import { useDebounce } from '../hooks/useDebounce'
import { ProfileCard } from '../components/ui/ProfileCard.jsx'
import { SkeletonCard } from '../components/ui/SkeletonCard.jsx'
import { Modal } from '../components/ui/Modal.jsx'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [message, setMessage] = useState('Hi, I found your profile inspiring and would love to connect.')
  const [sentIds, setSentIds] = useState([])
  const debouncedQuery = useDebounce(searchQuery, 500)

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true)
      try {
        const items = await getMatches(debouncedQuery)
        setMatches(items)
      } catch (error) {
        toast.error(error.message || 'Unable to load matches')
      } finally {
        setLoading(false)
      }
    }
    loadMatches()
  }, [debouncedQuery])

  const handleSendInterest = async () => {
    if (!selectedProfile) return
    setSending(true)
    try {
      await sendInterest(selectedProfile, message)
      setSentIds((prev) => [...prev, selectedProfile])
      toast.success('Interest sent!')
      setSelectedProfile(null)
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-6 rounded-[2rem] bg-white p-8 shadow-card ring-1 ring-slate-200 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Discover</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">Find your eternal connection.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Describe your ideal partner in natural language and explore verified soulmate matches.</p>
        </div>
        <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search for a profile, city, or interest..."
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)
          : matches.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onSendInterest={(id) => setSelectedProfile(id)}
              disabled={sentIds.includes(profile.id)}
              sent={sentIds.includes(profile.id)}
            />
          ))}
      </div>

      <Modal isOpen={Boolean(selectedProfile)} onClose={() => setSelectedProfile(null)} title="Send Interest">
        <p className="text-sm text-slate-600">Write a short message to introduce yourself.</p>
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows="5" className="mt-4 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10" />
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setSelectedProfile(null)} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            Cancel
          </button>
          <button type="button" onClick={handleSendInterest} disabled={sending} className="rounded-full bg-soul-dark px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
            {sending ? 'Sending...' : 'Send Interest'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
