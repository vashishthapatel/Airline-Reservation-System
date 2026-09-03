import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Plane, Calendar, Users, ArrowRight, ShieldCheck, Zap, Globe, MapPin, Clock, Loader2 } from 'lucide-react'
import { getAirports } from '../api/axios'
import toast from 'react-hot-toast'

export default function Landing() {
  const navigate = useNavigate()
  const [tripType, setTripType] = useState('one-way')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [depDate, setDepDate] = useState('')
  const [retDate, setRetDate] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [airports, setAirports] = useState([])
  const [backendUp, setBackendUp] = useState(null) // null=checking, true=up, false=waking
  const [wakeAttempts, setWakeAttempts] = useState(0)

  // ── Backend wake check — polls /api/health until ok, shows banner while waking ──
  useEffect(() => {
    let cancelled = false
    let retryTimeout
    let delayedShowTimeout

    const configuredApiUrl = import.meta.env.VITE_API_URL || '/api'
    const apiBaseUrl = configuredApiUrl === '/api' || configuredApiUrl.endsWith('/api')
      ? configuredApiUrl
      : `${configuredApiUrl.replace(/\/$/, '')}/api`
    const healthUrl = `${apiBaseUrl.replace(/\/$/, '')}/health`

    const fetchAirportsNow = async () => {
      try {
        const res = await getAirports()
        if (!cancelled && res.data && res.data.success) setAirports(res.data.data)
      } catch {}
    }

    const ping = async () => {
      try {
        const controller = new AbortController()
        const abortId = setTimeout(() => controller.abort(), 8000)
        const res = await fetch(healthUrl, { signal: controller.signal, cache: 'no-store', headers: { Accept: 'application/json' } })
        clearTimeout(abortId)
        if (!cancelled && res.ok) {
          clearTimeout(delayedShowTimeout)
          setBackendUp(true)
          fetchAirportsNow()
          return
        }
        throw new Error('health not ok')
      } catch {
        if (cancelled) return
        clearTimeout(delayedShowTimeout)
        setBackendUp(false)
        setWakeAttempts(a => a + 1)
        retryTimeout = setTimeout(ping, 5000)
      }
    }

    // If backend hasn't responded in 1.8s, assume it's sleeping and show banner
    delayedShowTimeout = setTimeout(() => {
      if (!cancelled) setBackendUp(prev => (prev === null ? false : prev))
    }, 1800)

    ping()

    return () => {
      cancelled = true
      clearTimeout(retryTimeout)
      clearTimeout(delayedShowTimeout)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (backendUp === false) {
      toast.error('Backend is still waking up — please wait a moment and try again.')
      return
    }
    if (!origin || !destination || !depDate) {
      toast.error('Please fill in Origin, Destination, and Departure Date!')
      return
    }
    if (origin === destination) {
      toast.error('Origin and Destination cannot be the same!')
      return
    }
    const queryParams = new URLSearchParams({
      originCode: origin,
      destinationCode: destination,
      departureDate: depDate,
      passengers: passengers.toString(),
      tripType
    })
    navigate(`/flights/search?${queryParams.toString()}`)
  }

  const popularRoutes = [
    { from: 'DEL', fromCity: 'New Delhi', to: 'BOM', toCity: 'Mumbai', price: '₹4,500' },
    { from: 'BOM', fromCity: 'Mumbai', to: 'DEL', toCity: 'New Delhi', price: '₹4,800' },
    { from: 'DEL', fromCity: 'New Delhi', to: 'BLR', toCity: 'Bangalore', price: '₹5,200' },
    { from: 'BOM', fromCity: 'Mumbai', to: 'DXB', toCity: 'Dubai', price: '₹14,500' },
    { from: 'DEL', fromCity: 'New Delhi', to: 'DXB', toCity: 'Dubai', price: '₹15,000' },
    { from: 'DEL', fromCity: 'New Delhi', to: 'JFK', toCity: 'New York', price: '₹55,000' }
  ]

  const stats = [
    { icon: Plane, label: 'Active Flights', value: '126+' },
    { icon: Globe, label: 'Destinations', value: '12+' },
    { icon: Users, label: 'Happy Travelers', value: '50K+' },
    { icon: ShieldCheck, label: 'Safe Booking', value: '100%' }
  ]

  const selectPopularRoute = (route) => {
    setOrigin(route.from)
    setDestination(route.to)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setDepDate(tomorrow.toISOString().split('T')[0])
    window.scrollTo({ top: 600, behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.12 } }
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* ── HERO — MAISON ── */}
      <header className="hero-section">
        {/* 4K hero — paper-pressed watermark (8% opacity, veil fade). Swap URL to swap vibe. */}
        <div className="hero-photo" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=3840&q=80&auto=format&fit=crop"
            srcSet="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80&auto=format&fit=crop 1920w, https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=2560&q=80&auto=format&fit=crop 2560w, https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=3840&q=80&auto=format&fit=crop 3840w"
            sizes="100vw"
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="hero-photo-veil" aria-hidden="true" />
        </div>
        <div className="hero-bg-orbs" aria-hidden="true" />

        <div className="hero-content">
          {/* Backend waking banner — shows until /api/health is ok, then disappears */}
          <AnimatePresence>
            {backendUp === false && (
              <motion.div
                key="backend-wake-banner"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                role="status"
                aria-live="polite"
                style={{ marginBottom: '1.1rem' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.9rem',
                    background: '#FFFFFF',
                    border: '0.5px solid #E8E0D0',
                    borderLeft: '3px solid #C9A86A',
                    borderRadius: 14,
                    padding: '0.85rem 1rem',
                    boxShadow: '0 1px 2px rgba(26,30,38,0.05), 0 10px 28px rgba(26,30,38,0.06)',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: 'rgba(201,168,106,0.12)',
                      border: '0.5px solid rgba(201,168,106,0.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Loader2 size={16} style={{ color: '#A68A56', animation: 'spin 0.85s linear infinite' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 750, fontSize: '0.88rem', color: '#1A1E26', letterSpacing: '-0.015em', lineHeight: 1.3 }}>
                      Backend is starting — please wait 1–2 minutes
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.55, marginTop: 2 }}>
                      The server sleeps after inactivity on the free tier and is waking up now. Search will be ready shortly — no need to refresh.
                    </div>
                    <div
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.62rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#9AA0AE',
                        marginTop: 5,
                      }}
                    >
                      Checking again in 5s{wakeAttempts > 0 ? ` · Attempt ${wakeAttempts}` : ''}
                    </div>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#A68A56',
                      background: 'rgba(201,168,106,0.10)',
                      border: '0.5px solid rgba(201,168,106,0.18)',
                      padding: '5px 9px',
                      borderRadius: 999,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 99,
                        background: '#C9A86A',
                        display: 'inline-block',
                        boxShadow: '0 0 0 5px rgba(201,168,106,0.14)',
                      }}
                    />
                    Waking…
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.6rem', alignItems: 'center' }}>
            {/* Left */}
            <motion.div variants={itemVariants} className="hero-text">
              <span className="hero-badge">
                <span style={{ width: 6, height: 6, borderRadius: 99, background: '#C9A86A', display: 'inline-block' }} />
                SkyWay — Quiet Luxury Aviation
              </span>

              <h1 className="hero-title">
                Your Journey
                <br />
                <span className="accent">Begins Here</span>
              </h1>

              <p className="hero-subtitle">
                Hand-pressed paper, brushed brass, and midnight precision — search 12+ destinations with seamless seat selection and instant confirmation.
              </p>

              <div className="hero-rule" />

              <div className="hero-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#FFFFFF',
                      border: '0.5px solid #E8E0D0',
                      borderRadius: 14,
                      padding: '1rem 0.9rem',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      boxShadow: '0 1px 2px rgba(26,30,38,0.04), 0 6px 18px rgba(26,30,38,0.04)'
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: idx % 2 === 0 ? 'rgba(201,168,106,0.11)' : 'rgba(27,42,74,0.07)',
                      color: idx % 2 === 0 ? '#A68A56' : '#1B2A4A',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <stat.icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.35rem', fontWeight: 400, lineHeight: 1, color: '#1A1E26', letterSpacing: '-0.02em' }}>{stat.value}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9AA0AE', marginTop: 3, fontWeight: 600 }}>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <a href="#search-section" className="btn-primary">
                  Book Now <ArrowRight size={15} />
                </a>
                <a href="#routes" className="btn-ghost">View Routes</a>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9AA0AE', marginLeft: '0.2rem' }}>
                  No fees · Instant ticket
                </span>
              </div>
            </motion.div>

            {/* Search Card — the jewel */}
            <motion.div id="search-section" variants={itemVariants} className="search-card" style={{ opacity: backendUp === false ? 0.92 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(201,168,106,0.12)', color: '#A68A56',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '0.5px solid rgba(201,168,106,0.18)'
                }}>
                  <Plane size={20} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.35rem', lineHeight: 1, color: '#1A1E26' }}>Book Flight Tickets</div>
                  <div style={{ fontSize: '0.82rem', color: '#9AA0AE', marginTop: 2 }}>Find the best deals across 12+ destinations</div>
                </div>
                <span style={{
                  marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem',
                  letterSpacing: '0.08em', textTransform: 'uppercase', color: backendUp === false ? '#9AA0AE' : '#A68A56',
                  background: backendUp === false ? 'rgba(26,30,38,0.06)' : 'rgba(201,168,106,0.10)', border: backendUp === false ? '0.5px solid #E8E0D0' : '0.5px solid rgba(201,168,106,0.18)',
                  padding: '4px 8px', borderRadius: 999
                }}>{backendUp === false ? 'Waking…' : 'Live search'}</span>
              </div>

              <form onSubmit={handleSearch}>
                <div className="search-tabs">
                  <button type="button" className={`search-tab ${tripType === 'one-way' ? 'active' : ''}`} onClick={() => setTripType('one-way')}>One Way</button>
                  <button type="button" className={`search-tab ${tripType === 'round-trip' ? 'active' : ''}`} onClick={() => setTripType('round-trip')}>Round Trip</button>
                </div>

                <div className="search-grid">
                  <div className="search-field">
                    <label><MapPin size={12} /> From</label>
                    <select className="input-field" value={origin} onChange={(e) => setOrigin(e.target.value)} required>
                      <option value="">Select Origin</option>
                      {airports.map(ap => (
                        <option key={ap.id} value={ap.iataCode}>{ap.city} ({ap.iataCode}) — {ap.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="search-field">
                    <label><MapPin size={12} /> To</label>
                    <select className="input-field" value={destination} onChange={(e) => setDestination(e.target.value)} required>
                      <option value="">Select Destination</option>
                      {airports.map(ap => (
                        <option key={ap.id} value={ap.iataCode}>{ap.city} ({ap.iataCode}) — {ap.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="search-grid">
                  <div className="search-field">
                    <label><Calendar size={12} /> Departure</label>
                    <input type="date" className="input-field" value={depDate} onChange={(e) => setDepDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required />
                  </div>
                  <div className="search-field">
                    <label><Calendar size={12} /> Return</label>
                    <input type="date" className="input-field" value={retDate} onChange={(e) => setRetDate(e.target.value)} min={depDate || new Date().toISOString().split('T')[0]} disabled={tripType === 'one-way'} required={tripType === 'round-trip'} />
                  </div>
                </div>

                <div className="search-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="search-field">
                    <label><Users size={12} /> Passengers</label>
                    <select className="input-field" value={passengers} onChange={(e) => setPassengers(parseInt(e.target.value))}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '1.1rem', padding: '0.95rem', opacity: backendUp === false ? 0.65 : 1 }}
                  whileHover={{ scale: backendUp === false ? 1 : 1.01 }}
                  whileTap={{ scale: backendUp === false ? 1 : 0.99 }}
                  title={backendUp === false ? 'Backend is waking up — please wait' : undefined}
                >
                  {backendUp === false ? <><Loader2 size={17} style={{ animation: 'spin 0.85s linear infinite' }} /> Waking server…</> : <><Plane size={17} /> Search Flights</>}
                </motion.button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.85rem', color: '#9AA0AE', fontSize: '0.76rem' }}>
                  <ShieldCheck size={13} /> {backendUp === false ? 'Search will be ready once the server is up' : 'Secure · Instant confirmation · No hidden fees'}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ── Why SkyWay ── */}
      <section className="section-padding" style={{ background: '#FFFFFF', borderTop: '0.5px solid #E8E0D0', borderBottom: '0.5px solid #E8E0D0', position: 'relative', zIndex: 1 }}>
        <div className="page-container">
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} style={{ textAlign: 'center', marginBottom: '2.6rem' }}>
            <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '0.7rem' }}>
              <span style={{ width: 22, height: 1, background: '#C9A86A', opacity: 0.9 }} /> Why SkyWay <span style={{ width: 22, height: 1, background: '#C9A86A', opacity: 0.9 }} />
            </div>
            <h2 style={{ marginBottom: '0.6rem' }}>Quiet luxury, <em className="serif-italic" style={{ color: '#A68A56' }}>on every mile</em></h2>
            <p style={{ color: '#6B7280', maxWidth: 640, margin: '0 auto', fontSize: '0.98rem', lineHeight: 1.7 }}>
              No dark patterns. No clutter. Just paper, brass, and precision — the booking experience Business travelers expect.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.1rem' }}>
            {[
              { icon: Zap, kicker: 'Instant', title: 'Ticket in seconds', desc: 'Digital ticket the moment you pay — with live seat map updates.', tint: 'brass' },
              { icon: ShieldCheck, kicker: 'Secure', title: 'Payments you trust', desc: 'Bank-grade encryption. Your details never leave the paper.', tint: 'midnight' },
              { icon: Globe, kicker: 'Global', title: '12+ destinations', desc: 'Domestic and international — one search, every route.', tint: 'brass' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.08 }}
                style={{
                  background: '#FFFFFF', border: '0.5px solid #E8E0D0', borderRadius: 16, padding: '1.6rem 1.5rem',
                  boxShadow: '0 1px 2px rgba(26,30,38,0.04), 0 8px 24px rgba(26,30,38,0.04)', position: 'relative', overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: feature.tint === 'brass' ? 'linear-gradient(90deg, transparent, rgba(201,168,106,0.22), transparent)' : 'linear-gradient(90deg, transparent, rgba(27,42,74,0.14), transparent)' }} />
                <div style={{
                  width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
                  background: feature.tint === 'brass' ? 'rgba(201,168,106,0.10)' : 'rgba(27,42,74,0.06)',
                  color: feature.tint === 'brass' ? '#A68A56' : '#1B2A4A', border: '0.5px solid rgba(0,0,0,0.04)'
                }}>
                  <feature.icon size={18} />
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.10em', textTransform: 'uppercase', color: feature.tint === 'brass' ? '#A68A56' : '#6B7280', fontWeight: 700, marginBottom: '0.3rem' }}>{feature.kicker}</div>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.08rem', fontWeight: 750, letterSpacing: '-0.015em', color: '#1A1E26', marginBottom: '0.4rem' }}>{feature.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.65 }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section id="how-it-works" className="section-padding" style={{ position: 'relative', zIndex: 1, background: '#FFFBF5' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '0.6rem' }}>The flow</div>
            <h2 style={{ marginBottom: '0.4rem' }}>Four steps. <em className="serif-italic" style={{ color: '#A68A56' }}>No friction.</em></h2>
            <p style={{ color: '#6B7280', maxWidth: 560, margin: '0 auto', fontSize: '0.95rem' }}>From search to boarding pass — designed to feel inevitable.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="steps-progress" style={{ marginBottom: 0 }}
          >
            {['Search Flights', 'Select Seats', 'Passenger Info', 'Secure Pay'].map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                <div className="step-item active">
                  <span className="step-number">{idx + 1}</span>
                  <span className="step-label">{step}</span>
                </div>
                {idx < 3 && <div className="step-connector done" />}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Popular Routes ── */}
      <section id="routes" className="section-padding" style={{ background: '#FFFFFF', borderTop: '0.5px solid #E8E0D0', position: 'relative', zIndex: 1 }}>
        <div className="page-container">
          <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.6rem' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>Curated routes</div>
              <h2 style={{ marginBottom: '0.35rem' }}>Popular flights</h2>
              <p style={{ color: '#6B7280', fontSize: '0.92rem' }}>Tap any card — it fills your search automatically.</p>
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9AA0AE' }}>
              Prices from · per traveler
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {popularRoutes.map((route, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.06 }}
                onClick={() => selectPopularRoute(route)}
                whileHover={{ y: -3 }}
                style={{
                  background: '#FFFFFF', border: '0.5px solid #E8E0D0', borderRadius: 16, padding: '1.25rem',
                  cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  boxShadow: '0 1px 2px rgba(26,30,38,0.04), 0 8px 24px rgba(26,30,38,0.04)'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,106,0.20), transparent)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9AA0AE', marginBottom: 3 }}>From</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.02rem', fontWeight: 750, letterSpacing: '-0.015em', color: '#1A1E26' }}>{route.fromCity} <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#6B7280' }}>({route.from})</span></div>
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: 999, background: 'rgba(201,168,106,0.10)', border: '0.5px solid rgba(201,168,106,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A68A56' }}>
                    <Plane size={15} />
                  </div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9AA0AE', marginBottom: 3 }}>To</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.02rem', fontWeight: 750, letterSpacing: '-0.015em', color: '#1A1E26' }}>{route.toCity} <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#6B7280' }}>({route.to})</span></div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '0.5px solid #F5F0E8' }}>
                  <span style={{ fontSize: '0.8rem', color: '#6B7280', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={13} /> Direct</span>
                  <span style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.15rem', color: '#1A1E26' }}>{route.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="premium-section-alt" style={{ background: '#FFFBF5' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '0.6rem' }}>Travelers</div>
            <h2 style={{ marginBottom: '0.4rem' }}>What travelers <em className="serif-italic" style={{ color: '#A68A56' }}>remember</em></h2>
            <p style={{ color: '#6B7280', maxWidth: 560, margin: '0 auto', fontSize: '0.95rem' }}>Not reviews. Receipts — from people who actually boarded.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {[
              { name: 'Ananya Sharma', role: 'Business Traveler · DEL → LON', quote: 'The seat map is the best I have used — picked 4A in one tap. Lounge access coded to my ticket without a call.' },
              { name: 'Rahul Mehta', role: 'Adventure Seeker · BOM → DPS', quote: 'Last-minute to Bali. Booked at 11pm, ticket in my inbox before I closed the tab.' },
              { name: 'Priya Kapoor', role: 'Frequent Flyer · SkyWay Privilege Gold', quote: 'Upgrades that actually clear. No theatre — the miles post and the cabin changes.' }
            ].map((review, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.07 }} className="testimonial-card">
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.85rem' }}>
                  {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ color: '#C9A86A', fontSize: '0.9rem' }}>★</span>)}
                </div>
                <p style={{ color: '#2A303E', fontSize: '0.93rem', lineHeight: 1.7, marginBottom: '1.1rem', fontStyle: 'italic' }}>"{review.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', paddingTop: '0.85rem', borderTop: '0.5px solid #F5F0E8' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1A1E26', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 750, color: '#FFFBF5', fontSize: '0.82rem' }}>{review.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1E26', letterSpacing: '-0.01em' }}>{review.name}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.66rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#9AA0AE' }}>{review.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Privilege ── */}
      <section className="premium-section" style={{ background: '#FFFFFF', borderTop: '0.5px solid #E8E0D0' }}>
        <div className="page-container">
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="loyalty-card">
            <div style={{
              width: 48, height: 48, borderRadius: 14, margin: '0 auto 1rem',
              background: 'rgba(201,168,106,0.11)', color: '#A68A56', border: '0.5px solid rgba(201,168,106,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            </div>
            <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '0.55rem' }}>Membership</div>
            <h2 style={{ marginBottom: '0.6rem' }}>SkyWay <em className="serif-italic" style={{ color: '#A68A56' }}>Privilege</em></h2>
            <p style={{ color: '#6B7280', fontSize: '0.98rem', maxWidth: 680, margin: '0 auto 1.6rem', lineHeight: 1.7 }}>
              Earn miles on every rupee. Unlock upgrades, priority lanes, lounge access, and member-only fares — with no expiry theatre.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.4rem', textAlign: 'left', maxWidth: 760, margin: '0 auto' }}>
              {[
                { title: 'Miles', desc: 'Earn on every rupee. Redeem for flights — not vouchers.' },
                { title: 'Upgrades', desc: 'Complimentary cabin moves when space opens. Automatic.' },
                { title: 'Priority', desc: 'Dedicated check-in and boarding. Walk past the queue.' }
              ].map((b, i) => (
                <div key={i} style={{ background: '#FFFBF5', border: '0.5px solid #F0EAE0', borderRadius: 14, padding: '1rem 1.1rem' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.66rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A68A56', fontWeight: 700, marginBottom: '0.35rem' }}>{b.title}</div>
                  <div style={{ color: '#6B7280', fontSize: '0.88rem', lineHeight: 1.6 }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer — MAISON dark ── */}
      <footer style={{ background: '#1A1E26', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2.4rem 0', position: 'relative', zIndex: 1 }}>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <Plane size={18} style={{ color: '#C9A86A' }} />
            <span style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: '#FFFBF5', letterSpacing: '-0.02em' }}>SkyWay Airlines</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.42)', marginLeft: '0.35rem', border: '0.5px solid rgba(255,255,255,0.12)', padding: '2px 7px', borderRadius: 999 }}>Maison Edition</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.54)', fontSize: '0.86rem', marginBottom: '0.35rem' }}>Your trusted partner for domestic and international flights.</p>
          <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: '0.76rem' }}>© 2026 SkyWay Airlines. All rights reserved. · Quiet luxury aviation.</p>
        </div>
      </footer>
    </motion.div>
  )
}
