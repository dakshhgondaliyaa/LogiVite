/* ============================================================
   TABS.JS — Tab Switcher Logic
   Used for Homepage Product Modules and Pricing Toggle
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
});

function initTabs() {
    const tabGroups = document.querySelectorAll('.js-tabs');

    tabGroups.forEach(group => {
        const btns = group.querySelectorAll('.js-tab-btn');
        const panels = group.querySelectorAll('.js-tab-panel');

        if (btns.length === 0 || panels.length === 0) return;

        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = btn.getAttribute('data-target');
                if (!targetId) return;

                // Remove active class from all buttons and panels in this group
                btns.forEach(b => b.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));

                // Add active class to clicked button and target panel
                btn.classList.add('active');
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    
                    // Trigger reflow to restart CSS animations if any
                    void targetPanel.offsetWidth;
                }
            });
        });
    });
}
