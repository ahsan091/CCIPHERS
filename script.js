/* ============================================
   CHAMBER OF CIPHERS - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMatrixRain();
    initAnimatedTitle();
    initMobileMenu();
    initSmoothScroll();
    initEventDetails();
    initScrollSpy();
    initContactForm();
    initCurrentYear();
});

/* ============================================
   MATRIX RAIN ANIMATION
   ============================================ */

function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to full screen
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const fontSize = 14;
    let columns = Math.floor(window.innerWidth / fontSize);

    // Initialize drops at different positions
    let drops = [];
    let brightness = [];
    let speed = [];

    function initDrops() {
        columns = Math.floor(window.innerWidth / fontSize);
        drops = [];
        brightness = [];
        speed = [];
        
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -100);
            brightness[i] = 0.5 + Math.random() * 0.5;
            speed[i] = 0.5 + Math.random() * 1.5;
        }
    }

    initDrops();
    window.addEventListener('resize', initDrops);

    // Enhanced character set
    const characters = 
        '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

    function draw() {
        // Semi-transparent black for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the matrix rain
        for (let i = 0; i < drops.length; i++) {
            const bright = brightness[i];
            const blue = Math.floor(150 + 50 * bright);
            
            ctx.fillStyle = `rgba(0, ${blue / 2}, ${blue}, ${0.5 + bright * 0.5})`;
            ctx.font = `${fontSize}px monospace`;
            
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Randomly change brightness
            if (Math.random() > 0.98) {
                brightness[i] = 0.5 + Math.random() * 0.5;
            }

            // Reset drop when it reaches bottom
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            } else {
                drops[i] += speed[i];
            }
        }
    }

    setInterval(draw, 33);
}

/* ============================================
   ANIMATED TITLE
   ============================================ */

function initAnimatedTitle() {
    const titleContainer = document.getElementById('animated-title');
    if (!titleContainer) return;

    const firstPart = 'CHAMBER OF ';
    const secondPart = 'CIPHERS';
    const fullText = firstPart + secondPart;

    let charIndex = 0;
    let isTyping = true;
    let timeoutId = null;

    const typingDelay = 150;
    const erasingDelay = 100;
    const pauseDuration = 6000;
    const restartDelay = 2000;

    // Add CSS for animations - clean and smooth fade
    const style = document.createElement('style');
    style.textContent = `
        @keyframes charType {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
        @keyframes charErase {
            0% {
                opacity: 1;
            }
            100% {
                opacity: 0;
            }
        }
        .title-char {
            display: inline-block;
            opacity: 0;
            animation: charType 0.5s ease-out forwards;
        }
        .title-char.erasing {
            animation: charErase 0.4s ease-in forwards;
        }
        .title-space {
            display: inline-block;
            width: 0.4em;
        }
    `;
    document.head.appendChild(style);

    function createCharSpan(char, index) {
        const span = document.createElement('span');
        span.classList.add('title-char');
        
        // Determine if this character is part of CIPHERS
        const isSecondPart = index >= firstPart.length;
        
        if (char === ' ') {
            span.classList.add('title-space');
            span.innerHTML = '&nbsp;';
        } else {
            span.textContent = char;
        }
        
        if (isSecondPart) {
            span.classList.add('title-blue');
        } else {
            span.classList.add('title-white');
        }
        
        return span;
    }

    function typeNextChar() {
        if (charIndex < fullText.length) {
            const char = fullText[charIndex];
            const span = createCharSpan(char, charIndex);
            
            // Add character to container
            titleContainer.appendChild(span);
            charIndex++;
            
            timeoutId = setTimeout(typeNextChar, typingDelay);
        } else {
            // Finished typing, pause then start erasing
            isTyping = false;
            timeoutId = setTimeout(startErasing, pauseDuration);
        }
    }

    function startErasing() {
        eraseNextChar();
    }

    function eraseNextChar() {
        const chars = titleContainer.querySelectorAll('.title-char:not(.erasing)');
        
        if (chars.length > 0) {
            const lastChar = chars[chars.length - 1];
            lastChar.classList.add('erasing');
            
            // Remove after animation completes
            setTimeout(() => {
                if (lastChar.parentNode) {
                    lastChar.remove();
                }
            }, 400);
            
            charIndex--;
            timeoutId = setTimeout(eraseNextChar, erasingDelay);
        } else {
            // Finished erasing, restart typing
            charIndex = 0;
            isTyping = true;
            timeoutId = setTimeout(typeNextChar, restartDelay);
        }
    }

    // Initialize empty
    titleContainer.innerHTML = '';

    // Start the animation
    typeNextChar();
}

/* ============================================
   MOBILE MENU
   ============================================ */

function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = menuBtn?.querySelector('.menu-icon');
    const closeIcon = menuBtn?.querySelector('.close-icon');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuBtn || !mobileMenu) return;

    function toggleMenu() {
        const isOpen = mobileMenu.classList.contains('active');
        
        if (isOpen) {
            mobileMenu.classList.remove('active');
            menuIcon?.classList.remove('hidden');
            closeIcon?.classList.add('hidden');
            document.body.style.overflow = '';
        } else {
            mobileMenu.classList.add('active');
            menuIcon?.classList.add('hidden');
            closeIcon?.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuIcon?.classList.remove('hidden');
            closeIcon?.classList.add('hidden');
            document.body.style.overflow = '';
        });
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const offsetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                updateActiveLink(targetId);
            }
        });
    });
}

function updateActiveLink(activeId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkSection = link.getAttribute('data-section');
        if (linkSection === activeId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* ============================================
   EVENT DETAILS TOGGLE
   ============================================ */

function initEventDetails() {
    const toggleBtn = document.getElementById('toggle-details');
    const detailsSection = document.getElementById('event-details');
    const toggleText = document.getElementById('toggle-text');
    const chevronDown = document.getElementById('chevron-down');
    const chevronUp = document.getElementById('chevron-up');

    if (!toggleBtn || !detailsSection) return;

    toggleBtn.addEventListener('click', function() {
        const isVisible = detailsSection.classList.contains('active');
        
        if (isVisible) {
            detailsSection.classList.remove('active');
            toggleText.textContent = 'Show Details';
            chevronDown?.classList.remove('hidden');
            chevronUp?.classList.add('hidden');
        } else {
            detailsSection.classList.add('active');
            toggleText.textContent = 'Hide Details';
            chevronDown?.classList.add('hidden');
            chevronUp?.classList.remove('hidden');
        }
    });
}

/* ============================================
   SCROLL SPY - Active Navigation on Scroll
   ============================================ */

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function onScroll() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', onScroll);
    onScroll(); // Run once on load
}

/* ============================================
   CONTACT FORM
   ============================================ */

function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const message = form.querySelector('#message').value;
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
        color: white;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/* ============================================
   CURRENT YEAR
   ============================================ */

function initCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/* ============================================
   CIPHER CARD ANIMATIONS
   ============================================ */

// Add hover animations to cipher cards
document.addEventListener('DOMContentLoaded', function() {
    const cipherCards = document.querySelectorAll('.cipher-card');
    
    cipherCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

/* ============================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cipher cards for animation
    const animatableElements = document.querySelectorAll('.cipher-card, .event-item');
    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});

// Add animate-in class styles
const animateStyles = document.createElement('style');
animateStyles.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(animateStyles);

/* ============================================
   HEADER SCROLL EFFECT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 112, 255, 0.2)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
});
