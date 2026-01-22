/**
 * @file js/main.js
 * @description Application Entry Point. Initializes global subsystems, event listeners, and Service Worker.
 * @module Main
 * @requires ui.js
 * @requires animations.js
 * @requires error-handler.js
 */

import { setupCardInteractions } from './ui.js';
import { setupScrollAnimations } from './animations.js';
import { setupGlobalErrorHandling } from './error-handler.js';

// Initialize safety nets immediately to catch boot errors
setupGlobalErrorHandling();

/**
 * Service Worker Registration.
 * Implements a "Stale-While-Revalidate" strategy via the SW for offline resilience.
 * Registration is deferred until the 'load' event to prioritize the initial rendering path.
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js', { type: 'module' })
            .then(() => {
                // Registration successful
                // console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(() => {
                // Registration failed
                // console.error('ServiceWorker registration failed: ', err);
            });
    });
}

/**
 * DOMContentLoaded Event Listener.
 * Bootstraps the UI and Animation modules once the DOM structure is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize interactive card logic (Accessibility & State)
    setupCardInteractions();

    // 2. Initialize scroll observers for entrance animations (Visuals)
    setupScrollAnimations();
});
