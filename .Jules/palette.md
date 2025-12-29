## 2024-05-23 - Card Keyboard Accessibility
**Learning:** Interactive cards that function as main navigation points were inaccessible to keyboard users, creating a "mouse-only" trap.
**Action:** When creating custom interactive containers (like cards), always add `tabindex="0"`, `role="button"` (or appropriate role), keyboard event handlers (Enter/Space), and manage focus transition (into the expanded state and back).
