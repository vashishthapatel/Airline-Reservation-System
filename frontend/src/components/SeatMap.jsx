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

  const getClassLabel = (className) => {
    if (className === 'FIRST') return 'First Class'
    if (className === 'BUSINESS') return 'Business Class'
    return 'Economy Class'
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
          const selected = isSelected(seat.id)
          const isBooked = seat.status === 'BOOKED' || seat.status === 'LOCKED'
          const priceFormatted = `₹${Number(seat.price).toLocaleString('en-IN')}`
          const classLabel = getClassLabel(seat.seatClass)
          const statusText = isBooked ? 'Booked' : selected ? 'Selected' : 'Available'
          const ariaLabel = `Seat ${seat.seatNumber}, ${classLabel}, ${priceFormatted}, ${statusText}`

          return (
            <button
              key={seat.id}
              type="button"
              className={getSeatClass(seat)}
              onClick={() => handleClick(seat)}
              title={`${seat.seatNumber} - ${priceFormatted}`}
              aria-label={ariaLabel}
              aria-pressed={selected}
              disabled={isBooked || lockingSeatId === seat.id}
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
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '2rem' }}>✈️</div>

      {firstClass.length > 0 && (
        <div className="seat-class-section">
          <div className="seat-class-title">
            <span>👑 First Class</span>
          </div>
          {renderSeats(firstClass, 4)}
        </div>
      )}

      {business.length > 0 && (
        <div className="seat-class-section">
          <div className="seat-class-title">
            <span>💼 Business Class</span>
          </div>
          {renderSeats(business, 4)}
        </div>
      )}

      {economy.length > 0 && (
        <div className="seat-class-section">
          <div className="seat-class-title">
            <span>🪑 Economy Class</span>
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
