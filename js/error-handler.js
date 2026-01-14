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

    // Inline styles for critical visibility (independent of main CSS if it fails)
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#7f1d1d', // Dark Red
        color: '#ffffff',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: '9999',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
        maxWidth: '300px',
        animation: 'slideIn 0.3s ease-out',
    });

    document.body.appendChild(toast);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (toast.isConnected) toast.remove();
    }, 5000);
}
