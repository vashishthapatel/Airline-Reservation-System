import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Plane, Menu, X, LayoutDashboard, Search, Clock, User, LogOut } from 'lucide-react'

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path ? 'active' : ''

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={closeMenu} style={{ gap: '0.7rem' }}>
          <span style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'rgba(201,168,106,0.12)', border: '0.5px solid rgba(201,168,106,0.18)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Plane size={16} style={{ color: '#A68A56' }} />
          </span>
          <span style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em', color: '#1A1E26' }}>
            SkyWay <em style={{ fontStyle: 'italic', color: '#A68A56', fontWeight: 400 }}>Airlines</em>
          </span>
        </Link>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {!isAuthenticated && (
            <>
              <li><Link to="/" className={isActive('/')} onClick={closeMenu}>Home</Link></li>
              <li><Link to="/login" className={isActive('/login')} onClick={closeMenu}>Login</Link></li>
              <li><Link to="/register" className="btn-primary btn-sm" onClick={closeMenu}>Sign Up</Link></li>
            </>
          )}

          {isAuthenticated && !isAdmin && (
            <>
              <li><Link to="/" className={isActive('/')} onClick={closeMenu}><Search size={15} /> Search</Link></li>
              <li><Link to="/history" className={isActive('/history')} onClick={closeMenu}><Clock size={15} /> My Bookings</Link></li>
              <li><Link to="/profile" className={isActive('/profile')} onClick={closeMenu}><User size={15} /> {user?.name?.split(' ')[0]}</Link></li>
              <li><button onClick={handleLogout}><LogOut size={15} /> Logout</button></li>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <li><Link to="/admin" className={isActive('/admin')} onClick={closeMenu}><LayoutDashboard size={15} /> Dashboard</Link></li>
              <li><Link to="/admin/flights" className={isActive('/admin/flights')} onClick={closeMenu}><Plane size={15} /> Flights</Link></li>
              <li><Link to="/admin/users" className={isActive('/admin/users')} onClick={closeMenu}><User size={15} /> Users</Link></li>
              <li><Link to="/admin/bookings" className={isActive('/admin/bookings')} onClick={closeMenu}><Clock size={15} /> Bookings</Link></li>
              <li><button onClick={handleLogout}><LogOut size={15} /> Logout</button></li>
            </>
          )}
        </ul>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={20} color="#1A1E26" /> : <><span /><span /><span /></>}
        </button>
      </div>
    </nav>
  )
}
