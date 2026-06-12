/* ============================================================
   MAIN.JS — Shared functionality across all pages
   Handles: include loading, scroll reveals, smooth scroll,
            back-to-top button
   ============================================================ */

// Preloader
(function() {
    if (document.querySelector('.page-preloader')) return;
    const preloader = document.createElement('div');
    preloader.className = 'page-preloader';
    const path = window.location.pathname;
    let basePath = '';
    if (path.includes('/company/blog/')) { basePath = '../../'; }
    else if (path.includes('/services/') || path.includes('/products/') || 
        path.includes('/company/') || path.includes('/legal/') || path.includes('/portal/')) {
        basePath = '../';
    }
    preloader.innerHTML = `<img src="${basePath}images/logo-logibrisk.svg" alt="LogiBrisk Logo" class="preloader-logo" style="width: 220px;">`;
    document.body.appendChild(preloader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.remove(), 500);
        }, 300);
    });
    
    // Fallback if load already fired
    if (document.readyState === 'complete') {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.remove(), 500);
        }, 300);
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    loadIncludes();
    initScrollReveal();
    initSmoothScroll();
    initBackToTop();
});

/* ============================================================
   1. LOAD SHARED INCLUDES (Navbar & Footer)
   ============================================================ */
async function loadIncludes() {
    // Load navbar
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        try {
            const basePath = getBasePath();
            const response = await fetch(basePath + 'includes/navbar.html');
            if (response.ok) {
                let html = await response.text();
                // Fix absolute paths dynamically for subdirectories and GitHub Pages
                html = html.replace(/href="\//g, `href="${basePath}`);
                html = html.replace(/src="\//g, `src="${basePath}`);
                navbarPlaceholder.innerHTML = html;
                // Initialize navbar behaviors after loading
                initNavbarScroll();
                initMobileMenu();
                setActiveNavLink();
            }
        } catch (e) {
            console.warn('Navbar include not found:', e);
        }
    }

    // Load footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        try {
            const basePath = getBasePath();
            const response = await fetch(basePath + 'includes/footer.html');
            if (response.ok) {
                let html = await response.text();
                // Fix absolute paths dynamically for subdirectories and GitHub Pages
                html = html.replace(/href="\//g, `href="${basePath}`);
                html = html.replace(/src="\//g, `src="${basePath}`);
                footerPlaceholder.innerHTML = html;
            }
        } catch (e) {
            console.warn('Footer include not found:', e);
        }
    }
}

/**
 * Determine the base path relative to current page depth
 * Pages in /services/ or /products/ need "../" prefix
 */
function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/company/blog/')) {
        return '../../';
    }
    if (path.includes('/services/') || path.includes('/products/') || 
        path.includes('/company/') || path.includes('/legal/') || path.includes('/portal/')) {
        return '../';
    }
    return '';
}

/* ============================================================
   2. SCROLL REVEAL (IntersectionObserver)
   Elements with .reveal-* classes animate when scrolled into view
   ============================================================ */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.reveal-up, .reveal-fade, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger'
    );

    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Once revealed, stop observing (animate once)
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px' // Trigger slightly before fully visible
    });

    revealElements.forEach(el => observer.observe(el));
}

/* ============================================================
   3. SMOOTH SCROLL (for anchor links)
   ============================================================ */
function initSmoothScroll() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const targetId = link.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            const navbarHeight = 80;
            const top = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
}

/* ============================================================
   4. NAVBAR SCROLL EFFECT
   Adds 'scrolled' class when user scrolls past threshold
   ============================================================ */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const scrollThreshold = 50;

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Check on load
    handleScroll();

    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* ============================================================
   5. MOBILE MENU
   ============================================================ */
function initMobileMenu() {
    const toggle = document.querySelector('.navbar__toggle');
    const menu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');

    if (!toggle || !menu) return;

    function openMenu() {
        toggle.classList.add('active');
        menu.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
        if (menu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Mobile submenu toggles
    const submenuToggles = menu.querySelectorAll('[data-submenu]');
    submenuToggles.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const submenuId = btn.getAttribute('data-submenu');
            const submenu = document.getElementById(submenuId);
            if (submenu) {
                submenu.classList.toggle('active');
                btn.classList.toggle('active');
            }
        });
    });

    // Close menu when a non-submenu link is clicked
    const menuLinks = menu.querySelectorAll('a:not([data-submenu])');
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/* ============================================================
   6. SET ACTIVE NAV LINK
   Highlights the nav link matching the current page
   ============================================================ */
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    
    const allLinks = document.querySelectorAll('.nav-link, .nav-dropdown__link, .mobile-menu__link, .mobile-submenu__link');

    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        const linkPath = new URL(href, window.location.origin).pathname;
        
        // Match logic
        if (currentPath === linkPath) {
            link.classList.add('active');
            
            // Highlight parent desktop tab
            const parentNavItem = link.closest('.nav-item');
            if (parentNavItem) {
                const parentNavLink = parentNavItem.querySelector('.nav-link');
                if (parentNavLink) parentNavLink.classList.add('active');
            }
            
            // Highlight parent mobile tab
            const parentSubmenu = link.closest('.mobile-submenu');
            if (parentSubmenu) {
                const toggleBtn = document.querySelector(`[data-submenu="${parentSubmenu.id}"]`);
                if (toggleBtn) toggleBtn.classList.add('active');
            }
        }
    });
}

