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
        const additionalGuestsSection = document.getElementById('additional-guests-section');
        const attendanceRadios = rsvpForm.querySelectorAll('input[name="attendance"]');

        // Function to check attendance and toggle guest section
        const toggleGuestSection = () => {
            const attending = document.getElementById('attend').checked;
            const additionalGuestsSelect = document.getElementById('additionalGuests');

            if (attending) {
                additionalGuestsSection.style.display = 'block';
                additionalGuestsSelect.disabled = false;
            } else {
                additionalGuestsSection.style.display = 'none';
                additionalGuestsSelect.disabled = true;
            }
        };

        // Add event listeners to radio buttons
        attendanceRadios.forEach(radio => {
            radio.addEventListener('change', toggleGuestSection);
        });

        // Initial check in case "attending" is checked by default
        toggleGuestSection();

        // Prevent form submission on "Enter" key press in text fields
        rsvpForm.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && event.target.nodeName === 'INPUT') {
                event.preventDefault();
            }
        });

        rsvpForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(rsvpForm);
            const data = Object.fromEntries(formData.entries());

            // Show loading state if needed, e.g., disable button
            const submitButton = rsvpForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            // Replace with your Google Apps Script URL
            const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbzvacGqLHtMzgplHqcE2XdqqbqO7_JKgdB5dgv4fIpCZySAVdkMwDMlJRGWA8z5ZNTFwA/exec';

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
