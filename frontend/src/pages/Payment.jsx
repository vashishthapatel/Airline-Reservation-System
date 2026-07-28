import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBooking, processPayment } from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { CreditCard, Smartphone, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Payment() {
  const navigate = useNavigate()
  
  const [flight, setFlight] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [passengers, setPassengers] = useState([])
  
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(false)
  const [creatingBooking, setCreatingBooking] = useState(true)

  // Payment Form States
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD') // CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [upiId, setUpiId] = useState('')
  const [bankName, setBankName] = useState('State Bank of India')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    // Read session storage data
    const fl = sessionStorage.getItem('selectedFlight')
    const se = sessionStorage.getItem('selectedSeats')
    const pa = sessionStorage.getItem('passengerDetails')

    if (!fl || !se || !pa) {
      toast.error('Session expired. Please start over.')
      navigate('/')
      return
    }

    const flightData = JSON.parse(fl)
    const seatsData = JSON.parse(se)
    const passengersData = JSON.parse(pa)

    setFlight(flightData)
    setSelectedSeats(seatsData)
    setPassengers(passengersData)

    // Call API to create Booking in PENDING state
    async function initBooking() {
      setCreatingBooking(true)
      try {
        const passengerReqs = passengersData.map(p => ({
          fullName: p.fullName,
          gender: p.gender,
          age: parseInt(p.age),
          nationality: p.nationality,
          passportNumber: p.passportNumber || null,
          seatId: p.seatId
        }))

        const res = await createBooking({
          flightId: flightData.id,
          passengerRequests: passengerReqs,
          selectedSeatIds: seatsData.map(s => s.id),
          paymentMethod: 'CREDIT_CARD' // default placeholder
        })

        if (res.data && res.data.success) {
          setBooking(res.data.data)
        } else {
          toast.error(res.data.message || 'Failed to initialize booking!')
          navigate(-1)
        }
      } catch (err) {
        console.error('Error creating booking:', err)
        toast.error(err.response?.data?.message || 'Failed to select seats/lock booking!')
        navigate(-1)
      } finally {
        setCreatingBooking(false)
      }
    }

    initBooking()
  }, [navigate])

  const handlePay = async (e) => {
    e.preventDefault()
    if (!booking) return

    setProcessing(true)
    try {
      const paymentReq = {
        bookingId: booking.id,
        method: paymentMethod,
        cardNumber: paymentMethod.endsWith('CARD') ? cardNumber : null,
        cardExpiry: paymentMethod.endsWith('CARD') ? cardExpiry : null,
        cardCvv: paymentMethod.endsWith('CARD') ? cardCvv : null,
        upiId: paymentMethod === 'UPI' ? upiId : null,
        bankName: paymentMethod === 'NET_BANKING' ? bankName : null
      }

      const res = await processPayment(paymentReq)
      if (res.data && res.data.success && res.data.data.status === 'SUCCESS') {
        toast.success('Payment Successful! Ticket Confirmed.')
        
        // Clear booking session states
        sessionStorage.removeItem('selectedFlight')
        sessionStorage.removeItem('selectedSeats')
        sessionStorage.removeItem('passengerDetails')
        sessionStorage.removeItem('passengerCount')

        navigate(`/booking/ticket/${booking.id}`, {
          replace: true,
          state: {
            booking: { ...booking, status: 'CONFIRMED' },
            payment: res.data.data
          }
        })
      } else {
        toast.error('Payment Failed! Please try again with different credentials.')
      }
    } catch (err) {
      console.error('Error processing payment:', err)
      toast.error(err.response?.data?.message || 'Payment processing failed!')
    } finally {
      setProcessing(false)
    }
  }

  if (creatingBooking) return <LoadingSpinner />

  return (
    <div className="page-container section-padding animate-fadeInUp">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={14} /> Back
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
        <div className="step-item completed">
          <span className="step-number">3</span>
          <span className="step-label">Passenger Info</span>
        </div>
        <div className="step-connector done"></div>
        <div className="step-item active">
          <span className="step-number">4</span>
          <span className="step-label">Payment</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
        {/* Payment Gateways */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>Payment Method</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Choose a payment method to complete booking reference: <strong>{booking?.bookingReference}</strong>.
          </p>

          {/* Payment Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {[
              { id: 'CREDIT_CARD', label: 'Credit Card', icon: <CreditCard size={16} /> },
              { id: 'DEBIT_CARD', label: 'Debit Card', icon: <CreditCard size={16} /> },
              { id: 'UPI', label: 'UPI', icon: <Smartphone size={16} /> },
              { id: 'NET_BANKING', label: 'Net Banking', icon: <ShieldCheck size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`search-tab ${paymentMethod === tab.id ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={() => setPaymentMethod(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Conditional form fields based on selected method */}
            {paymentMethod.endsWith('CARD') && (
              <>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="1234 5678 9876 5432"
                    maxLength="19"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="•••"
                      maxLength="3"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'UPI' && (
              <div className="form-group">
                <label className="form-label">UPI ID</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="username@upi (Type 'fail' to simulate failure)"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  required
                />
              </div>
            )}

            {paymentMethod === 'NET_BANKING' && (
              <div className="form-group">
                <label className="form-label">Select Bank</label>
                <select className="input-field" value={bankName} onChange={e => setBankName(e.target.value)}>
                  <option value="State Bank of India">State Bank of India</option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
              disabled={processing}
            >
              {processing ? 'Processing Payment...' : `Pay ₹${Number(booking?.totalAmount).toLocaleString('en-IN')}`}
            </button>
          </form>
        </div>

        {/* Sidebar Summary */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Total Fare</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Base Fare ({passengers.length} passenger{passengers.length > 1 ? 's' : ''})</span>
              <span>₹{Number(booking?.totalAmount).toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Taxes & Fees</span>
              <span style={{ color: 'var(--success)' }}>Free / Included</span>
            </div>
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.25rem' }}>
              <span>Amount Due</span>
              <span className="gradient-text">₹{Number(booking?.totalAmount).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
