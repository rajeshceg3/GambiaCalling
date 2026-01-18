/**
 * js/error-handler.js
 * Global error handling for the application.
 * Catches unhandled errors and promise rejections to prevent silent failures.
 */

import { CONFIG } from './config.js';

export function setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
        // Log to telemetry service here in production
        showSystemErrorToast(event.message || 'An unexpected error occurred.');
    });

    window.addEventListener('unhandledrejection', () => {
        // Log to telemetry service here in production
        showSystemErrorToast('A system process failed unexpectedly.');
    });
}

function showSystemErrorToast(message) {
    // Prevent spamming toasts
    if (document.querySelector('.error-toast')) {
        return;
    }

    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.role = 'alert';
    toast.textContent = `⚠️ System Alert: ${message}`;

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
