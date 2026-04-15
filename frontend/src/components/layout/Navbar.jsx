import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 bg-white/80 border-b border-slate-200 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-semibold tracking-tight text-slate-900">
          ShubhMilan
        </Link>

        <button
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <nav className={`transform transition-all duration-200 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} fixed left-0 top-16 z-20 w-full bg-white p-4 shadow-lg lg:shadow-none lg:block lg:w-auto`}>
          <ul className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'font-semibold text-soul-dark' : 'text-slate-600 hover:text-soul-dark'}>
                Discover
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'font-semibold text-soul-dark' : 'text-slate-600 hover:text-soul-dark'}>
                Matches
              </NavLink>
            </li>
            <li>
              <NavLink to="/requests" className={({ isActive }) => isActive ? 'font-semibold text-soul-dark' : 'text-slate-600 hover:text-soul-dark'}>
                Requests
              </NavLink>
            </li>
            {isAuthenticated ? (
              <li>
                <NavLink to={`/profile/${user?.id}`} className={({ isActive }) => isActive ? 'font-semibold text-soul-dark' : 'text-slate-600 hover:text-soul-dark'}>
                  My Profile
                </NavLink>
              </li>
            ) : null}
            {/* <li>
              <NavLink to="/admin" className={({ isActive }) => isActive ? 'font-semibold text-soul-dark' : 'text-slate-600 hover:text-soul-dark'}>
                Admin
              </NavLink>
            </li> */}
            {isAuthenticated ? (
              <li className="mt-2 border-t border-slate-200 pt-4 lg:mt-0 lg:border-none lg:pt-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500">{user?.basic_info?.full_name || user?.email}</span>
                  <button
                    onClick={logout}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>
    </header>
  )
}
