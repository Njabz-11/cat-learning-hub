// DOM Elements
const navTabs = document.querySelectorAll('.nav-tab');
const contentSections = document.querySelectorAll('.content-section');
const topicCards = document.querySelectorAll('.topic-card');
const progressFill = document.getElementById('progressFill');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTopicCards();
    initializeProgressBar();
    addScrollAnimations();
});

// Navigation functionality
function initializeNavigation() {
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            switchSection(targetSection);
            updateActiveTab(this);
        });
    });
}

function switchSection(targetSection) {
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetElement = document.getElementById(targetSection);
    if (targetElement) {
        targetElement.classList.add('active');
        
        // Add entrance animation
        targetElement.style.animation = 'none';
        setTimeout(() => {
            targetElement.style.animation = 'fadeIn 0.5s ease-in';
        }, 10);
    }
}

function updateActiveTab(activeTab) {
    navTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    activeTab.classList.add('active');
}

// Topic card functionality
function initializeTopicCards() {
    topicCards.forEach(card => {
        card.addEventListener('click', function() {
            toggleCard(this);
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('expanded')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

function toggleCard(card) {
    const isExpanded = card.classList.contains('expanded');
    
    // Close all other cards
    topicCards.forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.remove('expanded');
            otherCard.style.transform = 'translateY(0) scale(1)';
        }
    });
    
    // Toggle current card
    if (isExpanded) {
        card.classList.remove('expanded');
        card.style.transform = 'translateY(0) scale(1)';
    } else {
        card.classList.add('expanded');
        card.style.transform = 'translateY(-5px) scale(1.02)';
        
        // Scroll card into view
        setTimeout(() => {
            card.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 300);
    }
    
    updateProgress();
}

// Progress bar functionality
function initializeProgressBar() {
    updateProgress();
    
    // Animate progress bar on load
    setTimeout(() => {
        progressFill.style.width = '25%';
    }, 1000);
}

function updateProgress() {
    const expandedCards = document.querySelectorAll('.topic-card.expanded');
    const totalCards = topicCards.length;
    const progress = (expandedCards.length / totalCards) * 100;
    
    progressFill.style.width = Math.max(25, progress) + '%';
}

// Scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-out';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    // Observe all topic cards
    topicCards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close all expanded cards
        topicCards.forEach(card => {
            card.classList.remove('expanded');
            card.style.transform = 'translateY(0) scale(1)';
        });
        updateProgress();
    }
    
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeTab = document.querySelector('.nav-tab.active');
        const tabs = Array.from(navTabs);
        const currentIndex = tabs.indexOf(activeTab);
        
        let newIndex;
        if (e.key === 'ArrowLeft') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        } else {
            newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        }
        
        tabs[newIndex].click();
    }
});

// Search functionality (basic)
function addSearchFunctionality() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search topics...';
    searchInput.className = 'search-input';
    
    const headerContent = document.querySelector('.header-content');
    headerContent.appendChild(searchInput);
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        topicCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            if (cardText.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Tooltip functionality
function addTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Theme toggle functionality
function addThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    
    const header = document.querySelector('.header');
    header.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const icon = this.querySelector('i');
        
        if (document.body.classList.contains('dark-theme')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    });
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scrolling for internal links
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize additional features
setTimeout(() => {
    addSearchFunctionality();
    addTooltips();
    addThemeToggle();
    addSmoothScrolling();
}, 1000);

// Loading animation
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});

// Service worker registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}
