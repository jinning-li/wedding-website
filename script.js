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
        const additionalGuestsCountSelect = document.getElementById('additionalGuestsCount');
        const guestNamesContainer = document.getElementById('guest-names-container');

        // Function to generate additional guest name and meal inputs
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

                const mealGroup = document.createElement('div');
                mealGroup.classList.add('form-group');
                mealGroup.style.marginTop = '1rem';
                
                const mealLabel = document.createElement('label');
                mealLabel.setAttribute('for', `additionalGuestMeal${i}`);
                mealLabel.textContent = `Additional Guest ${i} Entrée / 第${i}位随行宾客主菜`;
                
                const mealSelect = document.createElement('select');
                mealSelect.id = `additionalGuestMeal${i}`;
                mealSelect.name = `additionalGuestMeal${i}`;
                mealSelect.required = true;
                
                const optionDefault = document.createElement('option');
                optionDefault.value = '';
                optionDefault.disabled = true;
                optionDefault.selected = true;
                optionDefault.textContent = 'Select an option / 请选择';
                
                const optionSalmon = document.createElement('option');
                optionSalmon.value = 'Salmon';
                optionSalmon.textContent = 'Salmon (Beluga Lentils, Broccolini, Bearnaise) / 香煎三文鱼';
                
                const optionShortRib = document.createElement('option');
                optionShortRib.value = 'Short Rib';
                optionShortRib.textContent = 'Short Rib (Potato Puree, Broccolini, Red Wine Demi) / 慢炖牛小排';
                
                mealSelect.appendChild(optionDefault);
                mealSelect.appendChild(optionSalmon);
                mealSelect.appendChild(optionShortRib);
                
                mealGroup.appendChild(mealLabel);
                mealGroup.appendChild(mealSelect);
                
                inputGroup.appendChild(mealGroup);

                guestNamesContainer.appendChild(inputGroup);
            }
        };

        // Add event listener to the guest count dropdown
        additionalGuestsCountSelect.addEventListener('change', (event) => {
            const count = parseInt(event.target.value, 10);
            generateGuestInputs(count);
        });

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

            const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbybrwdwDriS_2h1RQMoJOvbjz9079vP0zP9xxqvupG8QRjy5_1cMCHwsiaKcTSuYIWo9Q/exec';

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
