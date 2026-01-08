/**
 * js/main.js
 * Entry point for the application.
 * Initializes the main UI interactions and scroll animations when the DOM is ready.
 */
import { setupCardInteractions } from './ui.js';
import { setupScrollAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
    setupCardInteractions();
    setupScrollAnimations();
});
