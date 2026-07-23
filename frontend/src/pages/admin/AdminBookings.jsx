import { useState, useEffect } from 'react'
import { getAllBookings } from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Plane, ListOrdered, Users, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('ALL') // ALL, CONFIRMED, PENDING, CANCELLED

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true)
      try {
        const res = await getAllBookings()
        if (res.data && res.data.success) {
          setBookings(res.data.data)
        }
      } catch (err) {
        console.error(err)
        toast.error('Failed to load all booking registers!')
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'ALL') return true
    return b.status === activeTab
  })

  if (loading) return <LoadingSpinner />

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <h2 className="gradient-text">SkyWay Admin</h2>
        </div>
        <a href="/admin" className="admin-nav-item">
          <Plane size={16} /> Dashboard
        </a>
        <a href="/admin/flights" className="admin-nav-item">
          <ListOrdered size={16} /> Flights
        </a>
        <a href="/admin/users" className="admin-nav-item">
          <Users size={16} /> Users
        </a>
        <a href="/admin/bookings" className="admin-nav-item active">
          <Calendar size={16} /> Bookings
        </a>
      </aside>

      {/* Main Content */}
      <main className="admin-content animate-fadeInUp">
        <div className="page-header">
          <div>
            <h1 className="page-title">Passenger Bookings</h1>
            <p className="page-subtitle">View and monitor all tickets, payments, and seat status reservations</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="search-tabs" style={{ marginBottom: '2rem' }}>
          {[
            { id: 'ALL', label: 'All Bookings' },
            { id: 'CONFIRMED', label: 'Confirmed' },
            { id: 'PENDING', label: 'Pending' },
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

        {/* Bookings Table */}
        <div className="table-wrapper">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Passenger Name</th>
                <th>Flight No</th>
                <th>Seats Count</th>
                <th>Total Fare</th>
                <th>Status</th>
                <th>Date Booked</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(b => {
                const statusBadge = {
                  CONFIRMED: 'badge-success',
                  PENDING: 'badge-warning',
                  CANCELLED: 'badge-error'
                }[b.status] || 'badge-info'

                return (
                  <tr key={b.id}>
                    <td><strong>{b.bookingReference}</strong></td>
                    <td>
                      <div><strong>{b.customerName}</strong></div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.customerEmail}</div>
                    </td>
                    <td>{b.flight?.flightNumber || 'N/A'}</td>
                    <td>{b.passengerCount} Seat(s)</td>
                    <td>₹{Number(b.totalAmount).toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${statusBadge}`}>{b.status}</span>
                    </td>
                    <td>{b.createdAt ? format(new Date(b.createdAt), 'MMM d, yyyy · HH:mm') : 'N/A'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
