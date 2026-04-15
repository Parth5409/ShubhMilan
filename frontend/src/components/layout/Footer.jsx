import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/70 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">SoulSync AI</p>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
            A digital sanctuary for intentional matchmaking, powered by compatibility, verification, and AI-guided discovery.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Navigation</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li><Link to="/">Philosophy</Link></li>
              <li><Link to="/">Privacy Sanctuary</Link></li>
              <li><Link to="/">Terms of Connection</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Support</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li><Link to="/">Concierge Services</Link></li>
              <li><Link to="/">Verification Process</Link></li>
              <li><Link to="/">Community Guidelines</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
