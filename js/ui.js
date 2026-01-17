// js/ui.js
import { initMap } from './map.js';
import { mapState } from './state.js';
import { CONFIG } from './config.js';

let activeCard = null;
let trapFocusHandler = null;

/**
 * Sets up all interactive behaviors for the cards.
 * This includes:
 * - Click handlers for expansion/collapse.
 * - Keyboard accessibility (Enter/Space to expand, Escape to close).
 * - ARIA attribute management.
 * - Focus trapping within expanded cards.
 */
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

/**
 * Expands a card to fill the screen and initializes its map.
 * Handles:
 * - Visual expansion animation (via CSS classes).
 * - Focus management (trapping focus).
 * - Map initialization.
 * - Body scroll locking.
 *
 * @param {HTMLElement} card - The card element to expand.
 */
function expandCard(card) {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('has-expanded-card');

    activeCard = card;
    card.setAttribute('aria-expanded', 'true');
    card.classList.add('expanded');

    // Focus Management: Wait for expansion animation to finish to prevent "focus flying"
    // The card uses a CSS animation for expansion
    card.addEventListener(
        'animationend',
        () => {
            const closeBtn = card.querySelector('.close-button');
            if (closeBtn) closeBtn.focus();

            // Ensure map size is correct after animation
            if (mapState.currentMap) {
                mapState.currentMap.invalidateSize();
            }
        },
        { once: true }
    );

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
    // We start initialization in the next frame to allow the browser to register the
    // display:block change, but we don't wait for the full animation to finish
    // so we can preload tiles while the card expands.
    requestAnimationFrame(() => {
        const lat = card.getAttribute('data-lat');
        const lng = card.getAttribute('data-lng');
        const mapId = 'map-' + card.id.split('-')[1];
        // Extract slug from ID (card-kachikally -> kachikally)
        const slug = card.id.replace('card-', '');

        if (lat && lng && mapId) {
            // Add loading state
            const container = document.getElementById(mapId);
            if (container) container.classList.add('map-loading');

            const title = card.querySelector('h2') ? card.querySelector('h2').textContent : slug;
            initMap(mapId, [parseFloat(lat), parseFloat(lng)], slug, title);
        }
    });
}

/**
 * Collapses the currently expanded card.
 * Handles:
 * - Removing CSS classes.
 * - Restoring body scroll.
 * - Removing focus trap.
 * - Cleaning up the map instance.
 * - Returning focus to the card.
 *
 * @param {HTMLElement} card - The card element to collapse.
 */
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
