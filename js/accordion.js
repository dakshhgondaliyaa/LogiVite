/* ============================================================
   ACCORDION.JS — Logic for FAQ sections
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initAccordions();
    initFAQSidebar();
});

function initAccordions() {
    const accordions = document.querySelectorAll('.js-accordion');

    accordions.forEach(accordion => {
        const header = accordion.querySelector('.js-accordion-header');
        const content = accordion.querySelector('.js-accordion-content');
        
        if (!header || !content) return;

        // Optional: allow only one open at a time within a group
        const group = accordion.getAttribute('data-group');

        header.addEventListener('click', () => {
            const isOpen = accordion.classList.contains('active');

            // If grouping enabled, close others
            if (group && !isOpen) {
                const groupItems = document.querySelectorAll(`.js-accordion[data-group="${group}"]`);
                groupItems.forEach(item => {
                    if (item !== accordion && item.classList.contains('active')) {
                        closeAccordion(item);
                    }
                });
            }

            if (isOpen) {
                closeAccordion(accordion);
            } else {
                openAccordion(accordion);
            }
        });
    });
}

function openAccordion(accordion) {
    const content = accordion.querySelector('.js-accordion-content');
    accordion.classList.add('active');
    
    // Animate height
    content.style.maxHeight = content.scrollHeight + 'px';
    
    // Reset max-height after animation so it responds to window resize
    setTimeout(() => {
        if (accordion.classList.contains('active')) {
            content.style.maxHeight = 'none';
        }
    }, 300); // matches CSS transition time
}

function closeAccordion(accordion) {
    const content = accordion.querySelector('.js-accordion-content');
    
    // Explicitly set height before collapsing to trigger animation
    content.style.maxHeight = content.scrollHeight + 'px';
    
    // Force repaint
    content.offsetHeight;
    
    accordion.classList.remove('active');
    content.style.maxHeight = '0px';
}

/* ============================================================
   FAQ SIDEBAR FILTERING
   Used on the main FAQs page to show/hide categories
   ============================================================ */
function initFAQSidebar() {
    const sidebarBtns = document.querySelectorAll('.faq-sidebar__btn');
    const faqCategories = document.querySelectorAll('.faq-category');

    if (sidebarBtns.length === 0 || faqCategories.length === 0) return;

    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons
            sidebarBtns.forEach(b => b.classList.remove('active'));
            
            // Add active to clicked
            btn.classList.add('active');

            const targetId = btn.getAttribute('data-target');

            // Filter logic
            faqCategories.forEach(category => {
                if (targetId === 'all') {
                    category.style.display = 'block';
                    // Re-trigger scroll reveal if needed
                    category.classList.remove('revealed');
                    setTimeout(() => category.classList.add('revealed'), 50);
                } else {
                    if (category.id === targetId) {
                        category.style.display = 'block';
                        category.classList.remove('revealed');
                        setTimeout(() => category.classList.add('revealed'), 50);
                    } else {
                        category.style.display = 'none';
                    }
                }
            });

            // On mobile, scroll up to the top of the FAQ list
            if (window.innerWidth < 1024) {
                const listTop = document.querySelector('.faq-layout').getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: listTop, behavior: 'smooth' });
            }
        });
    });
}
