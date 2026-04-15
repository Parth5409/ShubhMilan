import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

export const LandingPage = () => {
  const { login, register: signUp, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' } })

  const {
    register: registerForm,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm({ defaultValues: { email: '', password: '', confirmPassword: '' } })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleLogin = async (data) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
      toast.success('Logged in successfully')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords must match')
      return
    }
    setLoading(true)
    try {
      await signUp(data.email, data.password, 'user')
      toast.success('Registration successful! Complete onboarding next.')
      navigate('/onboarding')
    } catch (error) {
      toast.error(error.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex rounded-full bg-soul-soft px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-soul-dark">
            ShubhMilan
          </p>
          <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Find Your Soulmate with AI-Powered Matchmaking
          </h1>
          <p className="max-w-xl text-lg leading-8 text-slate-600">
            Beyond filters. Beyond checkboxes. Experience meaningful connections through advanced personality compatibility and emotional intelligence.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-soul-dark px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/5 transition hover:bg-slate-800">
              Get Started
            </button>
            <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Learn More
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-card ring-1 ring-slate-200">
          <div className="mb-6 flex items-center gap-3 rounded-3xl bg-slate-100 p-4">
            <div className="h-12 w-12 rounded-3xl bg-slate-200" />
            <div>
              <p className="text-sm text-slate-500">AI-Enhanced Compatibility</p>
              <p className="text-lg font-semibold text-slate-900">Verified profiles for intentional connections</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-700">
            {['login', 'register'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-3 transition ${activeTab === tab ? 'bg-soul-dark text-white' : 'text-slate-600 hover:bg-white'}`}
              >
                {tab === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleSubmit(handleLogin)} className="mt-8 space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10"
                />
                {errors.email && <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10"
                />
                {errors.password && <p className="mt-2 text-sm text-rose-600">{errors.password.message}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-3xl bg-soul-dark px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Enter Sanctuary'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit(handleRegister)} className="mt-8 space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input
                  type="email"
                  {...registerForm('email', { required: 'Email is required' })}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10"
                />
                {registerErrors.email && <p className="mt-2 text-sm text-rose-600">{registerErrors.email.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  {...registerForm('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum length is 6' } })}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10"
                />
                {registerErrors.password && <p className="mt-2 text-sm text-rose-600">{registerErrors.password.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                <input
                  type="password"
                  {...registerForm('confirmPassword', { required: 'Please confirm your password' })}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10"
                />
                {registerErrors.confirmPassword && <p className="mt-2 text-sm text-rose-600">{registerErrors.confirmPassword.message}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-3xl bg-soul-dark px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Registering...' : 'Join the Sanctuary'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
