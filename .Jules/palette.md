## 2025-05-18 - Accessible Seat Map Buttons
**Learning:** Grid-based seat maps in airlines often present numbers without context for screen reader users. Adding detailed `aria-label` strings (number, class, price, availability status) alongside `aria-pressed` state provides complete context for screen readers when selecting seats.
**Action:** Always provide full status description in `aria-label` and use `aria-pressed` on custom grid toggle buttons like seat selection maps.
