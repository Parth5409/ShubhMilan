import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getReceivedInterests, getSentInterests, respondToInterest } from '../api/mock'
import { Modal } from '../components/ui/Modal.jsx'

export const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState('received')
  const [receivedList, setReceivedList] = useState([])
  const [sentList, setSentList] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentInterest, setCurrentInterest] = useState(null)
  const [actionType, setActionType] = useState(null)
  const [reason, setReason] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true)
      try {
        const [received, sent] = await Promise.all([getReceivedInterests(), getSentInterests()])
        setReceivedList(received)
        setSentList(sent)
      } catch (error) {
        toast.error(error.message || 'Unable to load requests')
      } finally {
        setLoading(false)
      }
    }
    loadRequests()
  }, [])

  const updateRequestState = (id, status) => {
    setReceivedList((items) => items.map((item) => (item.id === id ? { ...item, status } : item)))
    setSentList((items) => items.map((item) => (item.id === id ? { ...item, status } : item)))
  }

  const handleRespond = async (interest, status) => {
    setCurrentInterest(interest)
    setActionType(status)
  }

  const confirmResponse = async () => {
    if (!currentInterest) return
    setProcessing(true)
    const originalStatus = currentInterest.status
    updateRequestState(currentInterest.id, actionType)
    setCurrentInterest(null)
    setActionType(null)

    try {
      await respondToInterest(currentInterest.id, actionType)
      toast.success(`Request ${actionType}`)
      if (actionType === 'declined') {
        toast(
          (t) => (
            <span className="flex items-center justify-between gap-4">
              Request declined
              <button onClick={() => {
                updateRequestState(currentInterest.id, originalStatus)
                toast.dismiss(t.id)
              }} className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                Undo
              </button>
            </span>
          ),
          { duration: 5000 }
        )
      }
    } catch (error) {
      updateRequestState(currentInterest.id, originalStatus)
      toast.error(error.message || 'Unable to update request')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-white p-8 shadow-card ring-1 ring-slate-200">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Connection Requests</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">Manage your intentional connections.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Each request represents a potential shared future in our digital sanctuary.</p>
        </div>
        <div className="flex gap-4 rounded-full bg-slate-100 p-2 text-sm font-semibold text-slate-700">
          {['received', 'sent'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-5 py-3 transition ${activeTab === tab ? 'bg-white shadow-sm' : 'hover:bg-slate-200'}`}>
              {tab === 'received' ? 'Received' : 'Sent'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {(loading ? Array.from({ length: 2 }) : activeTab === 'received' ? receivedList : sentList).map((item) => (
          <div key={item.id} className="rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">{item.sender?.basic_info.full_name || item.receiver?.basic_info.full_name}</h2>
                <p className="mt-1 text-sm text-slate-500">{item.sender?.basic_info.city || item.receiver?.basic_info.city} · {item.created_at && new Date(item.created_at).toLocaleDateString()}</p>
              </div>
              <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{item.status}</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">"{item.message}"</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {activeTab === 'received' ? (
                <>
                  <button onClick={() => handleRespond(item, 'accepted')} className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">Accept Interest</button>
                  <button onClick={() => handleRespond(item, 'declined')} className="rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">Decline</button>
                </>
              ) : (
                <span className="text-sm text-slate-500">Status updated</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={Boolean(currentInterest)} onClose={() => setCurrentInterest(null)} title={actionType === 'accepted' ? 'Confirm Acceptance' : 'Confirm Decline'}>
        <p className="text-sm text-slate-600">Are you sure you want to {actionType} this interest?</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setCurrentInterest(null)} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Cancel</button>
          <button type="button" onClick={confirmResponse} disabled={processing} className="rounded-full bg-soul-dark px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{processing ? 'Processing...' : 'Confirm'}</button>
        </div>
      </Modal>
    </div>
  )
}
