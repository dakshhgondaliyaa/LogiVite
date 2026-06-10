/* ============================================================
   FORM.JS — Form Validation and Submission Simulation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initForms();
});

function initForms() {
    const forms = document.querySelectorAll('.js-form');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm(form)) {
                submitForm(form);
            }
        });

        // Real-time validation on blur
        const inputs = form.querySelectorAll('.form__control[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateInput(input);
            });
            
            // Clear error on input
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    input.classList.remove('is-invalid');
                }
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('.form__control[required]');

    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMsg = 'This field is required';

    // Basic empty check
    if (value === '') {
        isValid = false;
    } else {
        // Type specific validation
        const type = input.getAttribute('type');
        
        if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMsg = 'Please enter a valid email address';
            }
        } else if (type === 'tel') {
            const phoneRegex = /^[0-9\+\-\s\(\)]{7,15}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMsg = 'Please enter a valid phone number';
            }
        }
    }

    // UI Updates
    const feedbackEl = input.nextElementSibling;
    
    if (!isValid) {
        input.classList.add('is-invalid');
        if (feedbackEl && feedbackEl.classList.contains('form__feedback')) {
            feedbackEl.textContent = errorMsg;
        }
    } else {
        input.classList.remove('is-invalid');
    }

    return isValid;
}

function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';
    form.classList.add('is-submitting');

    // Simulate API call (replace with actual fetch later)
    setTimeout(() => {
        form.classList.remove('is-submitting');
        form.classList.add('is-submitted');
        
        // Form is hidden and success message is shown via CSS
        // .form.is-submitted .form__success { display: block; }
        // .form.is-submitted .form__body { display: none; }
        
        // Reset form data for next time
        form.reset();
        
        // Re-enable button (though it's hidden now)
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
    }, 1500);
}
