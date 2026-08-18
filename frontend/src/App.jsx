import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import FlightSearch from './pages/FlightSearch'
import SeatSelection from './pages/SeatSelection'
import PassengerForm from './pages/PassengerForm'
import Payment from './pages/Payment'
import BookingConfirmation from './pages/BookingConfirmation'
import BookingHistory from './pages/BookingHistory'
import Profile from './pages/Profile'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminFlights from './pages/admin/AdminFlights'
import AdminUsers from './pages/admin/AdminUsers'
import AdminBookings from './pages/admin/AdminBookings'

export default function App() {
  return (
    <AuthProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#14212D',
              border: '1px solid rgba(20, 33, 45, 0.12)',
              boxShadow: '0 8px 24px rgba(20, 33, 45, 0.12)'
            }
          }}
        />

        {/* Global Navigation bar */}
        <Navbar />

        {/* Main Content Area */}
        <div style={{ flex: 1, paddingTop: '73px' }}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Passenger routes */}
            <Route path="/flights/search" element={
              <ProtectedRoute>
                <FlightSearch />
              </ProtectedRoute>
            } />
            <Route path="/flights/:id/seats" element={
              <ProtectedRoute>
                <SeatSelection />
              </ProtectedRoute>
            } />
            <Route path="/booking/passengers" element={
              <ProtectedRoute>
                <PassengerForm />
              </ProtectedRoute>
            } />
            <Route path="/booking/payment" element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } />
            <Route path="/booking/ticket/:bookingId" element={
              <ProtectedRoute>
                <BookingConfirmation />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Admin-only routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/flights" element={
              <AdminRoute>
                <AdminFlights />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            } />
            <Route path="/admin/bookings" element={
              <AdminRoute>
                <AdminBookings />
              </AdminRoute>
            } />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  )
}
