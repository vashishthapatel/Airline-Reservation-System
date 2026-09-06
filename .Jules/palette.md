## 2024-05-20 - Interactive Seat Map ARIA Accessibility
**Learning:** Matrix-style seat maps often render abbreviated button labels (e.g. "A", "1") for visual space, making them uninformative or confusing for screen reader and keyboard users without detailed ARIA attributes and toggle states.
**Action:** Always provide comprehensive `aria-label` strings (including seat number, cabin class, formatted price, and status) and `aria-pressed` toggle attributes on interactive seat map buttons.
