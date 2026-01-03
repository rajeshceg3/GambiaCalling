document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    let activeCard = null;
    let map = null;
    let trapFocusHandler = null;

    // Helper to calculate the transformation for the FLIP animation
    // Note: Implementing a full FLIP from grid to fixed position manually is complex due to layout thrashing.
    // Instead, we will rely on a "state-based" approach where we toggle the class and let CSS handle the
    // visual change, but we need to manage the scroll position and "fake" the transition if we want it pixel-perfect.
    // For this "Jony Ive" level request, I'll implement a simplified but smooth expansion.

    cards.forEach((card) => {
        // Palette: Enhance accessibility
        // Ensure screen readers announce concise names by linking to title and location
        const title = card.querySelector('h2');
        const location = card.querySelector('.location-tag');

        if (title && location) {
            // Ensure unique IDs exist
            if (!title.id) title.id = `${card.id}-title`;
            if (!location.id) location.id = `${card.id}-location`;

            card.setAttribute('aria-labelledby', `${title.id} ${location.id}`);
        }

        const closeBtn = card.querySelector('.close-button');
        if (closeBtn) {
            // Add tooltip for mouse users
            closeBtn.setAttribute('title', 'Close card');

            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Stop event bubbling
                collapseCard(card);
            });
        }

        card.addEventListener('click', (e) => {
            // Prevent clicking if already expanding or if clicking the close button
            if (activeCard || e.target.closest('.close-button')) return;

            expandCard(card);
        });

        // Add keyboard support for card expansion
        card.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !activeCard) {
                e.preventDefault();
                expandCard(card);
            }
        });
    });

    function expandCard(card) {
        // Store current scroll position to restore later
        document.body.style.overflow = 'hidden'; // Lock body scroll
        document.body.classList.add('has-expanded-card'); // Add backdrop class

        activeCard = card;
        card.setAttribute('aria-expanded', 'true');
        card.classList.add('expanded');

        // Move focus to close button for accessibility
        const closeBtn = card.querySelector('.close-button');
        setTimeout(() => {
            if (closeBtn) closeBtn.focus();
        }, 300); // Small delay to allow transition to start/display change

        // Trap Focus Logic
        const focusableElements = card.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            trapFocusHandler = function(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        /* shift + tab */
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        /* tab */
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            };

            card.addEventListener('keydown', trapFocusHandler);
        }

        // Initialize Map after transition (delay to match CSS)
        setTimeout(() => {
            const lat = card.getAttribute('data-lat');
            const lng = card.getAttribute('data-lng');
            const mapId = 'map-' + card.id.split('-')[1];

            if (lat && lng && mapId) {
                initMap(mapId, [parseFloat(lat), parseFloat(lng)]);
            }
        }, 500);
    }

    function collapseCard(card) {
        document.body.style.overflow = ''; // Unlock body scroll
        document.body.classList.remove('has-expanded-card'); // Remove backdrop class

        card.classList.remove('expanded');
        card.setAttribute('aria-expanded', 'false');

        // Remove trap focus listener
        if (trapFocusHandler) {
            card.removeEventListener('keydown', trapFocusHandler);
            trapFocusHandler = null;
        }

        activeCard = null;

        // Return focus to the card
        card.focus();

        // Destroy map to save resources and avoid ID conflicts
        if (map) {
            map.remove();
            map = null;
        }
    }

    function initMap(containerId, coords) {
        // Clean up existing map instance if any (though we usually destroy on close)
        if (map) {
            map.remove();
        }

        const mapContainer = document.getElementById(containerId);
        if (!mapContainer) return;

        // Custom minimal style (using CartoDB Voyager for a cleaner look)
        map = L.map(containerId, {
            zoomControl: false,
            attributionControl: false,
        }).setView(coords, 14);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20,
        }).addTo(map);

        // Custom minimalist marker with pastel accent color
        // We can dynamically get the color from the card's visual placeholder or just use a standard brand color
        // For "World Class", let's use the accent color.

        const customIcon = L.divIcon({
            className: 'custom-pin',
            html: `<div style="
                width: 24px;
                height: 24px;
                background-color: var(--text-accent, #2980B9);
                border-radius: 50%;
                border: 4px solid white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                transition: transform 0.3s ease;
            "></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });

        const marker = L.marker(coords, { icon: customIcon }).addTo(map);

        // Add a simple animation to the marker
        setTimeout(() => {
            const el = marker.getElement();
            if (el) {
                el.style.transform += ' scale(1)';
                el.animate(
                    [
                        { transform: 'scale(0)', opacity: 0 },
                        { transform: 'scale(1)', opacity: 1 },
                    ],
                    {
                        duration: 600,
                        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }
                );
            }
        }, 100);
    }

    // Handle Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeCard) {
            collapseCard(activeCard);
        }
    });
});
