import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Plane, Menu, X, LayoutDashboard, Search, Clock, User, LogOut, Settings } from 'lucide-react'

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
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <Plane size={24} style={{ color: '#E4B775' }} />
          <span className="gradient-text">SkyWay Airlines</span>
        </Link>

        {/* Desktop Nav */}
        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {!isAuthenticated && (
            <>
              <li><Link to="/" className={isActive('/')} onClick={closeMenu}>Home</Link></li>
              <li><Link to="/login" className="btn-ghost btn-sm" onClick={closeMenu}>Login</Link></li>
              <li><Link to="/register" className="btn-primary btn-sm" onClick={closeMenu}>Sign Up</Link></li>
            </>
          )}

          {isAuthenticated && !isAdmin && (
            <>
              <li><Link to="/" className={isActive('/')} onClick={closeMenu}><Search size={16} /> Search Flights</Link></li>
              <li><Link to="/history" className={isActive('/history')} onClick={closeMenu}><Clock size={16} /> My Bookings</Link></li>
              <li><Link to="/profile" className={isActive('/profile')} onClick={closeMenu}><User size={16} /> {user?.name?.split(' ')[0]}</Link></li>
              <li><button onClick={handleLogout}><LogOut size={16} /> Logout</button></li>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <li><Link to="/admin" className={isActive('/admin')} onClick={closeMenu}><LayoutDashboard size={16} /> Dashboard</Link></li>
              <li><Link to="/admin/flights" className={isActive('/admin/flights')} onClick={closeMenu}><Plane size={16} /> Flights</Link></li>
              <li><Link to="/admin/users" className={isActive('/admin/users')} onClick={closeMenu}><User size={16} /> Users</Link></li>
              <li><Link to="/admin/bookings" className={isActive('/admin/bookings')} onClick={closeMenu}><Clock size={16} /> Bookings</Link></li>
              <li><button onClick={handleLogout}><LogOut size={16} /> Logout</button></li>
            </>
          )}
        </ul>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} color="#FFFFFF" /> : (
            <>
              <span /><span /><span />
            </>
          )}
        </button>
      </div>
    </nav>
  )
}
