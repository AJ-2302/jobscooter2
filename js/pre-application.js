// Pre-Application Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializePreApplication();
});

function initializePreApplication() {
    // Initialize checkbox monitoring
    initializeCheckboxes();
    
    // Initialize start application button
    initializeStartButton();
    
    // Initialize modal functionality
    initializeModals();
}

function initializeCheckboxes() {
    const checkboxes = document.querySelectorAll('.agreement-item input[type="checkbox"]');
    const startButton = document.getElementById('startApplicationBtn');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateStartButtonState();
            
            // Add visual feedback
            const agreementItem = this.closest('.agreement-item');
            if (this.checked) {
                agreementItem.style.borderColor = '#10b981';
                agreementItem.style.backgroundColor = '#f0fdf4';
            } else {
                agreementItem.style.borderColor = '#e2e8f0';
                agreementItem.style.backgroundColor = 'white';
            }
        });
    });
    
    function updateStartButtonState() {
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        startButton.disabled = !allChecked;
        
        if (allChecked) {
            startButton.style.opacity = '1';
            startButton.style.cursor = 'pointer';
        } else {
            startButton.style.opacity = '0.6';
            startButton.style.cursor = 'not-allowed';
        }
    }
    
    // Initial state
    updateStartButtonState();
}

function initializeStartButton() {
    const startButton = document.getElementById('startApplicationBtn');
    
    startButton.addEventListener('click', async function() {
        if (this.disabled) return;
        
        // Add loading state
        const originalContent = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Initializing Application...';
        this.disabled = true;
        
        try {
            // Create application session
            const sessionData = await createApplicationSession();
            
            if (sessionData.success) {
                // Store session token
                localStorage.setItem('jobscooter_session', sessionData.sessionToken);
                
                // Show success notification
                window.JobScooter.showNotification('Application session created successfully!', 'success');
                
                // Redirect to step 1 after short delay
                setTimeout(() => {
                    window.location.href = '/application/step1.html';
                }, 1500);
            } else {
                throw new Error(sessionData.message || 'Failed to create application session');
            }
        } catch (error) {
            console.error('Error creating application session:', error);
            window.JobScooter.showNotification('Failed to start application. Please try again.', 'error');
            
            // Restore button
            this.innerHTML = originalContent;
            this.disabled = false;
        }
    });
}

async function createApplicationSession() {
    try {
        const response = await window.JobScooter.API.post('/pre-application/start', {
            timestamp: new Date().toISOString(),
            agreedToTerms: true,
            agreedToDataProtection: true,
            agreedToPrivacy: true
        });
        
        return response;
    } catch (error) {
        throw error;
    }
}

function initializeModals() {
    // Modal functionality is handled by global functions
    // defined in this script for the onclick handlers in HTML
}

// Global modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
});

// Close modal with escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            closeModal(openModal.id);
        }
    }
});

// Utility function to validate all agreements
function validateAgreements() {
    const termsCheckbox = document.getElementById('terms-conditions');
    const dataCheckbox = document.getElementById('data-protection');
    const privacyCheckbox = document.getElementById('privacy-policy');
    
    return termsCheckbox.checked && dataCheckbox.checked && privacyCheckbox.checked;
}

// Progress tracking utility
function trackProgress(action, data = {}) {
    // This could be used for analytics
    console.log('Progress tracked:', action, data);
}