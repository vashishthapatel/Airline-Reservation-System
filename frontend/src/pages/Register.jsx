import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getGoogleAuthConfig, register as registerApi } from '../api/axios'
import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
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

  const signInWithGoogle = () => {
    let backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    if (backendUrl === '/api') backendUrl = 'http://localhost:8080'
    backendUrl = backendUrl.replace(/\/api\/?$/, '')
    window.location.assign(`${backendUrl}/oauth2/authorization/google`)
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
            <button
              type="button"
              className="btn-ghost"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={signInWithGoogle}
              disabled={submitting}
            >
              Sign up with Google
            </button>
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
