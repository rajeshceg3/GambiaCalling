/**
 * @file js/history.js
 * @description Manages the browser History API interactions for the application.
 * @module History
 */

/**
 * Manages history state and navigation events.
 */
export const HistoryManager = {
    /**
     * Initializes the history listeners.
     * @param {Function} onPopState - Callback to execute when the back button is pressed.
     */
    init(onPopState) {
        window.addEventListener('popstate', (event) => {
            onPopState(event);
        });
    },

    /**
     * Pushes a new state to the history.
     * @param {string} cardId - The ID of the expanded card.
     * @param {string} slug - The URL slug to append.
     */
    pushState(cardId, slug) {
        history.pushState({ cardId }, '', `#${slug}`);
    },

    /**
     * Replaces the current history state.
     * @param {string} cardId - The ID of the expanded card.
     * @param {string} slug - The URL slug to use.
     */
    replaceState(cardId, slug) {
        history.replaceState({ cardId }, '', `#${slug}`);
    },

    /**
     * Reverts the history state (simulates back button) if the current state matches.
     * @param {string} cardId - The ID of the card to verify against current state.
     */
    revertState(cardId) {
        if (history.state && history.state.cardId === cardId) {
            history.back();
        }
    }
};
