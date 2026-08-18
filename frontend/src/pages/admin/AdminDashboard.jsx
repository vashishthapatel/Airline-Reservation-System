import { useState, useEffect } from 'react'
import { getDashboardStats } from '../../api/axios'
import StatsCard from '../../components/StatsCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Plane, Calendar, Users, DollarSign, ListOrdered, Award } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await getDashboardStats()
        if (res.data && res.data.success) {
          setStats(res.data.data)
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) return <LoadingSpinner />

  // Mock charts data based on total revenue / bookings
  const revenueData = [
    { name: 'Mon', Revenue: (stats?.totalRevenue * 0.1) || 12000 },
    { name: 'Tue', Revenue: (stats?.totalRevenue * 0.15) || 18000 },
    { name: 'Wed', Revenue: (stats?.totalRevenue * 0.12) || 15000 },
    { name: 'Thu', Revenue: (stats?.totalRevenue * 0.2) || 24000 },
    { name: 'Fri', Revenue: (stats?.totalRevenue * 0.18) || 22000 },
    { name: 'Sat', Revenue: (stats?.totalRevenue * 0.25) || 30000 },
    { name: 'Sun', Revenue: (stats?.totalRevenue * 0.3) || 36000 }
  ]

  const bookingTrend = [
    { name: 'Jan', Bookings: stats?.totalBookings || 12 },
    { name: 'Feb', Bookings: (stats?.totalBookings * 1.2) || 15 },
    { name: 'Mar', Bookings: (stats?.totalBookings * 1.5) || 20 },
    { name: 'Apr', Bookings: (stats?.totalBookings * 1.1) || 14 },
    { name: 'May', Bookings: (stats?.totalBookings * 1.8) || 22 },
    { name: 'Jun', Bookings: (stats?.totalBookings * 2.2) || 28 }
  ]

  const bookingStatusData = [
    { name: 'Confirmed', value: Number(stats?.confirmedBookings || 5), color: '#10B981' },
    { name: 'Pending', value: Number(stats?.todayBookings || 2), color: '#f59e0b' },
    { name: 'Cancelled', value: Number(stats?.cancelledBookings || 1), color: '#ef4444' }
  ]

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price || 0)
  }

  return (
    <div className="admin-layout">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <h2 className="gradient-text">SkyWay Admin</h2>
        </div>
        <a href="/admin" className="admin-nav-item active">
          <Plane size={16} /> Dashboard
        </a>
        <a href="/admin/flights" className="admin-nav-item">
          <ListOrdered size={16} /> Flights
        </a>
        <a href="/admin/users" className="admin-nav-item">
          <Users size={16} /> Users
        </a>
        <a href="/admin/bookings" className="admin-nav-item">
          <Calendar size={16} /> Bookings
        </a>
      </aside>

      {/* Main Admin Content */}
      <main className="admin-content animate-fadeInUp">
        <div className="page-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Real-time airline reservation overview, revenue records, and passenger analytics</p>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <StatsCard
            icon={<Plane size={20} />}
            title="Total Flights"
            value={stats?.totalFlights}
            subtitle={`${stats?.activeFlights} Active Flights`}
            color="#0E3A5D"
          />
          <StatsCard
            icon={<Calendar size={20} />}
            title="Total Bookings"
            value={stats?.totalBookings}
            subtitle={`${stats?.todayBookings} Bookings Today`}
            color="#B9894F"
          />
          <StatsCard
            icon={<Users size={20} />}
            title="Customers"
            value={stats?.totalCustomers}
            subtitle="Registered Users"
            color="#0E3A5D"
          />
          <StatsCard
            icon={<DollarSign size={20} />}
            title="Total Revenue"
            value={formatPrice(stats?.totalRevenue)}
            subtitle={`Today: ${formatPrice(stats?.todayRevenue)}`}
            color="#B9894F"
          />
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Revenue Chart */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Weekly Revenue Trend</h3>
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#0E3A5D" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#0E3A5D" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(20, 33, 45, 0.1)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#FFFCF7', border: '1px solid #D8E0E8', color: '#14212D' }} />
                  <Area type="monotone" dataKey="Revenue" stroke="#0E3A5D" fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bookings Monthly Bar Chart */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Monthly Booking Distribution</h3>
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer>
                <BarChart data={bookingTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(20, 33, 45, 0.1)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#FFFCF7', border: '1px solid #D8E0E8', color: '#14212D' }} />
                  <Bar dataKey="Bookings" fill="#B9894F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Booking Status Breakdown</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap' }}>
              <div style={{ width: '160px', height: '160px' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={bookingStatusData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {bookingStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {bookingStatusData.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: item.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{item.name}:</span>
                    <strong>{item.value} bookings</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
