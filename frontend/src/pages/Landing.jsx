import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plane, Calendar, Users, ArrowRight, ShieldCheck, Zap, Globe, MapPin } from 'lucide-react'
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

  const selectPopularRoute = (route) => {
    setOrigin(route.from)
    setDestination(route.to)
    // Set departure date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setDepDate(tomorrow.toISOString().split('T')[0])
    
    // Smooth scroll to search form
    window.scrollTo({ top: 100, behavior: 'smooth' })
  }

  return (
    <div className="animate-fadeInUp">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>

        <div className="hero-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            {/* Hero Left Text */}
            <div className="hero-text">
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
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#routes" className="btn-primary">
                  Popular Routes <ArrowRight size={16} />
                </a>
                <a href="#how-it-works" className="btn-ghost">
                  Learn More
                </a>
              </div>
            </div>

            {/* Flight Search Card */}
            <div className="search-card">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>Book Flight Tickets</h2>
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

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                  <Plane size={18} /> Search Flights
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="section-padding" style={{ background: 'var(--bg-secondary)', position: 'relative', zIndex: 1 }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="gradient-text" style={{ marginBottom: '1rem' }}>Why Choose SkyWay?</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              We provide the best booking experience, flight schedules, and premium service to make your trip unforgettable.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-light)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Zap size={28} />
              </div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>⚡ Instant Booking</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Get your digital ticket immediately after payment, with automatic seat updates.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>🛡️ Secure Payments</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Multi-channel secure transactions. Rest assured your transaction details are fully protected.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.14)', color: 'var(--accent)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Globe size={28} />
              </div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>✈️ 200+ Destinations</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Fly anywhere around the world. Connect with all major international and domestic routes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="section-padding" style={{ position: 'relative', zIndex: 1 }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="gradient-text" style={{ marginBottom: '1rem' }}>How It Works</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Book your next flight in just 4 simple steps.
            </p>
          </div>

          <div className="steps-progress" style={{ marginBottom: '0' }}>
            <div className="step-item active">
              <span className="step-number">1</span>
              <span className="step-label">Search Flights</span>
            </div>
            <div className="step-connector done"></div>
            <div className="step-item active">
              <span className="step-number">2</span>
              <span className="step-label">Select Seats</span>
            </div>
            <div className="step-connector done"></div>
            <div className="step-item active">
              <span className="step-number">3</span>
              <span className="step-label">Passenger Info</span>
            </div>
            <div className="step-connector done"></div>
            <div className="step-item active">
              <span className="step-number">4</span>
              <span className="step-label">Secure Pay</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section id="routes" className="section-padding" style={{ background: 'var(--bg-secondary)', position: 'relative', zIndex: 1 }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="gradient-text" style={{ marginBottom: '1rem' }}>Popular Flight Routes</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Discover deals on our most frequented flights. Click any card to set your route automatically.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {popularRoutes.map((route, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{ padding: '1.5rem', cursor: 'pointer' }}
                onClick={() => selectPopularRoute(route)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{route.fromCity} ({route.from})</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Origin</p>
                  </div>
                  <Plane size={16} style={{ color: 'var(--primary-light)' }} />
                  <div style={{ textAlign: 'right' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{route.toCity} ({route.to})</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Destination</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Direct Flight</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary-light)', fontSize: '1.1rem' }}>{route.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
