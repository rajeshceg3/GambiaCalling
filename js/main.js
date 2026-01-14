/**
 * js/main.js
 * Entry point for the application.
 * Initializes the main UI interactions and scroll animations when the DOM is ready.
 */
import { setupCardInteractions } from './ui.js';
import { setupScrollAnimations } from './animations.js';
import { setupGlobalErrorHandling } from './error-handler.js';

// Initialize safety nets first
setupGlobalErrorHandling();

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js', { type: 'module' })
            .then((/* registration */) => {
                // Service Worker registered successfully
            })
            .catch((/* registrationError */) => {
                // Service Worker registration failed
            });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupCardInteractions();
    setupScrollAnimations();
});
