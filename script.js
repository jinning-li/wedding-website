document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.fade-in-up');

    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        animatedElements.forEach(element => {
            element.classList.add('visible');
        });
        return;
    }

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // RSVP Form Submission
    const rsvpForm = document.getElementById('rsvp-form');
    const successMessage = document.getElementById('success-message');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(rsvpForm);
            const data = Object.fromEntries(formData.entries());

            // Show loading state if needed, e.g., disable button
            const submitButton = rsvpForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            // Replace with your Google Apps Script URL
            const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbycbUsa1jjmUChea9qm0OTAI95XmzrPCqCpGgdVGdJNuzsR62xL8Hxmof_w4rYaSfhnuQ/exec';

            fetch(googleAppsScriptUrl, {
                method: 'POST',
                mode: 'no-cors', // Important for Google Apps Script web apps
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(() => {
                // Since 'no-cors' hides the actual response, we assume success
                rsvpForm.style.display = 'none';
                successMessage.style.display = 'block';
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('There was an error submitting your RSVP. Please try again.');
                // Re-enable the button
                submitButton.disabled = false;
                submitButton.textContent = 'Submit / 提交';
            });
        });
    }
});
