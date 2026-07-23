import { format } from 'date-fns'
import { Plane, Calendar, Users, DollarSign, XCircle } from 'lucide-react'

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
}

export default function BookingCard({ booking, onCancel }) {
  const statusBadge = {
    CONFIRMED: 'badge-success',
    PENDING: 'badge-warning',
    CANCELLED: 'badge-error'
  }[booking.status] || 'badge-info'

  const dep = new Date(booking.flight?.departureTime)
  const created = new Date(booking.createdAt)

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '1px' }}>
              {booking.bookingReference}
            </span>
            <span className={`badge ${statusBadge}`}>{booking.status}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Booked on {format(created, 'MMM d, yyyy')}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800 }} className="gradient-text">
            {formatPrice(booking.totalAmount)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.passengerCount} passenger(s)</div>
        </div>
      </div>

      {booking.flight && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(212, 175, 55, 0.04)', borderRadius: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plane size={16} style={{ color: 'var(--primary-light)' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{booking.flight.flightNumber}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <strong>{booking.flight.originCode}</strong>
            <span>→</span>
            <strong>{booking.flight.destinationCode}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Calendar size={14} />
            {!isNaN(dep) ? format(dep, 'EEE, MMM d · HH:mm') : 'N/A'}
          </div>
        </div>
      )}

      {booking.passengers && booking.passengers.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Passengers</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {booking.passengers.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '4px 10px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <Users size={12} style={{ color: 'var(--primary-light)' }} />
                {p.fullName}
                {p.seatNumber && p.seatNumber !== 'N/A' && <span style={{ color: 'var(--text-muted)' }}>· {p.seatNumber}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {booking.status === 'CONFIRMED' && onCancel && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-danger" onClick={() => onCancel(booking.id)}>
            <XCircle size={14} /> Cancel Booking
          </button>
        </div>
      )}
    </div>
  )
}
