export default function LoadingSpinner({ fullPage = true }) {
  if (fullPage) {
    return (
      <div className="spinner-container" style={{ minHeight: fullPage ? '60vh' : '200px' }}>
        <div className="spinner" />
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div className="spinner" style={{ width: 32, height: 32, borderWidth: 2 }} />
    </div>
  )
}
