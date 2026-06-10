/* ============================================================
   COUNTER.JS — Animated Number Counters
   Animates statistics when they scroll into view
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initCounters();
});

function initCounters() {
    const counterElements = document.querySelectorAll('.js-counter');

    if (counterElements.length === 0) return;

    // Optional formatters (e.g. adding '+' or ',' to the number)
    const formatNumber = (num, format) => {
        if (format === 'percent') return `${num}%`;
        if (format === 'plus') return `${num}+`;
        if (format === 'comma') return num.toLocaleString();
        return num;
    };

    const animateCounter = (el) => {
        const targetValue = parseFloat(el.getAttribute('data-target'));
        const duration = parseInt(el.getAttribute('data-duration')) || 2000; // default 2s
        const format = el.getAttribute('data-format') || 'raw';
        
        // Handle numbers with decimals vs integers
        const isDecimal = targetValue % 1 !== 0;
        
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Easing function (easeOutExpo)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const currentVal = easeProgress * targetValue;
            
            if (isDecimal) {
                el.textContent = formatNumber(currentVal.toFixed(1), format);
            } else {
                el.textContent = formatNumber(Math.floor(currentVal), format);
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Ensure final value is exact
                el.textContent = formatNumber(targetValue, format);
            }
        };
        
        window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                // Unobserve so it only animates once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5 // Start when 50% visible
    });

    counterElements.forEach(el => observer.observe(el));
}
