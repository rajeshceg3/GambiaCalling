// js/animations.js
import { CONFIG } from './config.js';

/**
 * Sets up scroll-triggered animations using IntersectionObserver.
 * Handles the "in-view" state for cards and the parallax effect for the header.
 *
 * This module ensures that elements animate in as the user scrolls, providing a
 * "visual journey" feel. It also handles the parallax effect for the header text.
 *
 * CSP NOTE: We prioritize using CSS Custom Properties (Variables) via `style.setProperty`
 * rather than manipulating inline styles directly (e.g., `style.transform`).
 * This maintains a cleaner DOM and prepares for stricter CSP policies in the future,
 * although `style-src 'unsafe-inline'` is currently required for Leaflet.
 */
export function setupScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: `0px 0px ${CONFIG.UI.SCROLL_TRIGGER_MARGIN} 0px`, // Trigger slightly before it hits the bottom
        threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Calculate a delay based on the element's position in the viewport or a simple counter
                // We use a custom property to handle the stagger in CSS if we wanted,
                // but here we just use a timeout for the class addition.

                // Check for reduced motion preference
                const shouldAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                // We add a random variance to the delay to make it feel more organic, but only if motion is allowed
                const randomDelay = shouldAnimate ? Math.random() * CONFIG.ANIMATION.DELAY.SCROLL_TRIGGER_MAX : 0;

                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, randomDelay);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.card');
    const shouldAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    cards.forEach((card, index) => {
        // Add a base delay based on index to force a "wave" effect on initial load
        // This helps if multiple cards are in view at once
        if (shouldAnimate) {
            // Use CSS variable for clean CSP-friendly logic
            card.style.setProperty('--stagger-index', index);
        } else {
            card.style.setProperty('--stagger-index', 0);
        }
        observer.observe(card);
    });

    // Header Parallax Effect
    // We attach this to the scroll event for the header text
    const header = document.querySelector('.header-inner');
    if (header) {
        let ticking = false;

        window.addEventListener(
            'scroll',
            () => {
                const scrolled = window.pageYOffset;
                // Only animate if within range
                if (!ticking && scrolled < CONFIG.ANIMATION.PARALLAX.MAX_SCROLL) {
                    window.requestAnimationFrame(() => {
                        // Update the custom property to drive the CSS calculation
                        header.style.setProperty('--scroll-offset', scrolled);
                        ticking = false;
                    });
                    ticking = true;
                }
            },
            { passive: true }
        );
    }
}
