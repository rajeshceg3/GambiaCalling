// js/ui.js
import { initMap } from './map.js';
import { mapState } from './state.js';

let activeCard = null;
let trapFocusHandler = null;

export function setupCardInteractions() {
    const cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
        // Palette: Enhance accessibility
        const title = card.querySelector('h2');
        const location = card.querySelector('.location-tag');

        if (title && location) {
            if (!title.id) title.id = `${card.id}-title`;
            if (!location.id) location.id = `${card.id}-location`;

            card.setAttribute('aria-labelledby', `${title.id} ${location.id}`);
        }

        const closeBtn = card.querySelector('.close-button');
        if (closeBtn) {
            closeBtn.setAttribute('title', 'Close card');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                collapseCard(card);
            });
        }

        card.addEventListener('click', (e) => {
            if (activeCard || e.target.closest('.close-button')) return;
            expandCard(card);
        });

        card.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !activeCard) {
                e.preventDefault();
                expandCard(card);
            }
        });
    });

    // Handle Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeCard) {
            collapseCard(activeCard);
        }
    });
}

function expandCard(card) {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('has-expanded-card');

    activeCard = card;
    card.setAttribute('aria-expanded', 'true');
    card.classList.add('expanded');

    const closeBtn = card.querySelector('.close-button');
    setTimeout(() => {
        if (closeBtn) closeBtn.focus();
    }, 300);

    // Trap Focus
    const focusableElements = card.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        trapFocusHandler = function (e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        card.addEventListener('keydown', trapFocusHandler);
    }

    // Initialize Map
    // Match the CSS animation delay (0.1s) + duration (0.3s) = 0.4s total, but we can start earlier to fetch tiles
    setTimeout(() => {
        const lat = card.getAttribute('data-lat');
        const lng = card.getAttribute('data-lng');
        const mapId = 'map-' + card.id.split('-')[1];
        // Extract slug from ID (card-kachikally -> kachikally)
        const slug = card.id.replace('card-', '');

        if (lat && lng && mapId) {
            // Add loading state
            const container = document.getElementById(mapId);
            if (container) container.classList.add('map-loading');

            initMap(mapId, [parseFloat(lat), parseFloat(lng)], slug);
        }
    }, 150); // Reduced delay to feel snappier
}

function collapseCard(card) {
    document.body.style.overflow = '';
    document.body.classList.remove('has-expanded-card');

    card.classList.remove('expanded');
    card.setAttribute('aria-expanded', 'false');

    if (trapFocusHandler) {
        card.removeEventListener('keydown', trapFocusHandler);
        trapFocusHandler = null;
    }

    activeCard = null;
    card.focus();

    if (mapState.currentMap) {
        mapState.currentMap.remove();
        mapState.currentMap = null;
    }
}
