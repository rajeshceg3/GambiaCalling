/**
 * js/config.js
 * Centralized configuration for the application.
 * Stores constants for animations, delays, and map settings to avoid "Magic Numbers".
 */

export const CONFIG = {
    ANIMATION: {
        DURATION: {
            MAP_ENTRANCE: 800,
            MAP_PULSE: 2000,
            TOAST_DISMISS: 300, // Matches CSS transition
        },
        DELAY: {
            SCROLL_TRIGGER_MAX: 150,
            STAGGER_BASE: 50,
        },
    },
    UI: {
        TOAST_DURATION: 5000,
    },
    MAP: {
        DEFAULT_ZOOM: 13,
    },
};
