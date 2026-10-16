export default function SeatMap({ seats, selectedSeats, onSeatClick, maxSelection = 1, lockingSeatId = null }) {
  const firstClass = seats.filter(s => s.seatClass === 'FIRST')
  const business   = seats.filter(s => s.seatClass === 'BUSINESS')
  const economy    = seats.filter(s => s.seatClass === 'ECONOMY')

  const isSelected = (seatId) => selectedSeats.some(s => s.id === seatId)

  const handleClick = (seat) => {
    if (seat.status === 'BOOKED' || seat.status === 'LOCKED') return
    onSeatClick(seat)
  }

  const getSeatClass = (seat) => {
    if (seat.status === 'BOOKED' || seat.status === 'LOCKED') return 'seat-btn seat-booked'
    if (isSelected(seat.id)) return 'seat-btn seat-selected'
    return 'seat-btn seat-available'
  }

  const getSeatStatusText = (seat) => {
    if (seat.status === 'BOOKED' || seat.status === 'LOCKED') return 'Booked'
    if (isSelected(seat.id)) return 'Selected'
    return 'Available'
  }

  const formatCabinClass = (className) => {
    if (!className) return ''
    return className.charAt(0) + className.slice(1).toLowerCase()
  }

  const renderSeats = (seatList, cols) => {
    const rows = {}
    seatList.forEach(seat => {
      const row = seat.seatNumber.replace(/[A-F]$/, '')
      if (!rows[row]) rows[row] = []
      rows[row].push(seat)
    })

    return Object.entries(rows).map(([row, rowSeats]) => (
      <div key={row} style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '0.5rem', marginBottom: '0.5rem' }}>
        {rowSeats.map(seat => {
          const statusText = getSeatStatusText(seat)
          const cabinText = formatCabinClass(seat.seatClass)
          const formattedPrice = Number(seat.price).toLocaleString('en-IN')
          const ariaLabel = `Seat ${seat.seatNumber}, ${cabinText} Class, ${statusText}, ₹${formattedPrice}`

          return (
            <button
              key={seat.id}
              className={getSeatClass(seat)}
              onClick={() => handleClick(seat)}
              title={`${seat.seatNumber} (${cabinText}) - ₹${formattedPrice}`}
              aria-label={ariaLabel}
              aria-pressed={isSelected(seat.id)}
              disabled={seat.status === 'BOOKED' || seat.status === 'LOCKED' || lockingSeatId === seat.id}
            >
              {lockingSeatId === seat.id ? '...' : seat.seatNumber.replace(/^[FBE]\d+/, '')}
            </button>
          )
        })}
      </div>
    ))
  }

  return (
    <div className="seat-map-container">
      {/* Aircraft nose */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '2rem' }}>
        <span aria-hidden="true">✈️</span>
      </div>

      {firstClass.length > 0 && (
        <div className="seat-class-section">
          <div className="seat-class-title">
            <span><span aria-hidden="true">👑 </span>First Class</span>
          </div>
          {renderSeats(firstClass, 4)}
        </div>
      )}

      {business.length > 0 && (
        <div className="seat-class-section">
          <div className="seat-class-title">
            <span><span aria-hidden="true">💼 </span>Business Class</span>
          </div>
          {renderSeats(business, 4)}
        </div>
      )}

      {economy.length > 0 && (
        <div className="seat-class-section">
          <div className="seat-class-title">
            <span><span aria-hidden="true">🪑 </span>Economy Class</span>
          </div>
          {renderSeats(economy, 6)}
        </div>
      )}

      {/* Legend */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'rgba(var(--primary-rgb), 0.14)', borderColor: 'rgba(var(--primary-rgb), 0.5)' }} />
          Available
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'rgba(16,185,129,0.3)', borderColor: '#10B981' }} />
          Selected
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'rgba(148, 163, 184, 0.08)', borderColor: 'rgba(148, 163, 184, 0.16)' }} />
          Booked
        </div>
      </div>
    </div>
  )
}
