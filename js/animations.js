// js/animations.js

/**
 * Sets up scroll-triggered animations using IntersectionObserver.
 * Handles the "in-view" state for cards and the parallax effect for the header.
 *
 * This module ensures that elements animate in as the user scrolls, providing a
 * "visual journey" feel. It also handles the parallax effect for the header text.
 */
export function setupScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before it hits the bottom
        threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Calculate a delay based on the element's position in the viewport or a simple counter
                // We use a custom property to handle the stagger in CSS if we wanted,
                // but here we just use a timeout for the class addition.

                // We add a random variance to the delay to make it feel more organic
                const randomDelay = Math.random() * 150;

                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, randomDelay);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        // Add a base delay based on index to force a "wave" effect on initial load
        // This helps if multiple cards are in view at once
        card.style.transitionDelay = `${index * 50}ms`;
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
                if (!ticking && scrolled < 800) {
                    window.requestAnimationFrame(() => {
                        // Parallax speed: slower than scroll
                        // Add a subtle scale effect for depth
                        const scale = 1 - scrolled * 0.0005;
                        header.style.transform = `translateY(${scrolled * 0.5}px) scale(${Math.max(0.9, scale)})`;
                        header.style.opacity = 1 - scrolled / 600;
                        // Add blur as it goes out of view
                        header.style.filter = `blur(${scrolled / 50}px)`;
                        ticking = false;
                    });
                    ticking = true;
                }
            },
            { passive: true }
        );
    }
}
