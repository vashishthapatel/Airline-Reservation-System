import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, User } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PassengerForm() {
  const navigate = useNavigate()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [passengers, setPassengers] = useState([])

  useEffect(() => {
    // Read selected seats from sessionStorage
    const seatsStr = sessionStorage.getItem('selectedSeats')
    if (!seatsStr) {
      toast.error('Session expired. Please select a flight and seats again.')
      navigate('/')
      return
    }
    const seats = JSON.parse(seatsStr)
    setSelectedSeats(seats)

    // Prepopulate passenger list with empty fields
    const initialPassengers = seats.map((seat) => ({
      fullName: '',
      gender: 'MALE',
      age: '',
      nationality: 'Indian',
      passportNumber: '',
      seatId: seat.id,
      seatNumber: seat.seatNumber,
      seatClass: seat.seatClass
    }))
    setPassengers(initialPassengers)
  }, [navigate])

  const handleInputChange = (index, field, value) => {
    const updated = [...passengers]
    updated[index][field] = value
    setPassengers(updated)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate passenger details
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i]
      if (!p.fullName.trim()) {
        toast.error(`Please enter Full Name for Passenger ${i + 1}!`)
        return
      }
      if (!p.age || isNaN(p.age) || parseInt(p.age) <= 0) {
        toast.error(`Please enter a valid age for Passenger ${i + 1}!`)
        return
      }
      if (!p.nationality.trim()) {
        toast.error(`Please enter Nationality for Passenger ${i + 1}!`)
        return
      }
    }

    // Save passengers in sessionStorage
    sessionStorage.setItem('passengerDetails', JSON.stringify(passengers))
    navigate('/booking/payment')
  }

  return (
    <div className="page-container section-padding animate-fadeInUp">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={14} /> Back to Seats
      </button>

      {/* Progress Steps */}
      <div className="steps-progress">
        <div className="step-item completed">
          <span className="step-number">1</span>
          <span className="step-label">Select Flight</span>
        </div>
        <div className="step-connector done"></div>
        <div className="step-item completed">
          <span className="step-number">2</span>
          <span className="step-label">Select Seats</span>
        </div>
        <div className="step-connector done"></div>
        <div className="step-item active">
          <span className="step-number">3</span>
          <span className="step-label">Passenger Info</span>
        </div>
        <div className="step-connector"></div>
        <div className="step-item">
          <span className="step-number">4</span>
          <span className="step-label">Payment</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Passenger details forms */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {passengers.map((passenger, index) => (
            <div key={index} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 700 }}>
                  <User size={18} style={{ color: 'var(--primary-light)' }} /> Passenger {index + 1}
                </h3>
                <span className="badge badge-purple">Seat {passenger.seatNumber} ({passenger.seatClass})</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Full Name (As in ID)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter full name"
                    value={passenger.fullName}
                    onChange={(e) => handleInputChange(index, 'fullName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="input-field"
                    value={passenger.gender}
                    onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="Enter age"
                    min="1"
                    max="120"
                    value={passenger.age}
                    onChange={(e) => handleInputChange(index, 'age', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nationality</label>
                  <input
                    type="text"
                    className="input-field"
                    value={passenger.nationality}
                    onChange={(e) => handleInputChange(index, 'nationality', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Passport Number (Optional)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter passport number"
                    value={passenger.passportNumber}
                    onChange={(e) => handleInputChange(index, 'passportNumber', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Proceed to Payment <ArrowRight size={16} />
          </button>
        </form>

        {/* Sidebar Summary */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Booking Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <div>Total Selected Seats: <strong>{selectedSeats.length}</strong></div>
            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
              {selectedSeats.map(s => (
                <span key={s.id} className="badge badge-info">Seat {s.seatNumber}</span>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Total Price</span>
              <span className="gradient-text">₹{selectedSeats.reduce((sum, s) => sum + Number(s.price), 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
