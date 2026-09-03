import { useEffect, useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCurrentUser, getGoogleAuthConfig, login as loginApi } from '../api/axios'
import { Mail, Lock, LogIn } from 'lucide-react'
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
      setSearchParams({})
      return
    }

    if (googleStatus === 'error') {
      toast.error(googleReason === 'unsupported-user'
        ? 'This Google account is not allowed for this OAuth app. Add it as a test user in Google Cloud Console or publish the app for external users.'
        : googleReason === 'oauth-disabled'
          ? 'Google sign-in is not enabled for this app.'
        : 'Google sign-in failed or was cancelled.')
      setSearchParams({})
      return
    }

    if (googleStatus === 'missing-email') {
      toast.error('Google account did not provide an email address.')
      setSearchParams({})
      return
    }

    if (googleStatus === 'unverified-email') {
      toast.error('Your Google email address is not verified.')
      setSearchParams({})
      return
    }

    if (googleStatus !== 'success' || !token) {
      toast.error('Google sign-in could not be completed.')
      setSearchParams({})
      return
    }

    async function completeGoogleSignIn() {
      setSubmitting(true)
      localStorage.setItem('airline_token', token)
      try {
        const res = await getCurrentUser()
        if (res.data?.success) {
          login({ ...res.data.data, token })
          toast.success('Signed in with Google!')
          if (res.data.data.role === 'ADMIN') {
            navigate('/admin', { replace: true })
          } else {
            navigate('/', { replace: true })
          }
        }
      } catch (err) {
        localStorage.removeItem('airline_token')
        const errorMsg = err.response?.data?.message || err.message || 'Unknown error'
        toast.error(`Google sign-in could not be completed. Error: ${errorMsg}`)
      } finally {
        setSubmitting(false)
        setSearchParams({})
      }
    }

    completeGoogleSignIn()
  }, [login, navigate, searchParams, setSearchParams])

  const signIn = async (loginEmail, loginPassword) => {
    const normalizedEmail = loginEmail.trim().toLowerCase()
    if (!normalizedEmail || !loginPassword) {
      toast.error('Please enter email and password!')
      return
    }

    setSubmitting(true)
    try {
      const res = await loginApi({ email: normalizedEmail, password: loginPassword })
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Login successful!')
        login(res.data.data) // Stores JWT token and user in context & localStorage
        
        // Redirect based on role
        if (res.data.data.role === 'ADMIN') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
        toast.error(res.data.message || 'Login failed')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    signIn(email, password)
  }

  const signInWithDemo = () => {
    const demoEmail = 'admin@airline.com'
    const demoPassword = 'admin123'
    setEmail(demoEmail)
    setPassword(demoPassword)
    signIn(demoEmail, demoPassword)
  }

  const signInWithGoogle = () => {
    let backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    if (backendUrl === '/api') backendUrl = window.location.origin
    backendUrl = backendUrl.replace(/\/api\/?$/, '')
    window.location.assign(`${backendUrl}/api/auth/google/start?mode=login`)
  }

  return (
    <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }} className="animate-fadeInUp">
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to search flights, book seats, and manage tickets</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <button type="button" className="btn-ghost btn-sm" onClick={signInWithDemo} disabled={submitting}>
            Admin Demo
          </button>

          <div className="form-group">
            <label className="form-label" htmlFor="email-input"><Mail size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Email Address</label>
            <input
              id="email-input"
              type="email"
              className="input-field"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input"><Lock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Password</label>
            <input
              id="password-input"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            disabled={submitting}
          >
            <LogIn size={16} /> {submitting ? 'Signing In...' : 'Sign In'}
          </button>

          {googleEnabled && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
              </div>
              <button
                type="button"
                onClick={signInWithGoogle}
                disabled={submitting}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #dadce0',
                  background: '#fff',
                  color: '#3c4043',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.6 : 1,
                  transition: 'background 0.15s, box-shadow 0.15s',
                }}
              >
                <GoogleIcon size={19} />
                Continue with Google
              </button>
            </>
          )}
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}
