import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getMyBookings } from '../api/axios'
import { User, Mail, Phone, Shield, ClipboardList, CreditCard } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ totalBookings: 0, totalSpent: 0 })

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await getMyBookings()
        if (res.data && res.data.success) {
          const bookings = res.data.data
          const totalSpent = bookings
            .filter(b => b.status === 'CONFIRMED')
            .reduce((sum, b) => sum + Number(b.totalAmount), 0)
          setStats({
            totalBookings: bookings.length,
            totalSpent
          })
        }
      } catch (err) {
        console.error('Error loading stats:', err)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="page-container section-padding animate-fadeInUp">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your personal information and check account statistics</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Profile Details Card */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem', boxShadow: 'var(--shadow-glow)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user?.name}</h2>
            <span className="badge badge-purple" style={{ marginTop: '0.5rem' }}>{user?.role} Account</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <Mail size={18} style={{ color: 'var(--primary-light)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</div>
                <strong style={{ fontSize: '0.95rem' }}>{user?.email}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <Phone size={18} style={{ color: 'var(--primary-light)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone Number</div>
                <strong style={{ fontSize: '0.95rem' }}>{user?.phone || 'Not Provided'}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <Shield size={18} style={{ color: 'var(--primary-light)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Security</div>
                <strong style={{ fontSize: '0.95rem' }}>BCrypt Encrypted</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: 'rgba(14, 58, 93, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
              <ClipboardList size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Bookings</div>
              <strong style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalBookings}</strong>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
              <CreditCard size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Spent</div>
              <strong style={{ fontSize: '1.75rem', fontWeight: 800 }} className="gradient-text">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(stats.totalSpent)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
