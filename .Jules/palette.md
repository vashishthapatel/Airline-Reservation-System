## 2025-02-23 - Seat Selection Accessibility
**Learning:** Seat maps in interactive booking interfaces often display abbreviated labels (e.g., "1A", "12F") which fail to communicate seat class, price, and current availability status (booked/locked/selected/available) to assistive technologies like screen readers.
**Action:** Always provide descriptive `aria-label`, `aria-pressed`, and `aria-disabled` attributes on interactive grid seat elements to communicate seat number, class, formatted price, and current selection or availability state.
