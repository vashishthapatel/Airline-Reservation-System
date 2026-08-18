import { Link } from 'react-router-dom'
import { Plane, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="site-footer" style={{
      background: 'var(--dark-surface)',
      borderTop: '1px solid var(--glass-border)',
      padding: '3rem 0 1.5rem',
      marginTop: 'auto',
      position: 'relative'
    }}>
      {/* Gradient accent line at top */}
      <div className="footer-accent" style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '2px',
        background: 'var(--primary-dark)'
      }} />

      <div className="page-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Plane size={20} color="#E4B775" />
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }} className="gradient-text">SkyWay Airlines</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
              Your trusted partner for seamless air travel. Book flights to 200+ destinations worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { to: '/', label: 'Search Flights' },
                { to: '/login', label: 'Login' },
                { to: '/register', label: 'Register' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} style={{ color: 'var(--text-muted)', fontSize: '0.875rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--primary-light)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                  >{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: <Mail size={14} />, text: 'support@skyway.com' },
                { icon: <Phone size={14} />, text: '+91 1800-SKY-WAY' },
                { icon: <MapPin size={14} />, text: 'New Delhi, India' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--primary-light)' }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          © 2024 SkyWay Airlines. All rights reserved. Built with Spring Boot & React.
        </div>
      </div>
    </footer>
  )
}
