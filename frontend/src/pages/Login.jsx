import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as loginApi } from '../api/axios'
import { Mail, Lock, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

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

  const signInWithDemo = (role) => {
    const demo = role === 'admin'
      ? { email: 'admin@airline.com', password: 'admin123' }
      : { email: 'john@example.com', password: 'customer123' }

    setEmail(demo.email)
    setPassword(demo.password)
    signIn(demo.email, demo.password)
  }

  return (
    <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }} className="animate-fadeInUp">
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to search flights, book seats, and manage tickets</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button type="button" className="btn-ghost btn-sm" onClick={() => signInWithDemo('customer')} disabled={submitting}>
              Customer Demo
            </button>
            <button type="button" className="btn-ghost btn-sm" onClick={() => signInWithDemo('admin')} disabled={submitting}>
              Admin Demo
            </button>
          </div>

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
