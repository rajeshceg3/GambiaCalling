// js/map.js
import { mapState } from './state.js';

export function initMap(containerId, coords, slug) {
    // Clean up existing map instance if any (though we usually destroy on close)
    if (mapState.currentMap) {
        mapState.currentMap.remove();
        mapState.currentMap = null;
    }

    const mapContainer = document.getElementById(containerId);
    if (!mapContainer) return;

    // Custom minimal style (using CartoDB Voyager for a cleaner look)
    const map = L.map(containerId, {
        zoomControl: false,
        attributionControl: false,
    }).setView(coords, 14);

    mapState.currentMap = map;

    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
    });

    tileLayer.on('load', () => {
        if (mapContainer) mapContainer.classList.remove('map-loading');
    });

    tileLayer.addTo(map);

    // Custom minimalist marker
    // We use a CSS class for the color to avoid inline styles (CSP compliance)
    const customIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div class="marker-pin marker-${slug}"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });

    const marker = L.marker(coords, { icon: customIcon }).addTo(map);

    // Add a simple animation to the marker
    setTimeout(() => {
        const el = marker.getElement();
        if (el) {
            // Use CSS class or just let the CSS transition handle it if we toggle a class
            // But here we want a specific entrance animation.
            // transform scale is safe for performance.
            // CSP: animate() API is safe.
            el.animate(
                [
                    { transform: 'translate3d(0,0,0) scale(0)', opacity: 0 },
                    { transform: 'translate3d(0,0,0) scale(1)', opacity: 1 },
                ],
                {
                    duration: 600,
                    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                    fill: 'forwards',
                }
            );
        }
    }, 100);
}
