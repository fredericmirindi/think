// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const searchToggle = document.getElementById('searchToggle');
const searchInput = document.getElementById('searchInput');
const scrollProgress = document.getElementById('scrollProgress');
const header = document.getElementById('header');
const fab = document.getElementById('fab');
const newsletterForm = document.getElementById('newsletterForm');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeScrollEffects();
    initializeAnimations();
    initializeSearch();
    initializeNavigation();
    initializeInteractions();
    initializeFAB();
    initializeNewsletter();
    initializeArticleAnimations();
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-color-scheme', savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add transition class for smooth theme change
        document.documentElement.classList.add('theme-transition');
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Remove transition class after animation
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 500);
        
        // Add button press animation
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 150);
    });
}

// Scroll Effects
function initializeScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        
        // Update scroll progress bar
        const progress = (scrolled / documentHeight) * 100;
        scrollProgress.style.width = `${Math.min(progress, 100)}%`;
        
        // Update header appearance
        if (scrolled > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Show/hide FAB
        if (scrolled > windowHeight) {
            fab.classList.add('visible');
        } else {
            fab.classList.remove('visible');
        }
        
        // Parallax effect for floating shapes
        const shapes = document.querySelectorAll('.floating-shape');
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            shape.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${scrolled * 0.1}deg)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Initial call
    updateScrollEffects();
}

// Intersection Observer for Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Add stagger animation for article cards
                if (entry.target.classList.contains('article-card')) {
                    const cards = document.querySelectorAll('.article-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                    entry.target.classList.add('slide-in');
                }
                
                // Special animation for featured articles
                if (entry.target.classList.contains('featured-article')) {
                    entry.target.style.animationDelay = '0.2s';
                    entry.target.classList.add('scale-in');
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const elementsToAnimate = document.querySelectorAll('.featured-article, .article-card, .widget, .section__header');
    elementsToAnimate.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
}

// Search Functionality
function initializeSearch() {
    let searchTimeout;
    
    searchToggle.addEventListener('click', function() {
        searchInput.classList.toggle('active');
        if (searchInput.classList.contains('active')) {
            setTimeout(() => searchInput.focus(), 300);
        } else {
            searchInput.blur();
        }
    });
    
    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            searchInput.classList.remove('active');
        }
    });
    
    // Search functionality with debouncing
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const query = e.target.value.toLowerCase();
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    function performSearch(query) {
        const articles = document.querySelectorAll('.article-card, .featured-article');
        
        articles.forEach(article => {
            const title = article.querySelector('.article__title, .article-card__title');
            const content = article.textContent.toLowerCase();
            
            if (query === '' || content.includes(query)) {
                article.style.display = '';
                article.classList.remove('search-hidden');
            } else {
                article.style.display = 'none';
                article.classList.add('search-hidden');
            }
        });
        
        // Show/hide "no results" message
        const visibleArticles = document.querySelectorAll('.article-card:not(.search-hidden), .featured-article:not(.search-hidden)');
        if (query && visibleArticles.length === 0) {
            showNoResults();
        } else {
            hideNoResults();
        }
    }
    
    function showNoResults() {
        let noResultsMsg = document.querySelector('.no-results');
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--color-text-secondary);">
                    <h3>No articles found</h3>
                    <p>Try adjusting your search terms or browse our categories.</p>
                </div>
            `;
            document.querySelector('.articles-container').appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    }
    
    function hideNoResults() {
        const noResultsMsg = document.querySelector('.no-results');
        if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }
}

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Highlight active section on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + header.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

// Interactive Elements
function initializeInteractions() {
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0) scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px)';
        });
    });
    
    // Article card interactions
    const articleCards = document.querySelectorAll('.article-card, .featured-article');
    articleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('featured-article') 
                ? 'translateY(-8px) scale(1.02)' 
                : 'translateX(8px) scale(1.01)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Add click ripple effect
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
    
    // Category and topic tag hover effects
    const interactiveElements = document.querySelectorAll('.category-link, .topic-tag, .social-link');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Floating Action Button
function initializeFAB() {
    fab.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Add click animation
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
}

// Newsletter Form
function initializeNewsletter() {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('.newsletter-input');
        const submitBtn = this.querySelector('.btn');
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Subscribing...';
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Subscribed!';
            submitBtn.style.background = 'var(--color-success)';
            email.value = '';
            
            // Show success message
            showNotification('Successfully subscribed to newsletter!', 'success');
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = 'Subscribe';
                submitBtn.style.background = '';
            }, 3000);
        }, 2000);
    });
}

// Article Animations
function initializeArticleAnimations() {
    const articles = document.querySelectorAll('.featured-article, .article-card');
    
    articles.forEach(article => {
        article.addEventListener('mouseenter', function() {
            // Add subtle glow effect
            this.style.boxShadow = '0 20px 40px rgba(166, 123, 91, 0.2)';
            
            // Animate author avatar
            const avatar = this.querySelector('.author__avatar');
            if (avatar) {
                avatar.style.transform = 'scale(1.1) rotate(5deg)';
            }
            
            // Animate tags
            const tags = this.querySelectorAll('.tag, .topic-tag');
            tags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'translateY(-2px)';
                }, index * 50);
            });
        });
        
        article.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
            
            const avatar = this.querySelector('.author__avatar');
            if (avatar) {
                avatar.style.transform = '';
            }
            
            const tags = this.querySelectorAll('.tag, .topic-tag');
            tags.forEach(tag => {
                tag.style.transform = '';
            });
        });
    });
}

// Utility Functions
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.className = 'ripple-effect';
    
    // Add ripple styles
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__message">${message}</span>
            <button class="notification__close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: 16px 20px;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    if (type === 'success') {
        notification.style.borderLeftColor = 'var(--color-success)';
        notification.style.borderLeftWidth = '4px';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Add CSS animations for JavaScript-triggered effects
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes slide-in {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes scale-in {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        .slide-in {
            animation: slide-in 0.6s ease forwards;
        }
        
        .scale-in {
            animation: scale-in 0.8s ease forwards;
        }
        
        .theme-transition * {
            transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease !important;
        }
        
        .notification__content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        
        .notification__close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: var(--color-text-secondary);
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .notification__close:hover {
            color: var(--color-text);
        }
    `;
    document.head.appendChild(style);
}

// Performance Optimization
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

// Initialize dynamic styles
addDynamicStyles();

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollScript = document.createElement('script');
    smoothScrollScript.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15.0.0/dist/smooth-scroll.polyfills.min.js';
    document.head.appendChild(smoothScrollScript);
}

// Mouse trail effect (subtle 4D feature)
let mouseTrail = [];
const maxTrailLength = 20;

document.addEventListener('mousemove', function(e) {
    mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
    
    if (mouseTrail.length > maxTrailLength) {
        mouseTrail.shift();
    }
    
    // Clean up old trail points
    mouseTrail = mouseTrail.filter(point => Date.now() - point.time < 1000);
});

// Keyboard navigation enhancement
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        searchInput.classList.remove('active');
        searchInput.blur();
    }
    
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        searchToggle.click();
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});

// Page visibility handling
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.classList.add('page-hidden');
    } else {
        // Resume animations when tab becomes visible
        document.body.classList.remove('page-hidden');
    }
});