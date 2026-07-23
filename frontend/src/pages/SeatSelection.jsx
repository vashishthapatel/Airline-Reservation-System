import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getFlightSeats, getFlightById } from '../api/axios'
import SeatMap from '../components/SeatMap'
import LoadingSpinner from '../components/LoadingSpinner'
import { ArrowLeft, ArrowRight, Plane, Info } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SeatSelection() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [flight, setFlight] = useState(null)
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [passengerCount, setPassengerCount] = useState(1)

  useEffect(() => {
    // Read passengers count from sessionStorage
    const count = parseInt(sessionStorage.getItem('passengerCount') || '1')
    setPassengerCount(count)

    async function loadFlightAndSeats() {
      setLoading(true)
      try {
        const flightRes = await getFlightById(id)
        if (flightRes.data && flightRes.data.success) {
          setFlight(flightRes.data.data)
        }
        
        const seatsRes = await getFlightSeats(id)
        if (seatsRes.data && seatsRes.data.success) {
          setSeats(seatsRes.data.data)
        }
      } catch (err) {
        console.error('Error loading seats:', err)
        toast.error('Failed to load seat layout!')
      } finally {
        setLoading(false)
      }
    }
    loadFlightAndSeats()
  }, [id])

  const handleSeatClick = (seat) => {
    // Check if already selected
    const isSelected = selectedSeats.some(s => s.id === seat.id)
    
    if (isSelected) {
      // Remove it
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id))
    } else {
      // Add it if limit not reached
      if (selectedSeats.length >= passengerCount) {
        // Remove first seat and add new one
        if (passengerCount === 1) {
          setSelectedSeats([seat])
        } else {
          toast.error(`You can only select up to ${passengerCount} seats!`)
        }
      } else {
        setSelectedSeats([...selectedSeats, seat])
      }
    }
  }

  const handleContinue = () => {
    if (selectedSeats.length !== passengerCount) {
      toast.error(`Please select exactly ${passengerCount} seat(s) to continue!`)
      return
    }

    // Save selected seats in sessionStorage
    sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats))
    navigate('/booking/passengers')
  }

  const totalAmount = selectedSeats.reduce((sum, s) => sum + Number(s.price), 0)

  if (loading) return <LoadingSpinner />

  return (
    <div className="page-container section-padding animate-fadeInUp">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={14} /> Back to Search
      </button>

      {/* Booking Progress steps */}
      <div className="steps-progress">
        <div className="step-item completed">
          <span className="step-number">1</span>
          <span className="step-label">Select Flight</span>
        </div>
        <div className="step-connector done"></div>
        <div className="step-item active">
          <span className="step-number">2</span>
          <span className="step-label">Select Seats</span>
        </div>
        <div className="step-connector"></div>
        <div className="step-item">
          <span className="step-number">3</span>
          <span className="step-label">Passenger Info</span>
        </div>
        <div className="step-connector"></div>
        <div className="step-item">
          <span className="step-number">4</span>
          <span className="step-label">Payment</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
        {/* Seat Layout */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>Choose Seats</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Select exactly {passengerCount} seat{passengerCount > 1 ? 's' : ''} from the cabin map below.
          </p>
          <SeatMap
            seats={seats}
            selectedSeats={selectedSeats}
            onSeatClick={handleSeatClick}
            maxSelection={passengerCount}
          />
        </div>

        {/* Sidebar Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Flight Info Card */}
          {flight && (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plane size={18} style={{ color: 'var(--primary-light)' }} /> Flight Summary
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <strong style={{ fontSize: '1.25rem' }}>{flight.originCode}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{flight.originCity}</div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>→</div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '1.25rem' }}>{flight.destinationCode}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{flight.destinationCity}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div>Flight: <strong>{flight.flightNumber}</strong></div>
                <div>Aircraft: <strong>{flight.aircraftModel}</strong></div>
              </div>
            </div>
          )}

          {/* Pricing Summary */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Fare Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {selectedSeats.length > 0 ? (
                selectedSeats.map((seat, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span>Seat {seat.seatNumber} ({seat.seatClass})</span>
                    <span>₹{Number(seat.price).toLocaleString('en-IN')}</span>
                  </div>
                ))
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Info size={14} /> No seats selected yet.
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', marginTop: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>
                <span>Total Amount</span>
                <span className="gradient-text">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleContinue}
              disabled={selectedSeats.length !== passengerCount}
            >
              Continue to Passenger Info <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
