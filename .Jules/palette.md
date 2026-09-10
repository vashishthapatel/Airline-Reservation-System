## 2025-02-18 - ARIA Accessibility for Grid-based Seat Controls
**Learning:** Interactive seating charts using abbreviated labels (e.g. single letters/numbers) need comprehensive `aria-label` attributes (specifying seat number, class, price, and status) and `aria-pressed` toggle state to be understandable by screen readers.
**Action:** When building interactive grid/map UI elements, always provide descriptive `aria-label` strings combining key contextual fields and use `aria-pressed` on selectable toggle buttons.
