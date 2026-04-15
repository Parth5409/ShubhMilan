import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { generateAstrology, enhanceBio, updateUserProfile, uploadProfilePhoto } from '../api/api'
import { StepIndicator } from '../components/forms/StepIndicator.jsx'
import { getImageUrl } from '../utils/helpers'

const STORAGE_KEY = 'soulsync_onboarding_draft'

const defaultDraft = {
  profile_photo_url: '',
  basic_info: { full_name: '', age: '', gender: '', city: '', mobile_number: '' },
  professional_info: { education: '', occupation: '', company: '' },
  astrology: { dob: '', time: '', place: '', sun_sign: '', moon_sign: '', reading: '' },
  ai_profile: { raw_bio: '', bio: '' },
  partner_preferences: { min_age: '', max_age: '', preferred_cities: '', relationship_goal: '' },
}

export const OnboardingPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [astrologyLoading, setAstrologyLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [draft, setDraft] = useState(defaultDraft)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)

  const form = useForm({ defaultValues: draft })
  const { register, handleSubmit, watch, reset, formState: { errors } } = form

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setDraft(parsed)
        reset(parsed)
      } catch (error) {
        // ignore invalid draft
      }
    }
  }, [navigate, reset, user])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  }, [draft])

  const values = watch()

  useEffect(() => {
    if (values) {
      setDraft(values)
    }
  }, [values])

  const stepTitle = useMemo(() => {
    const titles = ['Your Identity', 'Professional Story', 'Birth Details', 'Digital Reflection', 'Connection Preferences', 'Review & Submit']
    return titles[currentStep - 1]
  }, [currentStep])

  const generateAstrologyData = async () => {
    setAstrologyLoading(true)
    try {
      const { dob, time, place } = values.astrology
      const result = await generateAstrology(dob, time, place)
      setDraft((prev) => ({ ...prev, astrology: { ...prev.astrology, ...result } }))
      reset({ ...values, astrology: { ...values.astrology, ...result } })
      toast.success('Astrology chart generated.')
    } catch (error) {
      toast.error(error.message || 'Failed to generate astrology')
    } finally {
      setAstrologyLoading(false)
    }
  }

  const enhanceBioText = async () => {
    setAiLoading(true)
    try {
      const { raw_bio } = values.ai_profile
      const { enhanced_bio } = await enhanceBio(raw_bio)
      const updated = { ...values, ai_profile: { ...values.ai_profile, bio: enhanced_bio } }
      setDraft(updated)
      reset(updated)
      toast.success('Bio enhanced with AI.')
    } catch (error) {
      toast.error(error.message || 'Failed to enhance bio')
    } finally {
      setAiLoading(false)
    }
  }

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoPreview(reader.result)
    }
    reader.readAsDataURL(file)

    setPhotoLoading(true)
    try {
      const { url } = await uploadProfilePhoto(file)
      setDraft((prev) => ({ ...prev, profile_photo_url: url }))
      reset({ ...values, profile_photo_url: url })
      toast.success('Photo uploaded successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to upload photo')
      setPhotoPreview(null)
    } finally {
      setPhotoLoading(false)
    }
  }

  const handleNextStep = async (data) => {
    if (currentStep === 3 && !data.astrology.sun_sign) {
      toast.error('Generate your astrology profile before moving forward.')
      return
    }
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      await updateUserProfile(user.id, draft)
      localStorage.removeItem(STORAGE_KEY)
      toast.success('Profile completed. Welcome to SoulSync!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Failed to complete onboarding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">Onboarding Journey</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Your Digital Reflection</h1>
        <p className="max-w-3xl text-slate-600">Complete your profile in six thoughtful steps. Our AI uses your values, interests, and birth details to create deeper matches.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.65fr]">
        <section className="rounded-[2rem] bg-white p-8 shadow-card ring-1 ring-slate-200">
          <StepIndicator step={currentStep} total={6} />
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-slate-900">{stepTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Step {currentStep} of 6 — your progress is saved automatically.</p>
          </div>

          <form onSubmit={handleSubmit(handleNextStep)} className="mt-8 space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-4 border-b border-slate-100 pb-6">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-200">
                    {photoPreview || values.profile_photo_url ? (
                      <img src={photoPreview || getImageUrl(values.profile_photo_url)} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    {photoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-soul-dark border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200">
                    {values.profile_photo_url ? 'Change Photo' : 'Upload Photo'}
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  </label>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Full name
                  <input type="text" {...register('basic_info.full_name', { required: 'Name is required' })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10" />
                  {errors.basic_info?.full_name && <span className="text-xs text-rose-600">{errors.basic_info.full_name.message}</span>}
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Age
                  <input type="number" {...register('basic_info.age', { required: 'Age is required' })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10" />
                  {errors.basic_info?.age && <span className="text-xs text-rose-600">{errors.basic_info.age.message}</span>}
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Gender
                  <select {...register('basic_info.gender', { required: 'Gender is required' })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10">
                    <option value="">Select your gender</option>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Non-binary</option>
                  </select>
                  {errors.basic_info?.gender && <span className="text-xs text-rose-600">{errors.basic_info.gender.message}</span>}
                </label>
                  <label className="space-y-2 text-sm text-slate-700">
                    City
                    <input type="text" {...register('basic_info.city', { required: 'City is required' })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10" />
                    {errors.basic_info?.city && <span className="text-xs text-rose-600">{errors.basic_info.city.message}</span>}
                  </label>
                  <label className="space-y-2 text-sm text-slate-700">
                    Mobile Number
                    <input type="tel" {...register('basic_info.mobile_number', { required: 'Mobile number is required' })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10" />
                    {errors.basic_info?.mobile_number && <span className="text-xs text-rose-600">{errors.basic_info.mobile_number.message}</span>}
                  </label>
                </div>
            </div>
          )}

            {currentStep === 2 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Education
                  <input type="text" {...register('professional_info.education', { required: 'Education is required' })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10" />
                  {errors.professional_info?.education && <span className="text-xs text-rose-600">{errors.professional_info.education.message}</span>}
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Occupation
                  <input type="text" {...register('professional_info.occupation', { required: 'Occupation is required' })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10" />
                  {errors.professional_info?.occupation && <span className="text-xs text-rose-600">{errors.professional_info.occupation.message}</span>}
                </label>
                <label className="space-y-2 text-sm text-slate-700 sm:col-span-2">
                  Company
                  <input type="text" {...register('professional_info.company')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10" />
                </label>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-3">
                  <label className="space-y-2 text-sm text-slate-700">
                    Date of birth
                    <input type="date" {...register('astrology.dob', { required: 'DOB is required' })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10" />
                    {errors.astrology?.dob && <span className="text-xs text-rose-600">{errors.astrology.dob.message}</span>}
                  </label>
                  <label className="space-y-2 text-sm text-slate-700">
                    Time of birth
                    <input type="time" {...register('astrology.time', { required: 'Birth time is required' })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10" />
                    {errors.astrology?.time && <span className="text-xs text-rose-600">{errors.astrology.time.message}</span>}
                  </label>
                  <label className="space-y-2 text-sm text-slate-700">
                    Place of birth
                    <input type="text" {...register('astrology.place', { required: 'Birth place is required' })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10" />
                    {errors.astrology?.place && <span className="text-xs text-rose-600">{errors.astrology.place.message}</span>}
                  </label>
                </div>
                <button type="button" onClick={generateAstrologyData} disabled={astrologyLoading} className="rounded-3xl bg-soul-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                  {astrologyLoading ? 'Generating...' : 'Generate Astrology'}
                </button>
                {values.astrology.sun_sign && (
                  <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700 ring-1 ring-slate-200">
                    <p className="font-semibold text-slate-900">Sun Sign: {values.astrology.sun_sign}</p>
                    <p className="font-semibold text-slate-900">Moon Sign: {values.astrology.moon_sign}</p>
                    <p className="mt-3 leading-7">{values.astrology.reading}</p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-5">
                <label className="space-y-2 text-sm text-slate-700">
                  Describe your values, your journey, and what makes you unique.
                  <textarea rows="6" {...register('ai_profile.raw_bio', { required: 'Your story helps us match you' })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10" />
                  {errors.ai_profile?.raw_bio && <span className="text-xs text-rose-600">{errors.ai_profile.raw_bio.message}</span>}
                </label>
                <button type="button" onClick={enhanceBioText} disabled={aiLoading} className="rounded-3xl bg-soul-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                  {aiLoading ? 'Enhancing...' : 'Enhance with AI'}
                </button>
                {values.ai_profile.bio && (
                  <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700 ring-1 ring-slate-200">
                    <p className="font-semibold text-slate-900">AI Enhanced Bio</p>
                    <p className="mt-3 leading-7">{values.ai_profile.bio}</p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 5 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Age range
                  <div className="flex gap-3">
                    <input type="number" {...register('partner_preferences.min_age', { required: 'Min age is required' })} placeholder="Min" className="w-1/2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10" />
                    <input type="number" {...register('partner_preferences.max_age', { required: 'Max age is required' })} placeholder="Max" className="w-1/2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10" />
                  </div>
                  {(errors.partner_preferences?.min_age || errors.partner_preferences?.max_age) && (
                    <span className="text-xs text-rose-600">{errors.partner_preferences?.min_age?.message || errors.partner_preferences?.max_age?.message}</span>
                  )}
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Preferred cities
                  <input type="text" {...register('partner_preferences.preferred_cities', { required: 'Preferred cities are required' })} placeholder="Mumbai, Pune, Bangalore" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10" />
                  {errors.partner_preferences?.preferred_cities && <span className="text-xs text-rose-600">{errors.partner_preferences.preferred_cities.message}</span>}
                </label>
                <label className="sm:col-span-2 space-y-2 text-sm text-slate-700">
                  Relationship goal
                  <select {...register('partner_preferences.relationship_goal', { required: 'Relationship goal is required' })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-soul-dark focus:ring-2 focus:ring-soul-dark/10">
                    <option value="">Choose a goal</option>
                    <option value="long-term">Long-term partnership</option>
                    <option value="serious">Serious relationship</option>
                    <option value="friendship">Meaningful friendship</option>
                  </select>
                  {errors.partner_preferences?.relationship_goal && <span className="text-xs text-rose-600">{errors.partner_preferences.relationship_goal.message}</span>}
                </label>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6 rounded-[2rem] bg-slate-50 p-6 ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Review your profile</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <p className="text-sm text-slate-500">Name</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{values.basic_info.full_name}</p>
                  </div>
                  <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <p className="text-sm text-slate-500">City</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{values.basic_info.city}</p>
                  </div>
                  <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <p className="text-sm text-slate-500">Mobile Number</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{values.basic_info.mobile_number}</p>
                  </div>
                  <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:col-span-2">
                    <p className="text-sm text-slate-500">Bio</p>
                    <p className="mt-2 text-base leading-7 text-slate-700">{values.ai_profile.bio || values.ai_profile.raw_bio}</p>
                  </div>
                  {values.profile_photo_url && (
                    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:col-span-2">
                      <p className="text-sm text-slate-500">Profile Photo</p>
                      <img src={getImageUrl(values.profile_photo_url)} alt="Preview" className="mt-2 h-32 w-32 rounded-2xl object-cover" />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={handleBack} disabled={currentStep === 1} className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                Back
              </button>
              {currentStep < 6 ? (
                <button type="submit" className="rounded-full bg-soul-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Continue
                </button>
              ) : (
                <button type="button" onClick={handleFinish} disabled={loading} className="rounded-full bg-soul-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? 'Saving...' : 'Complete Onboarding'}
                </button>
              )}
            </div>
          </form>
        </section>

        <aside className="rounded-[2rem] bg-slate-50 p-8 shadow-card ring-1 ring-slate-200">
          <div className="space-y-4">
            <div className="rounded-[1.75rem] bg-gradient-to-br from-soul-dark via-indigo-800 to-slate-900 p-6 text-white shadow-lg">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-200">The AI Difference</p>
              <p className="mt-4 text-xl font-semibold">Deep semantic analysis to match you based on values, not just interests.</p>
            </div>
            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">Writing Tip</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">Focus on the 'why' behind your life choices. Instead of 'I like traveling,' try 'I find growth in exploring new cultures and perspectives.'</p>
            </div>
            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">Astrology insight</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">Your birth details help our AI understand the temperament and harmony you seek in a partner.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
