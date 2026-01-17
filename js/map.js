// js/map.js
import { mapState } from './state.js';
import { CONFIG } from './config.js';

/**
 * Initializes a Leaflet map within a specific container.
 * Cleans up any existing map instance before creating a new one to prevent memory leaks
 * and DOM conflicts.
 *
 * @param {string} containerId - The ID of the DOM element to hold the map.
 * @param {[number, number]} coords - The [latitude, longitude] coordinates for the map center and marker.
 * @param {string} slug - A unique identifier for the location (used for styling and accessibility).
 * @param {string} [title] - The human-readable title of the location.
 */
export function initMap(containerId, coords, slug, title) {
    if (mapState.currentMap) {
        mapState.currentMap.remove();
        mapState.currentMap = null;
    }

    const mapContainer = document.getElementById(containerId);
    if (!mapContainer) return;

    // CartoDB Voyager - Minimal & Clean
    const map = L.map(containerId, {
        zoomControl: false,
        attributionControl: false,
        dragging: !L.Browser.mobile, // Disable dragging on mobile to prevent scroll hijacking initially
        tap: !L.Browser.mobile,
    }).setView(coords, CONFIG.MAP.DEFAULT_ZOOM); // Zoom out slightly for context

    mapState.currentMap = map;

    // Add zoom control to top-right manually
    L.control.zoom({ position: 'topright' }).addTo(map);

    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
    });

    const removeLoading = () => {
        if (mapContainer) mapContainer.classList.remove('map-loading');
    };

    tileLayer.on('load', removeLoading);
    tileLayer.on('tileerror', removeLoading); // Ensure loading state is removed even on error

    tileLayer.addTo(map);

    // Custom Animated Marker
    const customIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div class="marker-pin marker-${slug}"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });

    // Provide accessible name for the marker
    const displayTitle = title || slug;
    const marker = L.marker(coords, {
        icon: customIcon,
        title: displayTitle, // Tooltip on hover
        alt: `Location marker for ${displayTitle}`, // For screen readers
        keyboard: true,
    }).addTo(map);

    // Advanced Marker Animation using Web Animations API
    // Wait for the map to be ready and use requestAnimationFrame to ensure the DOM element is created
    map.whenReady(() => {
        requestAnimationFrame(() => {
            const el = marker.getElement();
            // Check for reduced motion preference
            const shouldAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (el && shouldAnimate) {
                // Bounce and Pulse effect
                const entranceAnimation = el.animate(
                    [
                        { transform: 'translate3d(0, -50px, 0) scale(0)', opacity: 0 },
                        { transform: 'translate3d(0, 0, 0) scale(1.2)', opacity: 1, offset: 0.6 },
                        { transform: 'translate3d(0, -10px, 0) scale(0.9)', opacity: 1, offset: 0.8 },
                        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 },
                    ],
                    {
                        duration: CONFIG.ANIMATION.DURATION.MAP_ENTRANCE,
                        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                        fill: 'forwards',
                    }
                );

                // Add a subtle pulse after entrance
                // Use the Promise returned by the animation to chain the next one
                entranceAnimation.finished.then(() => {
                    const pin = el.querySelector('.marker-pin');
                    if (pin) {
                        pin.animate(
                            [{ boxShadow: '0 0 0 0 rgba(0,0,0,0.4)' }, { boxShadow: '0 0 0 10px rgba(0,0,0,0)' }],
                            {
                                duration: CONFIG.ANIMATION.DURATION.MAP_PULSE,
                                iterations: Infinity,
                            }
                        );
                    }
                });
            } else if (el) {
                // Ensure visibility if animation is skipped
                el.style.opacity = '1';
            }
        });
    });
}
