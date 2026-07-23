import { useState, useEffect } from 'react'
import { getAllFlights, createFlight, updateFlight, deleteFlight, getAirports, getAircraftList } from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Plane, ListOrdered, Users, Calendar, Plus, Edit, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function AdminFlights() {
  const [flights, setFlights] = useState([])
  const [airports, setAirports] = useState([])
  const [aircrafts, setAircrafts] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editFlightId, setEditFlightId] = useState(null)
  
  // Form Fields
  const [flightNumber, setFlightNumber] = useState('')
  const [selectedAircraftId, setSelectedAircraftId] = useState('')
  const [selectedOriginId, setSelectedOriginId] = useState('')
  const [selectedDestId, setSelectedDestId] = useState('')
  const [departureTime, setDepartureTime] = useState('')
  const [arrivalTime, setArrivalTime] = useState('')
  const [basePrice, setBasePrice] = useState('')

  const loadAllData = async () => {
    setLoading(true)
    try {
      const flightRes = await getAllFlights()
      if (flightRes.data && flightRes.data.success) {
        setFlights(flightRes.data.data)
      }

      const airportRes = await getAirports()
      if (airportRes.data && airportRes.data.success) {
        setAirports(airportRes.data.data)
      }

      const aircraftRes = await getAircraftList()
      if (aircraftRes.data && aircraftRes.data.success) {
        setAircrafts(aircraftRes.data.data)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load flight dashboard data!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [])

  const openAddModal = () => {
    setEditFlightId(null)
    setFlightNumber('')
    setSelectedAircraftId(aircrafts[0]?.id || '')
    setSelectedOriginId(airports[0]?.id || '')
    setSelectedDestId(airports[1]?.id || '')
    setDepartureTime('')
    setArrivalTime('')
    setBasePrice('')
    setIsModalOpen(true)
  }

  const openEditModal = (flight) => {
    setEditFlightId(flight.id)
    setFlightNumber(flight.flightNumber)
    
    // Find matching options
    const aircraft = aircrafts.find(a => a.model === flight.aircraftModel)
    const origin = airports.find(ap => ap.iataCode === flight.originCode)
    const dest = airports.find(ap => ap.iataCode === flight.destinationCode)
    
    setSelectedAircraftId(aircraft?.id || '')
    setSelectedOriginId(origin?.id || '')
    setSelectedDestId(dest?.id || '')
    setDepartureTime(flight.departureTime.slice(0, 16))
    setArrivalTime(flight.arrivalTime.slice(0, 16))
    setBasePrice(flight.basePrice)
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    if (selectedOriginId === selectedDestId) {
      toast.error('Origin and Destination airports must be different!')
      return
    }

    const flightData = {
      flightNumber,
      aircraftId: parseInt(selectedAircraftId),
      originAirportId: parseInt(selectedOriginId),
      destinationAirportId: parseInt(selectedDestId),
      departureTime,
      arrivalTime,
      basePrice: parseFloat(basePrice)
    }

    try {
      if (editFlightId) {
        // Update flight
        const res = await updateFlight(editFlightId, flightData)
        if (res.data && res.data.success) {
          toast.success('Flight updated successfully!')
          setIsModalOpen(false)
          loadAllData()
        }
      } else {
        // Create flight
        const res = await createFlight(flightData)
        if (res.data && res.data.success) {
          toast.success('Flight created with automated seats!')
          setIsModalOpen(false)
          loadAllData()
        }
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to submit flight details!')
    }
  }

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this flight?')
    if (!confirm) return

    try {
      const res = await deleteFlight(id)
      if (res.data && res.data.success) {
        toast.success('Flight deleted successfully!')
        loadAllData()
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Cannot delete flight with booked/locked seats!')
    }
  }

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
        <a href="/admin/flights" className="admin-nav-item active">
          <ListOrdered size={16} /> Flights
        </a>
        <a href="/admin/users" className="admin-nav-item">
          <Users size={16} /> Users
        </a>
        <a href="/admin/bookings" className="admin-nav-item">
          <Calendar size={16} /> Bookings
        </a>
      </aside>

      {/* Main Content */}
      <main className="admin-content animate-fadeInUp">
        <div className="page-header">
          <div>
            <h1 className="page-title">Flight Management</h1>
            <p className="page-subtitle">Add, edit, update, or remove flight schedules and view seat counts</p>
          </div>
          <button className="btn-primary" onClick={openAddModal}>
            <Plus size={16} /> Add Flight
          </button>
        </div>

        {/* Flight Table */}
        <div className="table-wrapper">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Flight No</th>
                <th>Aircraft</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Departure</th>
                <th>Base Fare</th>
                <th>Seats</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map(flight => (
                <tr key={flight.id}>
                  <td><strong>{flight.flightNumber}</strong></td>
                  <td>{flight.aircraftModel}</td>
                  <td>{flight.originCity} ({flight.originCode})</td>
                  <td>{flight.destinationCity} ({flight.destinationCode})</td>
                  <td>{format(new Date(flight.departureTime), 'MMM d · HH:mm')}</td>
                  <td>₹{Number(flight.basePrice).toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`badge ${flight.availableSeats > 10 ? 'badge-success' : 'badge-warning'}`}>
                      {flight.availableSeats} Available
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-ghost btn-sm" onClick={() => openEditModal(flight)}>
                        <Edit size={14} />
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(flight.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{editFlightId ? 'Edit Flight' : 'Add New Flight'}</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Flight Number</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. SW204"
                    value={flightNumber}
                    onChange={e => setFlightNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Aircraft</label>
                  <select
                    className="input-field"
                    value={selectedAircraftId}
                    onChange={e => setSelectedAircraftId(e.target.value)}
                    required
                  >
                    {aircrafts.map(ac => (
                      <option key={ac.id} value={ac.id}>{ac.model} ({ac.totalSeats} seats)</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Origin Airport</label>
                    <select
                      className="input-field"
                      value={selectedOriginId}
                      onChange={e => setSelectedOriginId(e.target.value)}
                      required
                    >
                      {airports.map(ap => (
                        <option key={ap.id} value={ap.id}>{ap.city} ({ap.iataCode})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Destination Airport</label>
                    <select
                      className="input-field"
                      value={selectedDestId}
                      onChange={e => setSelectedDestId(e.target.value)}
                      required
                    >
                      {airports.map(ap => (
                        <option key={ap.id} value={ap.id}>{ap.city} ({ap.iataCode})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Departure Time</label>
                    <input
                      type="datetime-local"
                      className="input-field"
                      value={departureTime}
                      onChange={e => setDepartureTime(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Arrival Time</label>
                    <input
                      type="datetime-local"
                      className="input-field"
                      value={arrivalTime}
                      onChange={e => setArrivalTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Base Price (INR)</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="e.g. 5500"
                    value={basePrice}
                    onChange={e => setBasePrice(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                  {editFlightId ? 'Update Flight' : 'Add Flight Schedule'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