/* ============================================================
   7. BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 400) {
                    btn.classList.add('visible');
                } else {
                    btn.classList.remove('visible');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ============================================================
   8. CAROUSEL INITIALIZATION
   ============================================================ */
function initCarousels() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel__track');
        if (!track) return;
        
        let slides = Array.from(track.querySelectorAll('.carousel__slide'));
        if (slides.length === 0) return;
        
        let prevBtn = carousel.querySelector('.carousel__btn--prev');
        let nextBtn = carousel.querySelector('.carousel__btn--next');
        const dotsContainer = carousel.querySelector('.carousel__dots');
        
        // Ensure track is flex
        track.style.display = 'flex';
        
        // Wait slightly for CSS to fully apply and images/layout to settle
        setTimeout(() => {
            let slideWidth = slides[0].getBoundingClientRect().width || carousel.getBoundingClientRect().width / 3;
            
            // Calculate how many slides are currently visible based on screen size
            let visibleSlides = Math.round(track.getBoundingClientRect().width / slideWidth);
            if (isNaN(visibleSlides) || visibleSlides < 1) visibleSlides = 1;

            // Clone slides if there are exactly 3 and we are showing multiple per view (so we can actually scroll)
            if (slides.length === 3 && visibleSlides >= 2) {
                slides.forEach(slide => {
                    const clone = slide.cloneNode(true);
                    track.appendChild(clone);
                });
                slides = Array.from(track.querySelectorAll('.carousel__slide'));
            }

            let maxIndex = Math.max(0, slides.length - visibleSlides);
            let currentIndex = 0;
            let dots = [];

            function renderDots() {
                if (dotsContainer) {
                    dotsContainer.innerHTML = '';
                    dots = [];
                    for (let i = 0; i <= maxIndex; i++) {
                        const dot = document.createElement('button');
                        dot.classList.add('carousel__dot');
                        if (i === currentIndex) dot.classList.add('active');
                        dot.addEventListener('click', () => updateCarousel(i));
                        dotsContainer.appendChild(dot);
                        dots.push(dot);
                    }
                }
            }

            // Init dots
            renderDots();

            // Recalculate on window resize
            window.addEventListener('resize', () => {
                slideWidth = slides[0].getBoundingClientRect().width || carousel.getBoundingClientRect().width / 3;
                visibleSlides = Math.round(track.getBoundingClientRect().width / slideWidth);
                if (isNaN(visibleSlides) || visibleSlides < 1) visibleSlides = 1;
                maxIndex = Math.max(0, slides.length - visibleSlides);
                renderDots();
                updateCarousel(currentIndex, false);
            });

            function updateCarousel(index, animate = true) {
                if (index < 0) {
                    index = maxIndex;
                } else if (index > maxIndex) {
                    index = 0;
                }
                
                currentIndex = index;
                
                if (animate) {
                    track.style.transition = 'transform 0.4s ease-in-out';
                } else {
                    track.style.transition = 'none';
                }
                
                track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
                
                if (dots.length > 0) {
                    dots.forEach(d => d.classList.remove('active'));
                    const dotIndex = Math.min(currentIndex, dots.length - 1);
                    if (dots[dotIndex]) dots[dotIndex].classList.add('active');
                }
            }

            // Click listeners
            if (prevBtn) {
                const newPrev = prevBtn.cloneNode(true);
                prevBtn.replaceWith(newPrev);
                newPrev.addEventListener('click', () => updateCarousel(currentIndex - 1));
            }
            
            if (nextBtn) {
                const newNext = nextBtn.cloneNode(true);
                nextBtn.replaceWith(newNext);
                newNext.addEventListener('click', () => updateCarousel(currentIndex + 1));
            }

            // Autoplay
            if (carousel.hasAttribute('data-autoplay')) {
                const delay = parseInt(carousel.getAttribute('data-delay')) || 5000;
                let autoplayTimer = setInterval(() => updateCarousel(currentIndex + 1), delay);
                
                carousel.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
                carousel.addEventListener('mouseleave', () => {
                    autoplayTimer = setInterval(() => updateCarousel(currentIndex + 1), delay);
                });
            }
        }, 150); // 150ms delay to ensure layout metrics are accurate
    });
}

// Call initCarousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initCarousels();
});


/* ============================================================
   8. ADVANCED INTERACTIVITY (Light Theme Upgrade)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initMagneticButtons();
    initTiltCards();
    initParallax();
});

// Magnetic Buttons
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.hover-lift');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate movement from center
            const xMove = (x - rect.width / 2) * 0.3;
            const yMove = (y - rect.height / 2) * 0.3;
            
            this.style.transform = `translate(${xMove}px, ${yMove}px) scale(1.05)`;
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });
}

// 3D Tilt Effect for cards and media
function initTiltCards() {
    // 3D Tilt effect disabled per user request
    // Original behavior restored
}

// Simple Parallax for hero background
function initParallax() {
    const heroVideo = document.querySelector('.hero__bg-video');
    if (heroVideo) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            heroVideo.style.transform = `translateX(-50%) translateY(calc(-50% + ${scrollPos * 0.4}px))`;
        });
    }
}
