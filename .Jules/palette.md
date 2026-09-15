## 2025-02-23 - Seat Map Grid Accessibility
**Learning:** In interactive seat layout maps, abbreviated seat numbers (e.g. showing 'A' instead of '12A') leave screen reader users without row, cabin class, price, or selection state context.
**Action:** Always provide rich, explicit `aria-label`s (including seat number, cabin class, formatted price, and status) and `aria-pressed` attributes on individual seat buttons within seat maps.
