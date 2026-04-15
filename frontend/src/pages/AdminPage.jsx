import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getPendingVerifications, verifyUser, deleteUser } from '../api/api'
import { Modal } from '../components/ui/Modal.jsx'
import { getStatusClass, formatDate, getImageUrl } from '../utils/helpers'

export const AdminPage = () => {
  const [users, setUsers] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [action, setAction] = useState(null)
  const [reason, setReason] = useState('')
  const [processing, setProcessing] = useState(false)

  const loadUsers = async () => {
    setLoading(true)
    try {
      const items = await getPendingVerifications()
      setUsers(items)
    } catch (error) {
      toast.error(error.message || 'Unable to fetch pending verifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
    const interval = setInterval(loadUsers, 60000)
    return () => clearInterval(interval)
  }, [])

  const toggleRow = (id) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]))
  }

  const openModal = (user, type) => {
    setSelectedUser(user)
    setAction(type)
    setModalOpen(true)
  }

  const handleAction = async () => {
    if (!selectedUser || !action) return
    setProcessing(true)
    try {
      await verifyUser(selectedUser.id, action)
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id))
      toast.success(`User ${action}ed successfully`)
      setModalOpen(false)
    } catch (error) {
      toast.error(error.message || 'Action failed')
    } finally {
      setProcessing(false)
    }
  }

  const handleBulk = async (type) => {
    if (!selectedRows.length) return
    setProcessing(true)
    try {
      await Promise.all(selectedRows.map((id) => verifyUser(id, type)))
      setUsers((prev) => prev.filter((user) => !selectedRows.includes(user.id)))
      setSelectedRows([])
      toast.success(`Bulk ${type} completed`)    
    } catch (error) {
      toast.error(error.message || 'Bulk action failed')
    } finally {
      setProcessing(false)
    }
  }

  const handleDelete = async (user) => {
    if (!confirm('Delete this user?')) return
    setProcessing(true)
    try {
      await deleteUser(user.id)
      setUsers((prev) => prev.filter((item) => item.id !== user.id))
      toast.success('User deleted successfully')
    } catch (error) {
      toast.error(error.message || 'Delete failed')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-card ring-1 ring-slate-200">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Admin Console</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950">Verification Center</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">Ensuring the integrity of the Soul Sanctuary. Review each ID carefully and approve only verified applicants.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => handleBulk('approve')} disabled={!selectedRows.length || processing} className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60">Bulk Approve</button>
            <button onClick={() => handleBulk('reject')} disabled={!selectedRows.length || processing} className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60">Bulk Reject</button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] bg-white shadow-card ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">Select</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">User Info</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">ID Document</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">Submitted</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 text-right font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500">Loading pending verifications…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500">No pending verifications found.</td></tr>
            ) : users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <input type="checkbox" checked={selectedRows.includes(user.id)} onChange={() => toggleRow(user.id)} className="h-4 w-4 rounded border-slate-300 text-soul-dark focus:ring-soul-dark" />
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{user.basic_info.full_name}</div>
                  <div className="text-slate-500">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <img src={getImageUrl(user.verification?.id_image_path)} alt="ID doc" className="h-14 w-24 rounded-2xl object-cover" />
                </td>
                <td className="px-6 py-4 text-slate-600">{formatDate(user.verification?.submitted_at)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(user.verification.status)}`}>{user.verification.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button onClick={() => openModal(user, 'approve')} className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600">Approve</button>
                    <button onClick={() => openModal(user, 'reject')} className="rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-600">Reject</button>
                    <button onClick={() => handleDelete(user)} className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-600">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}>
        <p className="text-sm text-slate-600">Are you sure you want to {action} this user's verification?</p>
        {action === 'reject' && (
          <label className="mt-4 block text-sm text-slate-700">
            Reason for rejection
            <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows="4" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10" />
          </label>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setModalOpen(false)} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Cancel</button>
          <button type="button" onClick={handleAction} disabled={processing} className="rounded-full bg-soul-dark px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{processing ? 'Working...' : action === 'approve' ? 'Approve' : 'Reject'}</button>
        </div>
      </Modal>
    </div>
  )
}
