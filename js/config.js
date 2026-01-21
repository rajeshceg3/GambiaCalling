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
        PARALLAX: {
            MAX_SCROLL: 800, // Pixels to stop parallax effect
        },
        KEYFRAMES: {
             // Offsets for the bounce animation
            BOUNCE_PEAK: 0.6,
            BOUNCE_SETTLE: 0.8
        }
    },
    UI: {
        TOAST_DURATION: 5000,
        SCROLL_TRIGGER_MARGIN: '-50px',
    },
    MAP: {
        DEFAULT_ZOOM: 13,
        LOADING_TIMEOUT: 5000, // Safety net for loading state
    },
};
