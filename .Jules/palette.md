# Palette's Journal - Critical Learnings

## 2025-02-18 - Accessible Interactive Grids (Seat Selection)
**Learning:** Dynamic seat maps relying on visual color indicators or short text labels fail screen reader navigation because class, price, and status are not announced.
**Action:** Include comprehensive `aria-label` strings on seat selection buttons with identifier, class, price, and status, as well as `aria-pressed` state attributes.
