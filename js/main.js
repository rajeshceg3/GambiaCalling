/**
 * @file main.js
 * @description Main entry point for the application. Initializes interactions and animations.
 */
import { setupCardInteractions } from './ui.js';
import { setupScrollAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
    setupCardInteractions();
    setupScrollAnimations();
});
