/* ============================================================
   CAROUSEL.JS — Vanilla JS Slider for Testimonials
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initCarousels();
});

function initCarousels() {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel__track');
        const slides = Array.from(track.children);
        const nextBtn = carousel.querySelector('.carousel__btn--next');
        const prevBtn = carousel.querySelector('.carousel__btn--prev');
        const dotsNav = carousel.querySelector('.carousel__dots');
        
        if (!track || slides.length === 0) return;

        let currentIndex = 0;
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID;

        // Configuration
        const autoPlayEnabled = carousel.hasAttribute('data-autoplay');
        const autoPlayDelay = parseInt(carousel.getAttribute('data-delay')) || 5000;
        let autoPlayInterval;

        // Set up dots
        const dots = [];
        if (dotsNav) {
            slides.forEach((_, idx) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel__dot');
                if (idx === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
                dotsNav.appendChild(dot);
                dots.push(dot);

                dot.addEventListener('click', () => {
                    goToSlide(idx);
                });
            });
        }

        // Get slides visible per view based on CSS media queries
        const getSlidesPerView = () => {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        };

        // Update bounds to prevent scrolling past empty space
        const getMaxIndex = () => {
            return Math.max(0, slides.length - getSlidesPerView());
        };

        // Go to specific slide
        const goToSlide = (index) => {
            const maxIndex = getMaxIndex();
            
            // Boundary checks
            if (index < 0) {
                currentIndex = 0; // Don't loop back in this implementation
            } else if (index > maxIndex) {
                currentIndex = maxIndex;
            } else {
                currentIndex = index;
            }

            const slideWidth = slides[0].getBoundingClientRect().width;
            currentTranslate = currentIndex * -slideWidth;
            prevTranslate = currentTranslate;
            
            track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            track.style.transform = `translateX(${currentTranslate}px)`;

            updateDots();
            updateButtons();
            resetAutoPlay();
        };

        const updateDots = () => {
            if (!dotsNav) return;
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        };

        const updateButtons = () => {
            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex === getMaxIndex();
        };

        // Event Listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        }

        window.addEventListener('resize', () => {
            // Recalculate position on resize
            track.style.transition = 'none';
            goToSlide(currentIndex);
        });

        // Touch / Drag events
        track.addEventListener('touchstart', touchStart);
        track.addEventListener('touchend', touchEnd);
        track.addEventListener('touchmove', touchMove);

        // Mouse Drag events
        track.addEventListener('mousedown', touchStart);
        track.addEventListener('mouseup', touchEnd);
        track.addEventListener('mouseleave', () => {
            if (isDragging) touchEnd();
        });
        track.addEventListener('mousemove', touchMove);

        function touchStart(e) {
            isDragging = true;
            startPos = getPositionX(e);
            track.style.transition = 'none';
            cancelAnimationFrame(animationID);
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        }

        function touchMove(e) {
            if (!isDragging) return;
            const currentPosition = getPositionX(e);
            const diff = currentPosition - startPos;
            currentTranslate = prevTranslate + diff;
            track.style.transform = `translateX(${currentTranslate}px)`;
        }

        function touchEnd() {
            isDragging = false;
            const movedBy = currentTranslate - prevTranslate;
            const slideWidth = slides[0].getBoundingClientRect().width;
            
            // Threshold to register a swipe
            if (movedBy < -100 && currentIndex < getMaxIndex()) {
                currentIndex += 1;
            } else if (movedBy > 100 && currentIndex > 0) {
                currentIndex -= 1;
            }
            
            goToSlide(currentIndex);
            startAutoPlay();
        }

        function getPositionX(e) {
            return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        }

        // Auto play logic
        function startAutoPlay() {
            if (!autoPlayEnabled) return;
            autoPlayInterval = setInterval(() => {
                if (currentIndex >= getMaxIndex()) {
                    goToSlide(0); // Loop back
                } else {
                    goToSlide(currentIndex + 1);
                }
            }, autoPlayDelay);
        }

        function resetAutoPlay() {
            if (!autoPlayEnabled) return;
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }

        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            startAutoPlay();
        });

        // Init
        updateButtons();
        startAutoPlay();
    });
}
