import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { searchFlights, getAirports } from '../api/axios'
import FlightCard from '../components/FlightCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { SlidersHorizontal, ArrowUpDown, RefreshCw, Plane, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  }
}

export default function FlightSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const originCode = searchParams.get('originCode') || ''
  const destinationCode = searchParams.get('destinationCode') || ''
  const departureDate = searchParams.get('departureDate') || ''
  const passengers = parseInt(searchParams.get('passengers') || '1')
  const tripType = searchParams.get('tripType') || 'one-way'

  const [flights, setFlights] = useState([])
  const [airports, setAirports] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('price') // price, duration, departure
  const [priceFilter, setPriceFilter] = useState(100000)
  const [maxPrice, setMaxPrice] = useState(100000)

  // Re-search fields
  const [tempOrigin, setTempOrigin] = useState(originCode)
  const [tempDest, setTempDest] = useState(destinationCode)
  const [tempDate, setTempDate] = useState(departureDate)
  const [tempPass, setTempPass] = useState(passengers)

  useEffect(() => {
    async function loadAirports() {
      try {
        const res = await getAirports()
        if (res.data && res.data.success) {
          setAirports(res.data.data)
        }
      } catch (err) {
        console.error('Error loading airports:', err)
      }
    }
    loadAirports()
  }, [])

  useEffect(() => {
    async function fetchResults() {
      if (!originCode || !destinationCode) return
      setLoading(true)
      try {
        const params = {
          originCode,
          destinationCode,
          passengers
        }
        if (departureDate) {
          params.departureDate = departureDate
        }
        const res = await searchFlights(params)
        if (res.data && res.data.success) {
          setFlights(res.data.data)
        }

        if (res.data && res.data.data && res.data.data.length > 0) {
          const prices = res.data.data.map(f => Number(f.basePrice))
          const max = Math.max(...prices)
          setMaxPrice(max)
          setPriceFilter(max)
        }
      } catch (err) {
        console.error('Error searching flights:', err)
        toast.error('Failed to load flights!')
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [searchParams, originCode, destinationCode, departureDate, passengers])

  const handleReSearch = (e) => {
    e.preventDefault()
    if (!tempOrigin || !tempDest) {
      toast.error('Origin and Destination are required!')
      return
    }
    if (tempOrigin === tempDest) {
      toast.error('Origin and Destination cannot be the same!')
      return
    }
    setSearchParams({
      originCode: tempOrigin,
      destinationCode: tempDest,
      departureDate: tempDate || '',
      passengers: tempPass.toString(),
      tripType
    })
  }

  const handleSelectFlight = (flight) => {
    // Save selection in session storage
    sessionStorage.setItem('selectedFlight', JSON.stringify(flight))
    sessionStorage.setItem('passengerCount', passengers.toString())
    navigate(`/flights/${flight.id}/seats`)
  }

  // Filter & Sort
  const filteredFlights = flights.filter(f => Number(f.basePrice) <= priceFilter)

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    if (sortBy === 'price') return Number(a.basePrice) - Number(b.basePrice)
    if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes
    if (sortBy === 'departure') return new Date(a.departureTime) - new Date(b.departureTime)
    return 0
  })

  const forwardFlights = sortedFlights.filter(f => f.direction === 'FORWARD' || !f.direction)
  const reverseFlights = sortedFlights.filter(f => f.direction === 'REVERSE')

  const groupFlightsByDate = (flightList) => {
    const groups = {}
    flightList.forEach(flight => {
      const dateKey = format(new Date(flight.departureTime), 'yyyy-MM-dd')
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(flight)
    })
    return Object.entries(groups).sort(([a], [b]) => new Date(a) - new Date(b))
  }

  const forwardGroups = groupFlightsByDate(forwardFlights)
  const reverseGroups = groupFlightsByDate(reverseFlights)

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="page-container section-padding animate-fadeInUp"
    >
      {/* Re-Search Panel */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <form onSubmit={handleReSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group">
            <label className="form-label">From</label>
            <select className="input-field" value={tempOrigin} onChange={e => setTempOrigin(e.target.value)}>
              {airports.map(ap => (
                <option key={ap.id} value={ap.iataCode}>{ap.city} ({ap.iataCode})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">To</label>
            <select className="input-field" value={tempDest} onChange={e => setTempDest(e.target.value)}>
              {airports.map(ap => (
                <option key={ap.id} value={ap.iataCode}>{ap.city} ({ap.iataCode})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Departure Date</label>
            <input type="date" className="input-field" value={tempDate} onChange={e => setTempDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Passengers</label>
            <select className="input-field" value={tempPass} onChange={e => setTempPass(parseInt(e.target.value))}>
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ height: '42px', justifyContent: 'center' }}>
            <RefreshCw size={16} /> Update Search
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Main Search Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {/* Filters Sidebar */}
          <div className="glass-card" style={{ padding: '1.5rem', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
              <SlidersHorizontal size={18} style={{ color: 'var(--primary-light)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Filter & Sort</h3>
            </div>

            {/* Sort Options */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ArrowUpDown size={14} /> Sort By
              </label>
              <select className="input-field" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="price">Cheapest Price</option>
                <option value="duration">Fastest Duration</option>
                <option value="departure">Earliest Departure</option>
              </select>
            </div>

            {/* Price Filter Slider */}
            <div>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Max Price</span>
                <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>₹{priceFilter.toLocaleString('en-IN')}</span>
              </label>
              <input
                type="range"
                style={{ width: '100%', accentColor: 'var(--primary)' }}
                min="3000"
                max={maxPrice > 3000 ? maxPrice : 100000}
                value={priceFilter}
                onChange={e => setPriceFilter(Number(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                <span>₹3,000</span>
                <span>₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {loading ? (
              <LoadingSpinner />
            ) : sortedFlights.length > 0 ? (
              <>
                {forwardGroups.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                      {originCode} → {destinationCode}
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, marginLeft: '0.5rem' }}>
                        ({forwardFlights.length} flight{forwardFlights.length !== 1 ? 's' : ''} found)
                      </span>
                    </h2>
                    {forwardGroups.map(([date, dateFlights]) => (
                      <div key={date} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                          <Calendar size={16} style={{ color: 'var(--primary-light)' }} />
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                            {format(new Date(date), 'EEE, MMM d, yyyy')}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                            ({dateFlights.length} flight{dateFlights.length !== 1 ? 's' : ''})
                          </span>
                        </div>
                        {dateFlights.map(flight => (
                          <FlightCard
                            key={flight.id}
                            flight={flight}
                            onSelect={handleSelectFlight}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {reverseGroups.length > 0 && (
                  <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--glass-border)' }}>
                      <Plane size={18} style={{ color: 'var(--primary-light)', transform: 'scaleX(-1)' }} />
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                        {destinationCode} → {originCode}
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, marginLeft: '0.5rem' }}>
                          ({reverseFlights.length} flight{reverseFlights.length !== 1 ? 's' : ''} found)
                        </span>
                      </h2>
                    </div>
                    {reverseGroups.map(([date, dateFlights]) => (
                      <div key={date} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                          <Calendar size={16} style={{ color: 'var(--primary-light)' }} />
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                            {format(new Date(date), 'EEE, MMM d, yyyy')}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                            ({dateFlights.length} flight{dateFlights.length !== 1 ? 's' : ''})
                          </span>
                        </div>
                        {dateFlights.map(flight => (
                          <FlightCard
                            key={flight.id}
                            flight={flight}
                            onSelect={handleSelectFlight}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
