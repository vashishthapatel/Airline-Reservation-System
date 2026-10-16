# Palette's UX Journal

## 2025-05-18 - Interactive Grid Buttons Lack Screen Reader Context
**Learning:** Custom interactive visual grids (like aircraft seat maps) often reduce button labels to minimal seat numbers or letters (e.g. "1" or "A"), rendering them opaque to screen reader users without full context (class, price, selection state, availability).
**Action:** Always provide explicit `aria-label` strings on seat/grid items including item identifier, class/category, availability status, and formatted cost, along with `aria-pressed` for selection states.
