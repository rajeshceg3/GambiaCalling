## 2024-05-23 - Focus Management in SPAs
**Learning:** Single Page Applications (or dynamic views like this stack) often forget to manage focus. When a user opens a modal or panel, their focus is often left behind on the trigger or lost to the body, disorienting screen reader and keyboard users.
**Action:** Always implement a focus loop: Trigger -> Open Panel -> Focus Close Button/Content -> Close Panel -> Focus Trigger.
