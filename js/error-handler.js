/**
 * js/error-handler.js
 * Global error handling for the application.
 * Catches unhandled errors and promise rejections to prevent silent failures.
 */

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
    if (document.querySelector('.error-toast')) return;

    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.role = 'alert';
    toast.textContent = `⚠️ System Alert: ${message}`;

    document.body.appendChild(toast);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (toast.isConnected) {
            // Use CSS transition for smooth exit
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease-out';

            toast.addEventListener('transitionend', () => {
                if (toast.isConnected) toast.remove();
            }, { once: true });
        }
    }, 5000);
}
