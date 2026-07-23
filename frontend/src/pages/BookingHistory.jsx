import { useState, useEffect } from 'react'
import { getMyBookings, cancelBooking } from '../api/axios'
import BookingCard from '../components/BookingCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { AlertCircle, Plane } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BookingHistory() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('ALL') // ALL, CONFIRMED, CANCELLED

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const res = await getMyBookings()
      if (res.data && res.data.success) {
        setBookings(res.data.data)
      }
    } catch (err) {
      console.error('Error fetching bookings:', err)
      toast.error('Failed to load booking history!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCancelBooking = async (bookingId) => {
    const confirm = window.confirm('Are you sure you want to cancel this booking? This action releases your seats and initiates a refund.')
    if (!confirm) return

    try {
      const res = await cancelBooking(bookingId)
      if (res.data && res.data.success) {
        toast.success('Booking cancelled successfully!')
        fetchBookings() // Reload list
      } else {
        toast.error(res.data.message || 'Failed to cancel booking')
      }
    } catch (err) {
      console.error('Error cancelling booking:', err)
      toast.error(err.response?.data?.message || 'Failed to cancel booking!')
    }
  }

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'ALL') return true
    return b.status === activeTab
  })

  return (
    <div className="page-container section-padding animate-fadeInUp">
      <div className="page-header">
        <div>
          <h1 className="page-title">Booking History</h1>
          <p className="page-subtitle">View and manage your flight tickets, booking references, and itineraries</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="search-tabs" style={{ marginBottom: '2rem' }}>
        {[
          { id: 'ALL', label: 'All Bookings' },
          { id: 'CONFIRMED', label: 'Confirmed' },
          { id: 'CANCELLED', label: 'Cancelled' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`search-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredBookings.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
          {filteredBookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancelBooking}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state glass-card" style={{ maxWidth: '800px' }}>
          <AlertCircle className="empty-icon" />
          <h3>No Bookings Found</h3>
          <p>You do not have any bookings in this category. Go to the Home page to start search and booking.</p>
        </div>
      )}
    </div>
  )
}
