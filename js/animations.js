// js/animations.js

export function setupScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a staggered delay based on the index relative to the current batch
                // We can't easily know the batch index, but we can just use a small delay
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, index * 100); // 100ms stagger for elements appearing at the same time

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => observer.observe(card));
}
