import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import Logo from '../components/common/Logo'
import LoginThreeScene from '../components/three/LoginThreeScene'
import { useAppContext } from '../contexts/AppContext'
import { register as registerRequest, REGISTER_ROLE_IDS } from '../services/authService'

const MotionSection = motion.section

const ROLE_KEYS = Object.keys(REGISTER_ROLE_IDS)

function RegisterPage() {
  const router = useRouter()
  const { t, theme, toggleTheme, language, setLanguage } = useAppContext()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [roleKey, setRoleKey] = useState('CUSTOMER')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')

    const u = username.trim()
    const e = email.trim()
    if (!u || !e || !password || !confirmPassword) {
      setError(t('pages.register.fieldsRequired'))
      return
    }
    if (password.length < 6) {
      setError(t('pages.register.passwordTooShort'))
      return
    }
    if (password !== confirmPassword) {
      setError(t('pages.register.passwordMismatch'))
      return
    }

    setLoading(true)
    try {
      const roleId = REGISTER_ROLE_IDS[roleKey]
      const body = {
        username: u,
        email: e,
        password,
        roleIds: [roleId],
      }
      if (roleKey === 'CUSTOMER') {
        const fn = fullName.trim()
        const ph = phone.trim()
        const ad = address.trim()
        if (fn) body.fullName = fn
        if (ph) body.phone = ph
        if (ad) body.address = ad
      }
      const { parsed, parseFailed } = await registerRequest(body)

      if (parseFailed || !parsed) {
        setError(t('pages.register.genericError'))
        return
      }

      if (parsed.success && parsed.data) {
        router.navigate({ to: '/login' })
        return
      }

      setError(typeof parsed.message === 'string' ? parsed.message : t('pages.register.genericError'))
    } catch {
      setError(t('pages.register.networkError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-neon-bg min-h-screen overflow-hidden px-4 py-6 sm:px-6">
      <LoginThreeScene />
      <div className="login-scene-vignette" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
          <MotionSection
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="neon-card relative w-full max-w-md p-6 sm:p-8"
          >
            <span className="neon-card-glow" aria-hidden="true" />

            <div className="relative z-10">
              <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <label className="login-lang-wrap">
                  <span>{t('common.theme')}</span>
                  <button type="button" onClick={toggleTheme} className="login-inline-btn">
                    {theme === 'dark' ? (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                        <path
                          d="M18.5 12.7A7 7 0 1 1 11.3 5.5a6 6 0 1 0 7.2 7.2Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                        <path
                          d="M12 2.5V5M12 19v2.5M21.5 12H19M5 12H2.5M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8M18.7 18.7l-1.8-1.8M7.1 7.1 5.3 5.3"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                    <span>{theme === 'dark' ? t('common.darkMode') : t('common.lightMode')}</span>
                  </button>
                </label>

                <label className="login-lang-wrap">
                  <span>{t('common.language')}</span>
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    className="login-inline-select"
                  >
                    <option value="en">English</option>
                    <option value="kh">ខ្មែរ</option>
                  </select>
                </label>
              </div>

              <div className="mb-5 flex justify-center">
                <div className="login-logo-shell inline-flex rounded-xl p-2.5">
                  <Logo className="h-14 w-14" />
                </div>
              </div>

              <h1 className="login-title text-center">{t('pages.register.title')}</h1>
              <p className="login-subtitle mt-2 text-center">{t('pages.register.subtitle')}</p>

              <form onSubmit={submit} className="mt-6 space-y-3">
                {error ? (
                  <div className="neon-login-alert flex items-center gap-2" role="alert">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" aria-hidden="true">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                      <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                    <span>{error}</span>
                  </div>
                ) : null}

                <label className="block">
                  <span className="sr-only">{t('pages.register.username')}</span>
                  <div className="neon-input-wrap">
                    <input
                      type="text"
                      name="username"
                      autoComplete="username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      className="neon-input"
                      placeholder={t('pages.register.username')}
                    />
                    <svg viewBox="0 0 24 24" className="neon-input-icon" fill="none" aria-hidden="true">
                      <path
                        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </label>

                <label className="block">
                  <span className="sr-only">{t('pages.register.email')}</span>
                  <div className="neon-input-wrap">
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="neon-input"
                      placeholder={t('pages.register.email')}
                    />
                    <svg viewBox="0 0 24 24" className="neon-input-icon" fill="none" aria-hidden="true">
                      <path
                        d="M4 6h16v12H4V6Zm2 2 6 4 6-4"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </label>

                <label className="block">
                  <span className="sr-only">{t('pages.register.password')}</span>
                  <div className="neon-input-wrap">
                    <input
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="neon-input"
                      placeholder={t('pages.register.password')}
                    />
                    <svg viewBox="0 0 24 24" className="neon-input-icon" fill="none" aria-hidden="true">
                      <rect
                        x="6"
                        y="11"
                        width="12"
                        height="9"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.9"
                      />
                      <path
                        d="M9 11V8a3 3 0 1 1 6 0v3"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </label>

                <label className="block">
                  <span className="sr-only">{t('common.role')}</span>
                  <div className="neon-input-wrap">
                    <select
                      value={roleKey}
                      onChange={(event) => setRoleKey(event.target.value)}
                      className="neon-input appearance-none"
                    >
                      {ROLE_KEYS.map((key) => (
                        <option key={key} value={key}>
                          {t(`roles.${key}`)}
                        </option>
                      ))}
                    </select>
                    <svg viewBox="0 0 24 24" className="neon-input-icon" fill="none" aria-hidden="true">
                      <path
                        d="m7 10 5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </label>

                {roleKey === 'CUSTOMER' && (
                  <div className="space-y-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200/90">
                      {t('pages.register.profileSection')}
                    </p>
                    <label className="block">
                      <span className="sr-only">{t('pages.register.fullName')}</span>
                      <div className="neon-input-wrap">
                        <input
                          type="text"
                          name="fullName"
                          autoComplete="name"
                          value={fullName}
                          onChange={(event) => setFullName(event.target.value)}
                          className="neon-input"
                          placeholder={t('pages.register.fullName')}
                        />
                        <svg viewBox="0 0 24 24" className="neon-input-icon" fill="none" aria-hidden="true">
                          <path
                            d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0"
                            stroke="currentColor"
                            strokeWidth="1.9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="mt-1 block text-[11px] text-slate-400">{t('pages.register.fullNameHint')}</span>
                    </label>
                    <label className="block">
                      <span className="sr-only">{t('pages.register.phone')}</span>
                      <div className="neon-input-wrap">
                        <input
                          type="tel"
                          name="phone"
                          autoComplete="tel"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          className="neon-input"
                          placeholder={t('pages.register.phone')}
                        />
                        <svg viewBox="0 0 24 24" className="neon-input-icon" fill="none" aria-hidden="true">
                          <path
                            d="M6.5 4h4l2 5-2.2 1.3a12 12 0 0 0 5.4 5.4L17.5 13l5 2v4a2 2 0 0 1-2.2 2c-9.4 0-17-7.6-17-17a2 2 0 0 1 2-2.2Z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </label>
                    <label className="block">
                      <span className="sr-only">{t('pages.register.address')}</span>
                      <div className="neon-input-wrap">
                        <textarea
                          name="address"
                          autoComplete="street-address"
                          value={address}
                          onChange={(event) => setAddress(event.target.value)}
                          className="neon-input min-h-[4.5rem] resize-y py-2.5"
                          rows={2}
                          placeholder={t('pages.register.address')}
                        />
                      </div>
                    </label>
                  </div>
                )}

                <label className="block">
                  <span className="sr-only">{t('pages.register.confirmPassword')}</span>
                  <div className="neon-input-wrap">
                    <input
                      type="password"
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="neon-input"
                      placeholder={t('pages.register.confirmPassword')}
                    />
                    <svg viewBox="0 0 24 24" className="neon-input-icon" fill="none" aria-hidden="true">
                      <rect
                        x="6"
                        y="11"
                        width="12"
                        height="9"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.9"
                      />
                      <path
                        d="M9 11V8a3 3 0 1 1 6 0v3"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </label>

                <button type="submit" className="neon-login-btn text-base flex items-center justify-center gap-2" disabled={loading}>
                  {loading && (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  )}
                  {loading ? t('pages.register.submitting') : t('pages.register.submit')}
                </button>
              </form>

              <p className="login-register-text mt-4 text-center text-sm">
                {t('pages.register.hasAccount')}{' '}
                <button
                  type="button"
                  className="neon-helper-link font-semibold"
                  onClick={() => router.navigate({ to: '/login' })}
                >
                  {t('pages.register.signIn')}
                </button>
              </p>
            </div>
          </MotionSection>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
