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
        const additionalGuestsCountSelect = document.getElementById('additionalGuestsCount');
        const guestNamesContainer = document.getElementById('guest-names-container');

        // Function to generate additional guest name inputs
        const generateGuestInputs = (count) => {
            guestNamesContainer.innerHTML = ''; // Clear previous inputs
            for (let i = 1; i <= count; i++) {
                const inputGroup = document.createElement('div');
                inputGroup.classList.add('form-group');

                const label = document.createElement('label');
                label.setAttribute('for', `additionalGuestName${i}`);
                label.textContent = `Additional Guest ${i} Name / 第${i}位随行宾客姓名`;

                const helperText = document.createElement('p');
                helperText.classList.add('helper-text');
                helperText.textContent = 'For dinner table name cards / 用于制作席位卡';

                const input = document.createElement('input');
                input.type = 'text';
                input.id = `additionalGuestName${i}`;
                input.name = `additionalGuestName${i}`;
                input.required = true;

                inputGroup.appendChild(label);
                inputGroup.appendChild(helperText);
                inputGroup.appendChild(input);
                guestNamesContainer.appendChild(inputGroup);
            }
        };

        // Function to check attendance and toggle guest section
        const toggleGuestSection = () => {
            const attending = document.getElementById('attend').checked;
            if (attending) {
                additionalGuestsSection.style.display = 'block';
                additionalGuestsCountSelect.disabled = false;
                // Trigger change to show/hide inputs based on current selection
                generateGuestInputs(parseInt(additionalGuestsCountSelect.value, 10));
            } else {
                additionalGuestsSection.style.display = 'none';
                additionalGuestsCountSelect.disabled = true;
                generateGuestInputs(0); // Clear inputs when declining
            }
        };

        // Add event listeners to radio buttons
        attendanceRadios.forEach(radio => {
            radio.addEventListener('change', toggleGuestSection);
        });

        // Add event listener to the guest count dropdown
        additionalGuestsCountSelect.addEventListener('change', (event) => {
            const count = parseInt(event.target.value, 10);
            generateGuestInputs(count);
        });

        // Initial check
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

            // Show loading state
            const submitButton = rsvpForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbzJ2wdTubaObB2lGL0r6C_7y7Ombdt5IjM9HH3SbfHkgrcKbCwvJJnfTbMX0-5aefH46w/exec';

            fetch(googleAppsScriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(() => {
                rsvpForm.style.display = 'none';
                successMessage.style.display = 'block';
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('There was an error submitting your RSVP. Please try again.');
                submitButton.disabled = false;
                submitButton.textContent = 'Submit / 提交';
            });
        });
    }
});
