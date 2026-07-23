import { useState, useEffect } from 'react'
import { getUsersList, deleteUser } from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Plane, ListOrdered, Users, Calendar, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await getUsersList()
      if (res.data && res.data.success) {
        setUsers(res.data.data)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load user list!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this user account?')
    if (!confirm) return

    try {
      const res = await deleteUser(id)
      if (res.data && res.data.success) {
        toast.success('User deleted successfully!')
        fetchUsers()
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete user!')
    }
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

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
        <a href="/admin/users" className="admin-nav-item active">
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
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">View all registered passengers and administrator accounts</p>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', width: '300px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
          </div>
        </div>

        {/* Users Table */}
        <div className="table-wrapper">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Account Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>
                    <span className={`badge ${user.role === 'ADMIN' ? 'badge-purple' : 'badge-info'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-danger btn-sm"
                      onClick={() => handleDelete(user.id)}
                      disabled={user.role === 'ADMIN'}
                      title={user.role === 'ADMIN' ? 'Admin user cannot be deleted' : 'Delete user'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
