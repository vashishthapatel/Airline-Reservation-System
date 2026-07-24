import { motion } from 'framer-motion'
import { Plane, Clock, ArrowRight, Building2 } from 'lucide-react'
import { format } from 'date-fns'

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
}

export default function FlightCard({ flight, onSelect }) {
  const dep = new Date(flight.departureTime)
  const arr = new Date(flight.arrivalTime)

  return (
    <motion.div
      className="flight-card"
      onClick={() => onSelect && onSelect(flight)}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Plane size={16} style={{ color: 'var(--primary-light)' }} />
            <span style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>
              {flight.flightNumber}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <Building2 size={14} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {flight.manufacturer || flight.aircraftModel}
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{format(dep, 'EEE, MMM d, yyyy')}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900 }} className="gradient-text">
            {formatPrice(flight.basePrice)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>per person</div>
        </div>
      </div>

      {/* Route */}
      <div className="flight-route" style={{ marginBottom: '1.5rem' }}>
        <div className="flight-airport">
          <div className="flight-code">{flight.originCode}</div>
          <div className="flight-city">{flight.originCity}</div>
          <div className="flight-time">{format(dep, 'HH:mm')}</div>
        </div>

        <div className="flight-path">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="flight-duration">{formatDuration(flight.durationMinutes)}</span>
          </div>
          <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', padding: '4px 0' }}>
            <div className="flight-line" style={{ flex: 1 }} />
            <Plane size={18} style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'var(--primary-light)', background: 'var(--bg-primary)', padding: '2px' }} />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Direct</span>
        </div>

        <div className="flight-airport" style={{ textAlign: 'right' }}>
          <div className="flight-code">{flight.destinationCode}</div>
          <div className="flight-city">{flight.destinationCity}</div>
          <div className="flight-time">{format(arr, 'HH:mm')}</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className={`badge ${flight.availableSeats > 20 ? 'badge-success' : flight.availableSeats > 5 ? 'badge-warning' : 'badge-error'}`}>
            {flight.availableSeats} seats left
          </span>
          <span className="badge badge-info">Economy from {formatPrice(flight.basePrice)}</span>
          {flight.cheapest && (
            <span className="badge badge-success">Cheapest</span>
          )}
          {flight.fastest && (
            <span className="badge badge-info">Fastest</span>
          )}
        </div>
        <button className="btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          Select <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  )
}
