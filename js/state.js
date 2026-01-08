/**
 * js/state.js
 * Manages the global state of the application.
 */
export const mapState = {
    /**
     * Holds the currently active Leaflet map instance.
     * Used to ensure only one map is active/managed at a time or to clean up resources.
     * @type {L.Map|null}
     */
    currentMap: null,
};
