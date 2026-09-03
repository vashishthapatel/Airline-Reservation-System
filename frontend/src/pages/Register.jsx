import { useEffect, useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCurrentUser, getGoogleAuthConfig, register as registerApi } from '../api/axios'
import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react'
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

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

    if (googleStatus === 'error') {
      toast.error(googleReason === 'unsupported-user'
        ? 'This Google account is not allowed for this OAuth app. Add it as a test user in Google Cloud Console or publish the app for external users.'
        : googleReason === 'oauth-disabled'
          ? 'Google sign-up is not enabled for this app.'
          : 'Google sign-up failed or was cancelled.')
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
      toast.error('Google sign-up could not be completed.')
      setSearchParams({})
      return
    }

    async function completeGoogleSignUp() {
      setSubmitting(true)
      localStorage.setItem('airline_token', token)
      try {
        const res = await getCurrentUser()
        if (res.data?.success) {
          login({ ...res.data.data, token })
          toast.success('Signed up with Google!')
          navigate('/', { replace: true })
        }
      } catch (err) {
        localStorage.removeItem('airline_token')
        const errorMsg = err.response?.data?.message || err.message || 'Unknown error'
        toast.error(`Google sign-up could not be completed. Error: ${errorMsg}`)
      } finally {
        setSubmitting(false)
        setSearchParams({})
      }
    }

    completeGoogleSignUp()
  }, [login, navigate, searchParams, setSearchParams])

  const signInWithGoogle = () => {
    let backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    if (backendUrl === '/api') backendUrl = window.location.origin
    backendUrl = backendUrl.replace(/\/api\/?$/, '')
    window.location.assign(`${backendUrl}/api/auth/google/start?mode=signup`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()
    const trimmedPhone = phone.trim()

    if (!trimmedName || !normalizedEmail || !trimmedPhone || !password || !confirmPassword) {
      toast.error('All fields are required!')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long!')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }

    setSubmitting(true)
    try {
      const res = await registerApi({
        name: trimmedName,
        email: normalizedEmail,
        phone: trimmedPhone,
        password
      })

      if (res.data && res.data.success) {
        toast.success('Registration successful!')
        login(res.data.data) // Auto logins user and saves context & localStorage
        navigate('/')
      } else {
        toast.error(res.data.message || 'Registration failed')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Email already registered or registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }} className="animate-fadeInUp">
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Join SkyWay to search flights, reserve seats, and earn travel rewards</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name-input"><User size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Full Name</label>
            <input
              id="name-input"
              type="text"
              className="input-field"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email-input"><Mail size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Email Address</label>
            <input
              id="email-input"
              type="email"
              className="input-field"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone-input"><Phone size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Phone Number</label>
            <input
              id="phone-input"
              type="tel"
              className="input-field"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={submitting}
              autoComplete="tel"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input"><Lock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Password</label>
            <input
              id="password-input"
              type="password"
              className="input-field"
              placeholder="•••••••• (Min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password-input"><Lock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Confirm Password</label>
            <input
              id="confirm-password-input"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={submitting}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            disabled={submitting}
          >
            <UserPlus size={16} /> {submitting ? 'Registering...' : 'Create Account'}
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
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
