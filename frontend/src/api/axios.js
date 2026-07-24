import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor: add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('airline_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.endsWith('/auth/login')
      if (!isLoginRequest) {
        localStorage.removeItem('airline_user')
        localStorage.removeItem('airline_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)

// ── Flights ───────────────────────────────────
export const searchFlights = (params) => api.get('/flights/search', { params })
export const getFlightById = (id) => api.get(`/flights/${id}`)
export const getFlightSeats = (id) => api.get(`/flights/${id}/seats`)
export const getAllFlights = () => api.get('/flights')
export const createFlight = (data) => api.post('/flights', data)
export const updateFlight = (id, data) => api.put(`/flights/${id}`, data)
export const deleteFlight = (id) => api.delete(`/flights/${id}`)

// ── Bookings ──────────────────────────────────
export const createBooking = (data) => api.post('/bookings', data)
export const getMyBookings = () => api.get('/bookings/my')
export const getBookingById = (id) => api.get(`/bookings/${id}`)
export const cancelBooking = (id) => api.delete(`/bookings/${id}`)

// ── Payments ──────────────────────────────────
export const processPayment = (data) => api.post('/payments/process', data)
export const getPaymentByBookingId = (id) => api.get(`/payments/booking/${id}`)

// ── Airports ──────────────────────────────────
export const getAirports = () => api.get('/airports')
export const searchAirports = (q) => api.get('/airports/search', { params: { q } })

// ── Admin ─────────────────────────────────────
export const getDashboardStats = () => api.get('/admin/dashboard')
export const getRevenueReport = (period) => api.get('/admin/reports/revenue', { params: { period } })
export const getAllBookings = () => api.get('/admin/bookings')
export const getUsersList = () => api.get('/admin/users')
export const deleteUser = (id) => api.delete(`/admin/users/${id}`)
export const getAdminAirports = () => api.get('/admin/airports')
export const createAirport = (data) => api.post('/admin/airports', data)
export const deleteAirport = (id) => api.delete(`/admin/airports/${id}`)
export const getAircraftList = () => api.get('/admin/aircraft')
export const createAircraft = (data) => api.post('/admin/aircraft', data)
export const deleteAircraft = (id) => api.delete(`/admin/aircraft/${id}`)

export default api
