## 2024-05-23 - Card Keyboard Accessibility
**Learning:** Interactive cards that function as main navigation points were inaccessible to keyboard users, creating a "mouse-only" trap.
**Action:** When creating custom interactive containers (like cards), always add `tabindex="0"`, `role="button"` (or appropriate role), keyboard event handlers (Enter/Space), and manage focus transition (into the expanded state and back).
## 2024-05-24 - Concise Card Names
**Learning:** Cards with rich content (headings, prose) can be noisy for screen readers if the entire content is announced as the accessible name.
**Action:** Use `aria-labelledby` to point specifically to the card's title and subtitle, ensuring users can quickly scan the list.
