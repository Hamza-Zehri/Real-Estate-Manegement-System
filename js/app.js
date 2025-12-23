// App Entry Point

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    Store.init();

    // Check Config
    const company = Store.getCompany();
    if (!company) {
        UI.renderOnboarding();
    } else if (!Store.getCurrentUser()) {
        UI.renderLogin();
    } else {
        UI.renderDashboard();
    }
});
