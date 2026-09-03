import { useEffect, useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCurrentUser, getGoogleAuthConfig, login as loginApi } from '../api/axios'
import { Mail, Lock, LogIn, Plane, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [googleEnabled, setGoogleEnabled] = useState(false)

  useEffect(() => {
    getGoogleAuthConfig()
      .then(res => setGoogleEnabled(res.data?.data === true))
      .catch(() => setGoogleEnabled(false))
  }, [])

  useEffect(() => {
    const googleStatus = searchParams.get('google')
    const googleReason = searchParams.get('reason')
    const token = searchParams.get('token')
    if (!googleStatus) return
    if (googleStatus === 'unregistered') {
      toast.error('No account exists for this Google email. Please use Sign up with Google first.')
      setSearchParams({}); return
    }
    if (googleStatus === 'error') {
      toast.error(googleReason === 'unsupported-user'
        ? 'This Google account is not allowed for this OAuth app. Add it as a test user in Google Cloud Console or publish the app for external users.'
        : googleReason === 'oauth-disabled' ? 'Google sign-in is not enabled for this app.' : 'Google sign-in failed or was cancelled.')
      setSearchParams({}); return
    }
    if (googleStatus === 'missing-email') { toast.error('Google account did not provide an email address.'); setSearchParams({}); return }
    if (googleStatus === 'unverified-email') { toast.error('Your Google email address is not verified.'); setSearchParams({}); return }
    if (googleStatus !== 'success' || !token) { toast.error('Google sign-in could not be completed.'); setSearchParams({}); return }
    async function completeGoogleSignIn() {
      setSubmitting(true)
      localStorage.setItem('airline_token', token)
      try {
        const res = await getCurrentUser()
        if (res.data?.success) {
          login({ ...res.data.data, token })
          toast.success('Signed in with Google!')
          navigate(res.data.data.role === 'ADMIN' ? '/admin' : '/', { replace: true })
        }
      } catch (err) {
        localStorage.removeItem('airline_token')
        toast.error(`Google sign-in could not be completed. Error: ${err.response?.data?.message || err.message || 'Unknown error'}`)
      } finally { setSubmitting(false); setSearchParams({}) }
    }
    completeGoogleSignIn()
  }, [login, navigate, searchParams, setSearchParams])

  const signIn = async (loginEmail, loginPassword) => {
    const normalizedEmail = loginEmail.trim().toLowerCase()
    if (!normalizedEmail || !loginPassword) { toast.error('Please enter email and password!'); return }
    setSubmitting(true)
    try {
      const res = await loginApi({ email: normalizedEmail, password: loginPassword })
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Login successful!')
        login(res.data.data)
        navigate(res.data.data.role === 'ADMIN' ? '/admin' : '/')
      } else toast.error(res.data.message || 'Login failed')
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid email or password') }
    finally { setSubmitting(false) }
  }

  const handleSubmit = (e) => { e.preventDefault(); signIn(email, password) }
  const signInWithDemo = () => { const demoEmail='admin@airline.com'; const demoPassword='admin123'; setEmail(demoEmail); setPassword(demoPassword); signIn(demoEmail,demoPassword) }
  const signInWithGoogle = () => {
    let backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    if (backendUrl === '/api') backendUrl = window.location.origin
    backendUrl = backendUrl.replace(/\/api\/?$/, '')
    window.location.assign(`${backendUrl}/api/auth/google/start?mode=login`)
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 73px)', alignItems: 'center', justifyContent: 'center', padding: '2.4rem 1rem', background: 'var(--paper)' }} className="animate-fadeInUp">
      <div className="glass-card" style={{ width: '100%', maxWidth: 440, padding: '2rem 1.7rem 1.6rem', borderRadius: 20 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, margin: '0 auto 0.9rem',
            background: 'rgba(201,168,106,0.11)', border: '0.5px solid rgba(201,168,106,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A68A56'
          }}>
            <Plane size={20} />
          </div>
          <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '0.4rem' }}>Welcome back</div>
          <h2 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontWeight: 400, fontSize: '1.9rem', letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1 }}>
            Sign in to <em className="serif-italic" style={{ color: '#A68A56' }}>SkyWay</em>
          </h2>
          <p style={{ color: 'var(--slate)', fontSize: '0.88rem', marginTop: '0.5rem', lineHeight: 1.6 }}>Search flights, book seats, and manage tickets — quiet luxury, on every mile.</p>
          <div style={{ height: 1, width: 56, background: '#C9A86A', opacity: 0.9, margin: '0.9rem auto 0', borderRadius: 99 }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button type="button" onClick={signInWithDemo} disabled={submitting} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
            padding: '0.62rem 1rem', borderRadius: 999, border: '0.5px solid #E8E0D0', background: '#FFFBF5',
            color: '#1A1E26', fontWeight: 650, fontSize: '0.86rem', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1
          }}>
            <ShieldCheck size={14} style={{ color: '#A68A56' }} /> Try Admin Demo — one tap
          </button>

          <div className="form-group">
            <label className="form-label" htmlFor="email-input"><Mail size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Email Address</label>
            <input id="email-input" type="email" className="input-field" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={submitting} autoComplete="email" required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input"><Lock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Password</label>
            <input id="password-input" type="password" className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={submitting} autoComplete="current-password" required />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }} disabled={submitting}>
            <LogIn size={15} /> {submitting ? 'Signing In…' : 'Sign In'}
          </button>

          {googleEnabled && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.15rem 0' }}>
                <div style={{ flex: 1, height: 1, background: '#E8E0D0' }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9AA0AE' }}>or</span>
                <div style={{ flex: 1, height: 1, background: '#E8E0D0' }} />
              </div>
              <button
                type="button" onClick={signInWithGoogle} disabled={submitting}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                  padding: '0.78rem 1rem', borderRadius: 999, border: '0.5px solid #E8E0D0',
                  background: '#FFFFFF', color: '#1A1E26', fontWeight: 600, fontSize: '0.9rem',
                  cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1,
                  boxShadow: '0 1px 1px rgba(26,30,38,0.04)'
                }}
              >
                <GoogleIcon size={18} /> Continue with Google
              </button>
            </>
          )}
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.86rem', color: 'var(--slate)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#A68A56', fontWeight: 750, textDecoration: 'underline', textUnderlineOffset: 3, textDecorationColor: 'rgba(201,168,106,0.35)' }}>
            Create account
          </Link>
        </div>
      </div>
    </div>
  )
}
