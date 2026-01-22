/**
 * @file js/ui.js
 * @description Manages the primary user interface interactions, specifically the Card Expansion/Collapse logic.
 * @module UI
 * @requires map.js
 * @requires state.js
 */

import { initMap } from './map.js';
import { mapState } from './state.js';

/**
 * @type {HTMLElement|null} activeCard - The currently expanded card element, or null if none.
 */
let activeCard = null;

/**
 * @type {Function|null} trapFocusHandler - The bound event listener for the focus trap, stored to allow removal.
 */
let trapFocusHandler = null;

/**
 * Sets up all interactive behaviors for the cards.
 * This includes:
 * - Click handlers for expansion/collapse.
 * - Keyboard accessibility (Enter/Space to expand, Escape to close).
 * - ARIA attribute management (labelling).
 * - Focus trapping within expanded cards.
 *
 * @function setupCardInteractions
 */
export function setupCardInteractions() {
    const cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
        // Accessibility: Associate headers and location tags for robust labelling
        const title = card.querySelector('h2');
        const location = card.querySelector('.location-tag');

        if (title && location) {
            if (!title.id) {
                title.id = `${card.id}-title`;
            }
            if (!location.id) {
                location.id = `${card.id}-location`;
            }

            card.setAttribute('aria-labelledby', `${title.id} ${location.id}`);
        }

        // Configure Close Button
        const closeBtn = card.querySelector('.close-button');
        if (closeBtn) {
            closeBtn.setAttribute('title', 'Close card');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                collapseCard(card);
            });
        }

        // Card Click Handler
        card.addEventListener('click', (e) => {
            // Prevent triggering if clicking the close button or if a card is already active
            if (activeCard || e.target.closest('.close-button')) {
                return;
            }
            expandCard(card);
        });

        // Keyboard Activation (Enter/Space)
        card.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !activeCard) {
                e.preventDefault();
                expandCard(card);
            }
        });
    });

    // Global Escape Key Listener for closing modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeCard) {
            collapseCard(activeCard);
        }
    });
}

/**
 * Expands a card to fill the screen and initializes its map.
 *
 * **Tactical Overview:**
 * 1. Locks body scroll.
 * 2. Applies visual expansion classes.
 * 3. **Dynamic Role Switching:** Removes `role="button"` to avoid "Nested Interactive Controls" violation.
 * 4. Initializes Leaflet map via `requestAnimationFrame` for performance.
 * 5. Traps focus within the card boundary.
 *
 * @function expandCard
 * @param {HTMLElement} card - The card element to expand.
 */
function expandCard(card) {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('has-expanded-card');

    activeCard = card;
    card.setAttribute('aria-expanded', 'true');
    card.classList.add('expanded');

    // [CRITICAL] Accessibility: Dynamic Role Switching
    // When expanded, the card acts as a modal/region containing interactive elements (Map, Buttons).
    // Keeping role="button" would cause screen readers to treat children as part of a single button,
    // violating WCAG 4.1.2 (Nested Interactive Controls).
    // We remove the role and tabindex to transform it into a generic container.
    card.removeAttribute('role');
    card.removeAttribute('tabindex');
    card.removeAttribute('aria-expanded');

    // Focus Management: Wait for expansion animation to finish to prevent "focus flying".
    // The visual transition is driven by CSS.
    card.addEventListener(
        'animationend',
        () => {
            const closeBtn = card.querySelector('.close-button');
            if (closeBtn) {
                closeBtn.focus();
            }

            // Invalidate map size to ensure tiles render correctly in the new viewport dimensions
            if (mapState.currentMap) {
                mapState.currentMap.invalidateSize();
            }
        },
        { once: true }
    );

    // [CRITICAL] Focus Trap Implementation
    // Prevents keyboard users from tabbing outside the modal while it is open.
    const focusableElements = card.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        trapFocusHandler = function (e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        card.addEventListener('keydown', trapFocusHandler);
    }

    // Map Initialization
    // We utilize requestAnimationFrame to ensure the DOM has reconciled the 'display: block'
    // state of the container before Leaflet attempts to calculate dimensions.
    requestAnimationFrame(() => {
        const lat = card.getAttribute('data-lat');
        const lng = card.getAttribute('data-lng');
        const mapId = 'map-' + card.id.split('-')[1];
        // Extract slug from ID (card-kachikally -> kachikally)
        const slug = card.id.replace('card-', '');

        if (lat && lng && mapId) {
            // Apply visual loading state
            const container = document.getElementById(mapId);
            if (container) {
                container.classList.add('map-loading');
            }

            const title = card.querySelector('h2') ? card.querySelector('h2').textContent : slug;
            initMap(mapId, [parseFloat(lat), parseFloat(lng)], slug, title);
        }
    });
}

/**
 * Collapses the currently expanded card and resets state.
 *
 * **Tactical Overview:**
 * 1. Removes expansion classes.
 * 2. Restores `role="button"` for interaction.
 * 3. Releases focus trap.
 * 4. Destroys map instance to free memory.
 * 5. Returns focus to the card trigger.
 *
 * @function collapseCard
 * @param {HTMLElement} card - The card element to collapse.
 */
function collapseCard(card) {
    document.body.style.overflow = '';
    document.body.classList.remove('has-expanded-card');

    card.classList.remove('expanded');
    card.setAttribute('aria-expanded', 'false');

    // [CRITICAL] Accessibility: Restore Interactive Role
    // The card returns to being a single interactive trigger.
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');

    // Release Focus Trap
    if (trapFocusHandler) {
        card.removeEventListener('keydown', trapFocusHandler);
        trapFocusHandler = null;
    }

    activeCard = null;

    // Return focus to the card so the user doesn't lose their place in the DOM
    card.focus();

    // Clean up Leaflet instance
    if (mapState.currentMap) {
        mapState.currentMap.remove();
        mapState.currentMap = null;
    }
}
