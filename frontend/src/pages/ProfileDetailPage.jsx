import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getUserById, getIcebreakers, sendInterest } from '../api/api'
import { useAuth } from '../hooks/useAuth'
import { Modal } from '../components/ui/Modal.jsx'
import { SkeletonCard } from '../components/ui/SkeletonCard.jsx'
import { CompatibilityBadge } from '../components/ui/CompatibilityBadge.jsx'

export const ProfileDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalType, setModalType] = useState(null)
  const [icebreakers, setIcebreakers] = useState([])
  const [interestMessage, setInterestMessage] = useState('Hi, I would love to learn more about your journey and values.')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (!id) {
      navigate('/dashboard')
      return
    }
    const loadProfile = async () => {
      setLoading(true)
      try {
        const user = await getUserById(id)
        setProfile(user)
      } catch (error) {
        toast.error(error.message || 'User not found')
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [id, navigate])

  const handleGenerateIcebreakers = async () => {
    setActionLoading(true)
    try {
      const response = await getIcebreakers(id)
      setIcebreakers(response.icebreakers)
      setModalType('icebreakers')
    } catch (error) {
      toast.error(error.message || 'Unable to generate icebreakers')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSendInterest = async () => {
    setActionLoading(true)
    try {
      await sendInterest(id, interestMessage)
      toast.success('Interest sent!')
      setModalType(null)
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <SkeletonCard />
      </div>
    )
  }

  const { user } = useAuth()
  const isOwnProfile = profile?.id === user?.id

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.7fr_0.9fr]">
        <section className="rounded-[2rem] bg-white p-8 shadow-card ring-1 ring-slate-200">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">{profile.basic_info?.city || 'Unknown'}, {profile.basic_info?.state || 'Unknown'}</p>
              <h1 className="mt-2 text-4xl font-semibold text-slate-950">{profile.basic_info?.full_name || 'Unknown'}, {profile.basic_info?.age || 'N/A'}</h1>
              <p className="mt-2 text-sm text-slate-600">{profile.professional_info?.occupation || 'Unknown'} · {profile.professional_info?.education || 'Unknown'}</p>
            </div>
            <CompatibilityBadge value={profile.compatibility || null} />
          </div>

          <img src={profile.profile_photo_url || 'https://via.placeholder.com/400'} alt={profile.basic_info?.full_name || 'User'} className="w-full rounded-[2rem] object-cover" />

          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">The Narrative</h2>
              <p className="mt-3 leading-7 text-slate-600">{profile.ai_profile?.bio || 'No bio available yet.'}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700 ring-1 ring-slate-200">
                <p className="font-semibold text-slate-900">Height</p>
                <p className="mt-2">{profile.basic_info?.height || 'N/A'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700 ring-1 ring-slate-200">
                <p className="font-semibold text-slate-900">Spirituality</p>
                <p className="mt-2">Pluralistic / Spiritual</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700 ring-1 ring-slate-200">
                <p className="font-semibold text-slate-900">Education</p>
                <p className="mt-2">{profile.professional_info?.education || 'Unknown'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700 ring-1 ring-slate-200">
                <p className="font-semibold text-slate-900">Languages</p>
                <p className="mt-2">English, Hindi</p>
              </div>
            </div>
            <div className="rounded-[2rem] bg-slate-50 p-6 ring-1 ring-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Cosmic Alignment</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">Your {profile.astrology?.sun_sign || 'Unknown'} sun brings a magnetic warmth and leadership to her life, while her {profile.astrology?.moon_sign || 'Unknown'} moon adds a layer of intuitive depth that complements your rational nature.</p>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200">
            {isOwnProfile ? (
              <button onClick={() => navigate('/onboarding')} className="mb-4 w-full rounded-full bg-soul-dark px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Edit Profile
              </button>
            ) : (
              <button onClick={() => setModalType('send')} className="mb-4 w-full rounded-full bg-soul-dark px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">Send Interest</button>
            )}
            <button onClick={handleGenerateIcebreakers} disabled={actionLoading} className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">Generate Icebreakers</button>
          </section>
          <section className="rounded-[2rem] bg-slate-50 p-6 ring-1 ring-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Intentional Connection</h3>
            <div className="mt-5 space-y-4">
              <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-900">Looking For</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">A long-term partnership built on mutual intellectual curiosity and shared life goals.</p>
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-900">Location Preference</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Willing to relocate for the right connection within North America or Europe.</p>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <Modal isOpen={modalType === 'icebreakers'} onClose={() => setModalType(null)} title="Icebreakers">
        <div className="space-y-4">
          {icebreakers.length > 0 ? (
            icebreakers.map((item, index) => (
              <p key={index} className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">{item}</p>
            ))
          ) : (
            <p className="text-sm text-slate-600">No icebreakers available yet.</p>
          )}
        </div>
      </Modal>

      <Modal isOpen={modalType === 'send'} onClose={() => setModalType(null)} title="Send Interest">
        <textarea value={interestMessage} onChange={(event) => setInterestMessage(event.target.value)} rows="5" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10" />
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setModalType(null)} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Cancel</button>
          <button type="button" onClick={handleSendInterest} disabled={actionLoading} className="rounded-full bg-soul-dark px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{actionLoading ? 'Sending...' : 'Send Interest'}</button>
        </div>
      </Modal>
    </div>
  )
}
