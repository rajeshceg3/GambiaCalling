/**
 * js/error-handler.js
 * Global error handling for the application.
 * Catches unhandled errors and promise rejections to prevent silent failures.
 */

import { CONFIG } from './config.js';

export function setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
        // Log to telemetry service here in production
        showToast(event.message || 'An unexpected error occurred.', 'error');
    });

    window.addEventListener('unhandledrejection', () => {
        // Log to telemetry service here in production
        showToast('A system process failed unexpectedly.', 'error');
    });
}

/**
 * Displays a toast notification.
 * @param {string} message - The message to display.
 * @param {'error'|'success'} [type='error'] - The type of toast.
 */
export function showToast(message, type = 'error') {
    // Prevent spamming toasts
    if (document.querySelector('.error-toast')) {
        return;
    }

    const toast = document.createElement('div');
    toast.className = 'error-toast';
    if (type === 'success') {
        toast.classList.add('toast-success');
    }

    toast.role = 'alert';
    toast.textContent = type === 'error' ? `⚠️ System Alert: ${message}` : `✓ ${message}`;

    document.body.appendChild(toast);

    // Auto-dismiss after defined duration
    setTimeout(() => {
        if (toast.isConnected) {
            // Use CSS class for smooth exit
            toast.classList.add('dismissing');

            toast.addEventListener(
                'transitionend',
                () => {
                    if (toast.isConnected) {
                        toast.remove();
                    }
                },
                { once: true }
            );
        }
    }, CONFIG.UI.TOAST_DURATION);
}
