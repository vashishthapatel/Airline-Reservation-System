import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { getBookingById, getPaymentByBookingId } from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { Check, Printer, FileText, ArrowRight, Plane, Calendar, User, CreditCard } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function BookingConfirmation() {
  const { bookingId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [booking, setBooking] = useState(() => location.state?.booking || null)
  const [payment, setPayment] = useState(() => location.state?.payment || null)
  const [loading, setLoading] = useState(() => !location.state?.booking || !location.state?.payment)

  useEffect(() => {
    if (!bookingId) {
      toast.error('Booking ID is missing!')
      navigate('/')
      return
    }

    if (location.state?.booking && location.state?.payment) {
      return
    }

    async function loadConfirmation() {
      setLoading(true)
      try {
        const [bookRes, payRes] = await Promise.all([
          getBookingById(bookingId),
          getPaymentByBookingId(bookingId)
        ])
        if (bookRes.data && bookRes.data.success) {
          setBooking(bookRes.data.data)
        }

        if (payRes.data && payRes.data.success) {
          setPayment(payRes.data.data)
        }
      } catch (err) {
        console.error('Error loading confirmation:', err)
        toast.error('Failed to load confirmation details!')
      } finally {
        setLoading(false)
      }
    }
    loadConfirmation()
  }, [bookingId, location.state, navigate])

  const handlePrint = () => {
    window.print()
  }

  if (loading) return <LoadingSpinner />
  if (!booking || booking.status !== 'CONFIRMED' || payment?.status !== 'SUCCESS') {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>A confirmed ticket was not found.</div>
  }

  const depTime = booking.flight ? new Date(booking.flight.departureTime) : null
  const arrTime = booking.flight ? new Date(booking.flight.arrivalTime) : null

  return (
    <div className="page-container section-padding animate-fadeInUp">
      {/* Confirmation Message */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="confirmation-check">
          <Check size={40} style={{ color: 'var(--success)' }} />
        </div>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Booking Confirmed!</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Thank you for choosing SkyWay Airlines. Your ticket is ready and confirmed.
        </p>
      </div>

      {/* Ticket Details Glass Card */}
      <div className="ticket-card" style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Booking Reference</span>
            <div className="booking-ref gradient-text">{booking.bookingReference}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>{booking.status}</span>
          </div>
        </div>

        {/* Flight Information */}
        {booking.flight && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                <Plane size={14} /> Flight
              </div>
              <strong style={{ fontSize: '1.1rem' }}>{booking.flight.flightNumber}</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{booking.flight.aircraftModel}</div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                <Calendar size={14} /> Departure
              </div>
              <strong style={{ fontSize: '1.1rem' }}>
                {depTime ? format(depTime, 'HH:mm') : 'N/A'}
              </strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {depTime ? format(depTime, 'EEE, MMM d, yyyy') : 'N/A'}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{booking.flight.originCity} ({booking.flight.originCode})</div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                <Calendar size={14} /> Arrival
              </div>
              <strong style={{ fontSize: '1.1rem' }}>
                {arrTime ? format(arrTime, 'HH:mm') : 'N/A'}
              </strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {arrTime ? format(arrTime, 'EEE, MMM d, yyyy') : 'N/A'}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{booking.flight.destinationCity} ({booking.flight.destinationCode})</div>
            </div>
          </div>
        )}

        {/* Passenger Information */}
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} style={{ color: 'var(--primary-light)' }} /> Passenger Details
          </h3>
          <div className="table-wrapper">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Nationality</th>
                  <th>Seat Number</th>
                  <th>Class</th>
                </tr>
              </thead>
              <tbody>
                {booking.passengers && booking.passengers.map((p, idx) => (
                  <tr key={idx}>
                    <td><strong>{p.fullName}</strong></td>
                    <td>{p.gender}</td>
                    <td>{p.age}</td>
                    <td>{p.nationality}</td>
                    <td><span className="badge badge-purple">{p.seatNumber}</span></td>
                    <td>{p.seatClass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Summary */}
        {payment && (
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                <CreditCard size={14} /> Payment Method
              </div>
              <strong style={{ fontSize: '1rem' }}>{payment.method.replace('_', ' ')}</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Txn ID: {payment.transactionId}</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Paid Date</div>
              <strong>{payment.paidAt ? format(new Date(payment.paidAt), 'MMM d, yyyy · HH:mm') : 'N/A'}</strong>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Total Amount Paid</div>
              <strong style={{ fontSize: '1.5rem' }} className="gradient-text">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(payment.amount)}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn-ghost" onClick={handlePrint}>
          <Printer size={16} /> Print / Download Ticket
        </button>
        <Link to="/history" className="btn-primary" style={{ background: 'var(--gradient-primary)', border: 'none' }}>
          <FileText size={16} /> Booking History <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
