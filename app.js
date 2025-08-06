// ThinkBit Edge Corp - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('ThinkBit Edge Corp website loaded');
    
    // Navigation elements
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    
    console.log('Found elements:', {
        navbar: !!navbar,
        navToggle: !!navToggle,
        navMenu: !!navMenu,
        navLinks: navLinks.length,
        contactForm: !!contactForm
    });
    
    // Smooth scrolling function
    function smoothScrollTo(target) {
        const targetSection = document.querySelector(target);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            console.log('Scrolling to:', target, 'offsetTop:', offsetTop);
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            return true;
        }
        return false;
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach((link, index) => {
        console.log('Setting up nav link:', index, link.getAttribute('href'));
        
        link.addEventListener('click', function(e) {
            console.log('Nav link clicked:', this.getAttribute('href'));
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const scrolled = smoothScrollTo(targetId);
            
            if (scrolled) {
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('nav-menu--open')) {
                    navMenu.classList.remove('nav-menu--open');
                    if (navToggle) navToggle.classList.remove('nav-toggle--active');
                }
            }
        });
    });
    
    // Also handle hero buttons smooth scrolling
    const heroButtons = document.querySelectorAll('.hero-buttons a');
    heroButtons.forEach((button, index) => {
        console.log('Setting up hero button:', index, button.getAttribute('href'));
        
        button.addEventListener('click', function(e) {
            console.log('Hero button clicked:', this.getAttribute('href'));
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            smoothScrollTo(targetId);
        });
    });
    
    // Footer links smooth scrolling
    const footerLinks = document.querySelectorAll('.footer-link[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScrollTo(targetId);
        });
    });
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            console.log('Mobile menu toggle clicked');
            e.preventDefault();
            e.stopPropagation();
            
            navMenu.classList.toggle('nav-menu--open');
            navToggle.classList.toggle('nav-toggle--active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navToggle && !navbar.contains(e.target) && navMenu.classList.contains('nav-menu--open')) {
            navMenu.classList.remove('nav-menu--open');
            navToggle.classList.remove('nav-toggle--active');
        }
    });
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (navbar) {
            if (scrollTop > 100) {
                navbar.classList.add('navbar--scrolled');
            } else {
                navbar.classList.remove('navbar--scrolled');
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Contact form handling with detailed logging
    if (contactForm) {
        console.log('Contact form found, setting up event listener');
        
        contactForm.addEventListener('submit', function(e) {
            console.log('Contact form submitted');
            e.preventDefault();
            
            // Get form elements
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const companyField = document.getElementById('company');
            const messageField = document.getElementById('message');
            const submitButton = contactForm.querySelector('button[type="submit"]');
            
            console.log('Form elements:', {
                nameField: !!nameField,
                emailField: !!emailField,
                companyField: !!companyField,
                messageField: !!messageField,
                submitButton: !!submitButton
            });
            
            // Get form data
            const name = nameField ? nameField.value.trim() : '';
            const email = emailField ? emailField.value.trim() : '';
            const company = companyField ? companyField.value.trim() : '';
            const message = messageField ? messageField.value.trim() : '';
            
            console.log('Form data:', { name, email, company, message });
            
            // Basic validation
            if (!name || !email || !message) {
                console.log('Validation failed: missing required fields');
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                console.log('Validation failed: invalid email');
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            console.log('Validation passed, simulating form submission');
            
            // Update submit button
            const originalText = submitButton ? submitButton.textContent : 'Send Message';
            if (submitButton) {
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                submitButton.style.opacity = '0.7';
            }
            
            // Simulate API call
            setTimeout(() => {
                console.log('Showing success notification');
                showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                
                // Reset form
                if (nameField) nameField.value = '';
                if (emailField) emailField.value = '';
                if (companyField) companyField.value = '';
                if (messageField) messageField.value = '';
                
                // Reset button
                if (submitButton) {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.opacity = '1';
                }
            }, 1500);
        });
    } else {
        console.error('Contact form not found!');
    }
    
    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            console.log('Scroll indicator clicked');
            smoothScrollTo('#solutions');
        });
    }
    
    // Parallax effect for hero background (subtle)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-bg-img');
        
        if (heroBackground && scrolled < window.innerHeight) {
            const speed = scrolled * 0.3;
            heroBackground.style.transform = `translateY(${speed}px)`;
        }
    });
    
    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('nav-link--active'));
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('nav-link--active');
                }
            }
        });
    });
    
    // Feature cards hover effect enhancement
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Initialize animations for visible elements
    setTimeout(() => {
        const visibleElements = document.querySelectorAll('.feature-card, .stat-card, .founder-info, .mission');
        visibleElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate-in');
            }, index * 200);
        });
    }, 500);
    
    // Debug: Log all sections on page
    const allSections = document.querySelectorAll('section[id]');
    console.log('All sections found:', Array.from(allSections).map(s => s.id));
});

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    console.log('Showing notification:', message, type);
    
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => {
        console.log('Removing existing notification');
        notif.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    // Create notification content
    const content = document.createElement('div');
    content.style.cssText = 'display: flex; align-items: center; gap: 12px;';
    
    // Add icon
    const icon = document.createElement('div');
    icon.innerHTML = type === 'success' ? 
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>' :
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    
    // Add message
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    
    content.appendChild(icon);
    content.appendChild(messageSpan);
    notification.appendChild(content);
    
    // Add styles
    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '500',
        fontSize: '14px',
        fontFamily: 'var(--font-family-base)',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        maxWidth: '400px',
        minWidth: '300px',
        wordWrap: 'break-word',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        pointerEvents: 'auto'
    };
    
    Object.assign(notification.style, styles);
    
    // Set background color based on type
    const colors = {
        success: 'rgba(33, 128, 141, 0.9)',
        error: 'rgba(192, 21, 47, 0.9)',
        warning: 'rgba(168, 75, 47, 0.9)',
        info: 'rgba(98, 108, 113, 0.9)'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    console.log('Notification added to DOM');
    
    // Force reflow
    notification.offsetHeight;
    
    // Animate in
    setTimeout(() => {
        console.log('Animating notification in');
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 50);
    
    // Remove after 4 seconds
    setTimeout(() => {
        console.log('Animating notification out');
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                console.log('Removing notification from DOM');
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add additional animation styles
const additionalAnimationCSS = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .feature-card,
    .stat-card,
    .founder-info,
    .mission {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .feature-card {
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .feature-card:hover {
        transform: translateY(-12px) scale(1.02) !important;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4) !important;
    }
    
    .hero-title {
        animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
    }
    
    .hero-subtitle {
        animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
    }
    
    .hero-buttons {
        animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification {
        font-family: var(--font-family-base, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif) !important;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
        
        .nav-menu--open {
            display: flex !important;
        }
        
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
            min-width: auto;
        }
    }
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalAnimationCSS;
document.head.appendChild(style);

console.log('ThinkBit Edge Corp JavaScript fully loaded');