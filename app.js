// Main JavaScript file for Emergency Department Tracking System
// This file handles common functionality across the application

// Check if user is logged in
function checkAuth() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return user;
}

// Initialize the application
function initApp() {
    const user = checkAuth();
    if (!user) return;
    
    // Set user info in navbar
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    
    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        sessionStorage.removeItem('user');
        window.location.href = 'index.html';
    });
    
    // Set active nav item
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Format date and time
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format time elapsed
function formatTimeElapsed(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    
    if (diffHrs > 0) {
        return `${diffHrs}h ${diffMins % 60}m`;
    } else {
        return `${diffMins}m`;
    }
}

// Get color class for vital signs
function getVitalSignClass(type, value) {
    switch (type) {
        case 'pulseRate':
            if (value < 60 || value > 100) return 'vital-sign-danger';
            if (value < 70 || value > 90) return 'vital-sign-warning';
            return 'vital-sign-normal';
        case 'respiratoryRate':
            if (value < 12 || value > 25) return 'vital-sign-danger';
            if (value < 14 || value > 20) return 'vital-sign-warning';
            return 'vital-sign-normal';
        case 'systolic':
            if (value < 90 || value > 160) return 'vital-sign-danger';
            if (value < 100 || value > 140) return 'vital-sign-warning';
            return 'vital-sign-normal';
        case 'diastolic':
            if (value < 60 || value > 100) return 'vital-sign-danger';
            if (value < 70 || value > 90) return 'vital-sign-warning';
            return 'vital-sign-normal';
        case 'temperature':
            if (value < 36 || value > 38.5) return 'vital-sign-danger';
            if (value < 36.5 || value > 37.5) return 'vital-sign-warning';
            return 'vital-sign-normal';
        case 'oxygenSaturation':
            if (value < 92) return 'vital-sign-danger';
            if (value < 95) return 'vital-sign-warning';
            return 'vital-sign-normal';
        case 'painScore':
            if (value >= 7) return 'vital-sign-danger';
            if (value >= 4) return 'vital-sign-warning';
            return 'vital-sign-normal';
        default:
            return 'vital-sign-normal';
    }
}

// API service for making requests to the backend
const apiService = {
    baseUrl: '/api/v1',
    
    // Get auth token
    getToken() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        return user ? user.token : null;
    },
    
    // Headers for API requests
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
        };
    },
    
    // Generic request method
    async request(endpoint, method = 'GET', data = null) {
        try {
            const options = {
                method,
                headers: this.getHeaders()
            };
            
            if (data) {
                options.body = JSON.stringify(data);
            }
            
            const response = await fetch(`${this.baseUrl}${endpoint}`, options);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'API request failed');
            }
            
            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    // Auth endpoints
    async login(email, password) {
        return this.request('/auth/login', 'POST', { email, password });
    },
    
    async getCurrentUser() {
        return this.request('/auth/me');
    },
    
    // Patient endpoints
    async getPatients() {
        return this.request('/patients');
    },
    
    async getPatient(id) {
        return this.request(`/patients/${id}`);
    },
    
    // Visit endpoints
    async getVisitsByZone(zone) {
        return this.request(`/visits/zone/${zone}`);
    },
    
    // Vital signs endpoints
    async getVitalSigns(visitId) {
        return this.request(`/visits/${visitId}/vitals`);
    },
    
    // Notes endpoints
    async getNotes(visitId) {
        return this.request(`/visits/${visitId}/notes`);
    },
    
    // Orders endpoints
    async getOrders(visitId) {
        return this.request(`/visits/${visitId}/orders`);
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if not on login page
    if (window.location.pathname.split('/').pop() !== 'index.html') {
        initApp();
    }
});
