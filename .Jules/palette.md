## 2024-05-23 - Card Keyboard Accessibility

**Learning:** Interactive cards that function as main navigation points were inaccessible to keyboard users, creating a "mouse-only" trap.
**Action:** When creating custom interactive containers (like cards), always add `tabindex="0"`, `role="button"` (or appropriate role), keyboard event handlers (Enter/Space), and manage focus transition (into the expanded state and back).

## 2024-05-24 - Concise Card Names

**Learning:** Cards with rich content (headings, prose) can be noisy for screen readers if the entire content is announced as the accessible name.
**Action:** Use `aria-labelledby` to point specifically to the card's title and subtitle, ensuring users can quickly scan the list.

## 2025-12-31 - Color Contrast in Light Themes

**Learning:** In "clean" or Apple-inspired light themes, secondary text colors often fail WCAG AA contrast ratios (e.g. `#86868B` on white is ~3.6:1), compromising readability for many users.
**Action:** Use slightly darker greys (e.g. `#6E6E73` ~5.1:1) that maintain the visual hierarchy while ensuring accessibility. "Invisible" design must still be visible.

## 2025-01-20 - Respecting Motion Sensitivity

**Learning:** High-fidelity animations (like FLIP or large transforms) can trigger vestibular disorders. "Delight" for one user is "dizziness" for another.
**Action:** Always include a `@media (prefers-reduced-motion: reduce)` block that disables or significantly speeds up transitions and animations.
