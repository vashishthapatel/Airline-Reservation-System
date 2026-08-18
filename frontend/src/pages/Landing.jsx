import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Plane, Calendar, Users, ArrowRight, ShieldCheck, Zap, Globe, MapPin, TrendingUp, Clock, Star, BarChart3 } from 'lucide-react'
import { getAirports } from '../api/axios'
import toast from 'react-hot-toast'

export default function Landing() {
  const navigate = useNavigate()
  const heroVideoUrl = import.meta.env.VITE_HERO_VIDEO_URL
  const [tripType, setTripType] = useState('one-way')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [depDate, setDepDate] = useState('')
  const [retDate, setRetDate] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [airports, setAirports] = useState([])
  const [loadingAirports, setLoadingAirports] = useState(false)

  useEffect(() => {
    async function fetchAirports() {
      setLoadingAirports(true)
      try {
        const res = await getAirports()
        if (res.data && res.data.success) {
          setAirports(res.data.data)
        }
      } catch (err) {
        console.error('Error fetching airports:', err)
      } finally {
        setLoadingAirports(false)
      }
    }
    fetchAirports()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
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
    { icon: Plane, label: 'Active Flights', value: '126+', color: '#C9A96E' },
    { icon: Globe, label: 'Destinations', value: '12+', color: '#D4B87A' },
    { icon: Users, label: 'Happy Travelers', value: '50K+', color: '#22C55E' },
    { icon: ShieldCheck, label: 'Safe Booking', value: '100%', color: '#f59e0b' }
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
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <header className="hero-section cinematic-hero">
        {heroVideoUrl && (
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            poster="/airplane-bg.jpg"
            aria-hidden="true"
          >
            <source src={heroVideoUrl} type="video/mp4" />
          </video>
        )}
        <div className="hero-bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>

        <div className="hero-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            {/* Hero Left Text */}
            <motion.div variants={itemVariants} className="hero-text">
              <span className="hero-badge">
                <Plane size={14} /> Fly high with SkyWay
              </span>
              <h1 className="hero-title">
                Your Journey <br />
                <span className="gradient-text">Begins Here</span>
              </h1>
              <p className="hero-subtitle">
                Explore the world with seamless flight search, premium seat selection, secure payment processing, and instant booking confirmation.
              </p>
              
              {/* Stats Row */}
              <div className="hero-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                className="destination-card"
                    style={{ padding: '1.25rem', textAlign: 'center' }}
                  >
                    <div style={{ background: `${stat.color}15`, color: stat.color, width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                      <stat.icon size={20} />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 500 }}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="#search-section" className="btn-primary">
                  Book Now <ArrowRight size={16} />
                </a>
                <a href="#routes" className="btn-ghost">
                  View Routes
                </a>
              </motion.div>
            </motion.div>

            {/* Flight Search Card */}
            <motion.div
              id="search-section"
              variants={itemVariants}
              className="search-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(var(--primary-rgb), 0.12)', color: 'var(--primary-light)', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plane size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Book Flight Tickets</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Find the best deals across 12+ destinations</p>
                </div>
              </div>
              
              <form onSubmit={handleSearch}>
                {/* Trip Type Tabs */}
                <div className="search-tabs">
                  <button
                    type="button"
                    className={`search-tab ${tripType === 'one-way' ? 'active' : ''}`}
                    onClick={() => setTripType('one-way')}
                  >
                    One Way
                  </button>
                  <button
                    type="button"
                    className={`search-tab ${tripType === 'round-trip' ? 'active' : ''}`}
                    onClick={() => setTripType('round-trip')}
                  >
                    Round Trip
                  </button>
                </div>

                {/* Input Fields Grid */}
                <div className="search-grid">
                  <div className="search-field">
                    <label><MapPin size={14} /> From</label>
                    <select
                      className="input-field"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      required
                    >
                      <option value="">Select Origin</option>
                      {airports.map(ap => (
                        <option key={ap.id} value={ap.iataCode}>
                          {ap.city} ({ap.iataCode}) - {ap.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="search-field">
                    <label><MapPin size={14} /> To</label>
                    <select
                      className="input-field"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                    >
                      <option value="">Select Destination</option>
                      {airports.map(ap => (
                        <option key={ap.id} value={ap.iataCode}>
                          {ap.city} ({ap.iataCode}) - {ap.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="search-grid">
                  <div className="search-field">
                    <label><Calendar size={14} /> Departure Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={depDate}
                      onChange={(e) => setDepDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="search-field">
                    <label><Calendar size={14} /> Return Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={retDate}
                      onChange={(e) => setRetDate(e.target.value)}
                      min={depDate || new Date().toISOString().split('T')[0]}
                      disabled={tripType === 'one-way'}
                      required={tripType === 'round-trip'}
                    />
                  </div>
                </div>

                <div className="search-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="search-field">
                    <label><Users size={14} /> Passengers</label>
                    <select
                      className="input-field"
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem', padding: '1rem' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plane size={18} /> Search Flights
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="section-padding" style={{ background: 'var(--bg-secondary)', position: 'relative', zIndex: 1 }}>
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 className="gradient-text" style={{ marginBottom: '1rem', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>Why Choose SkyWay?</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
              We provide the best booking experience, flight schedules, and premium service to make your trip unforgettable.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { icon: Zap, title: '⚡ Instant Booking', desc: 'Get your digital ticket immediately after payment, with automatic seat updates.', color: '#C9A96E' },
              { icon: ShieldCheck, title: '🛡️ Secure Payments', desc: 'Multi-channel secure transactions. Rest assured your transaction details are fully protected.', color: '#22C55E' },
              { icon: Globe, title: '✈️ 200+ Destinations', desc: 'Fly anywhere around the world. Connect with all major international and domestic routes.', color: '#D4B87A' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="glass-card"
                style={{ padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${feature.color}, transparent)` }}></div>
                <div style={{ background: `${feature.color}15`, color: feature.color, width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <feature.icon size={28} />
                </div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="section-padding" style={{ position: 'relative', zIndex: 1 }}>
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 className="gradient-text" style={{ marginBottom: '1rem', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>How It Works</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
              Book your next flight in just 4 simple steps.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="steps-progress"
            style={{ marginBottom: '0' }}
          >
            {['Search Flights', 'Select Seats', 'Passenger Info', 'Secure Pay'].map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                <div className="step-item active">
                  <span className="step-number">{idx + 1}</span>
                  <span className="step-label">{step}</span>
                </div>
                {idx < 3 && <div className="step-connector done"></div>}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section id="routes" className="section-padding" style={{ background: 'var(--bg-secondary)', position: 'relative', zIndex: 1 }}>
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 className="gradient-text" style={{ marginBottom: '1rem', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>Popular Flight Routes</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
              Discover deals on our most frequented flights. Click any card to set your route automatically.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {popularRoutes.map((route, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="glass-card"
                style={{ 
                  padding: '1.5rem', 
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => selectPopularRoute(route)}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--gradient-primary)' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>From</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{route.fromCity} ({route.from})</h3>
                  </div>
                  <div style={{ padding: '0 1rem' }}>
                    <Plane size={20} style={{ color: 'var(--primary-light)' }} />
                  </div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>To</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{route.toCity} ({route.to})</h3>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} /> Direct Flight
                  </span>
                  <span style={{ fontWeight: 800, color: 'var(--primary-light)', fontSize: '1.1rem' }}>{route.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="premium-section-alt">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 className="gradient-text" style={{ marginBottom: '1rem', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>What Travelers Say</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
              Real stories from real adventurers who chose SkyWay.
            </p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { name: 'Ananya Sharma', role: 'Business Traveler', quote: 'SkyWay made my Delhi to London journey feel effortless. The seat selection and premium lounge access were exceptional.' },
              { name: 'Rahul Mehta', role: 'Adventure Seeker', quote: 'Booked a last-minute ticket to Bali and the process was seamless. The app is incredibly intuitive.' },
              { name: 'Priya Kapoor', role: 'Frequent Flyer', quote: 'The loyalty program rewards are genuine. I have upgraded multiple times without any hassle.' }
            ].map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="testimonial-card"
              >
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {[1,2,3,4,5].map(star => (
                    <span key={star} style={{ color: 'var(--primary)', fontSize: '1rem' }}>★</span>
                  ))}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>"{review.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#FFFFFF' }}>
                    {review.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{review.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{review.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty Program */}
      <section className="premium-section">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="loyalty-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(var(--primary-rgb), 0.12)', color: 'var(--primary-light)', width: '56px', height: '56px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <h2 className="gradient-text" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)' }}>SkyWay Privilege</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              Earn miles on every flight. Unlock complimentary upgrades, priority boarding, lounge access, and exclusive member-only fares.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              {[
                { title: 'Miles', desc: 'Earn miles on every rupee spent with us and redeem for free flights.' },
                { title: 'Upgrades', desc: 'Complimentary cabin upgrades when available for elite members.' },
                { title: 'Priority', desc: 'Skip the queue with dedicated check-in and boarding lanes.' }
              ].map((benefit, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>{benefit.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{benefit.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--glass-border)', padding: '3rem 0', position: 'relative', zIndex: 1 }}>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Plane size={24} style={{ color: 'var(--primary-light)' }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>SkyWay Airlines</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Your trusted partner for domestic and international flights.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © 2026 SkyWay Airlines. All rights reserved.
          </p>
        </div>
      </footer>
    </motion.div>
  )
}
