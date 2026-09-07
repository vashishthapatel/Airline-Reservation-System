# Palette's Journal - Critical UX & Accessibility Learnings

## 2025-05-18 - Grid & Map Component Accessibility Pattern
**Learning:** Interactive grid elements (e.g., flight seat selection maps) displaying short alphanumeric codes rely heavily on visual layout and hover states. Screen reader users miss seat status, pricing, and class context without explicit ARIA labels and toggle states.
**Action:** Always provide full composite `aria-label` strings (e.g. `Seat F1, first class, ₹15,000, Available`) and `aria-pressed` toggle state attributes on interactive selection buttons in custom map/grid UI components.
