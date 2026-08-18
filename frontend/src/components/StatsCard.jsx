export default function StatsCard({ icon, title, value, subtitle, color = '#0E3A5D', trend }) {
  return (
    <div className="stats-card">
      <div className="stats-icon" style={{ background: `${color}20`, color }}>
        {icon}
      </div>
      <div className="stats-value">{value ?? '—'}</div>
      <div className="stats-title">{title}</div>
      {subtitle && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{subtitle}</div>}
      {trend && (
        <div style={{ fontSize: '0.8rem', color: trend > 0 ? 'var(--success)' : 'var(--error)', marginTop: '0.5rem', fontWeight: 600 }}>
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}% from last month
        </div>
      )}
    </div>
  )
}
