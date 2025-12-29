document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    let activeCard = null;
    let map = null;

    // Helper to calculate the transformation for the FLIP animation
    // Note: Implementing a full FLIP from grid to fixed position manually is complex due to layout thrashing.
    // Instead, we will rely on a "state-based" approach where we toggle the class and let CSS handle the
    // visual change, but we need to manage the scroll position and "fake" the transition if we want it pixel-perfect.
    // For this "Jony Ive" level request, I'll implement a simplified but smooth expansion.

    cards.forEach(card => {
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

        const closeBtn = card.querySelector('.close-button');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop event bubbling
            collapseCard(card);
        });
    });

    function expandCard(card) {
        // Store current scroll position to restore later
        document.body.style.overflow = 'hidden'; // Lock body scroll

        activeCard = card;
        card.setAttribute('aria-expanded', 'true');

        // Add a placeholder to keep the grid layout intact (optional, but good for polish)
        // For now, we just expand the card. Since it becomes position:fixed, it pops out of flow.
        // We might want to add a "spacer" div if we want the other cards to stay put, but
        // covering them up is also a valid interaction pattern.

        card.classList.add('expanded');

        // Move focus to close button for accessibility
        const closeBtn = card.querySelector('.close-button');
        setTimeout(() => {
            if (closeBtn) closeBtn.focus();
        }, 100); // Small delay to allow transition to start/display change

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
        card.classList.remove('expanded');
        card.setAttribute('aria-expanded', 'false');
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
            attributionControl: false
        }).setView(coords, 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Custom minimalist marker
        const customIcon = L.divIcon({
            className: 'custom-pin',
            html: `<div style="width: 20px; height: 20px; background-color: #0071E3; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        L.marker(coords, { icon: customIcon }).addTo(map);
    }

    // Handle Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeCard) {
            collapseCard(activeCard);
        }
    });
});
