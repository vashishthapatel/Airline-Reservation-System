import { motion } from 'framer-motion'
import { Plane, Clock, ArrowRight, Building2, Globe } from 'lucide-react'
import { format } from 'date-fns'
import './EnhancedFlightCard.css'

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
}

export default function EnhancedFlightCard({ flight, onSelect }) {
  const dep = new Date(flight.departureTime)
  const arr = new Date(flight.arrivalTime)

  return (
    <motion.div
      className="enhanced-flight-card"
      onClick={() => onSelect && onSelect(flight)}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start' }}>
        <div>
          {/* Airline Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ background: 'rgba(14, 58, 93, 0.1)', color: 'var(--primary-light)', width: '44px', height: '44px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                {flight.manufacturer || flight.aircraftModel}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Plane size={12} /> {flight.flightNumber}
              </div>
            </div>
          </div>

          {/* Route Visualization */}
          <div style={{ margin: '1.5rem 0 1.25rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="globe-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', margin: '0 auto 0.4rem' }} />
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.5px' }}>{flight.originCode}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{flight.originCity}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{format(dep, 'HH:mm')}</div>
              </div>

              <div style={{ flex: 1, margin: '0 1.25rem', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{formatDuration(flight.durationMinutes)}</span>
                </div>
                <div className="route-line-animated" />
                <motion.div
                  style={{ position: 'absolute', top: '-8px', left: 0, color: 'var(--primary-light)' }}
                  animate={{ left: ['0%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Plane size={18} />
                </motion.div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div className="globe-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--secondary)', margin: '0 auto 0.4rem', animationDelay: '0.5s' }} />
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.5px' }}>{flight.destinationCode}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{flight.destinationCity}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{format(arr, 'HH:mm')}</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <Globe size={13} /> {format(dep, 'EEE, MMM d, yyyy')} · Direct Flight
            </div>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span className={`badge ${flight.availableSeats > 20 ? 'badge-success' : flight.availableSeats > 5 ? 'badge-warning' : 'badge-error'}`}>
              {flight.availableSeats} seats left
            </span>
            <span className="badge badge-info">Economy from {formatPrice(flight.basePrice)}</span>
            {flight.cheapest && <span className="badge badge-success">Cheapest</span>}
            {flight.fastest && <span className="badge badge-info">Fastest</span>}
          </div>
        </div>

        {/* Price + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem', minWidth: '140px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, lineHeight: 1 }} className="gradient-text">
              {formatPrice(flight.basePrice)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>per person</div>
          </div>
          <motion.button
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center', padding: '0.85rem 1.25rem' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Select <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
