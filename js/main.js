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
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupCardInteractions();
    setupScrollAnimations();
});
