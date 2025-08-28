// Contact Page JavaScript - Modern Interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initAnimations();
    initContactForm();
    initFAQ();
    initLiveChat();
    initCounters();
    
    // Animation on scroll
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all sections for animations
        const sections = document.querySelectorAll('.contact-methods, .contact-form-section, .faq-section');
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Animate stats counter
    function initCounters() {
        function animateCounters() {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const text = counter.textContent;
                if (text === '24/7' || text === '5★' || text === '2h') {
                    // Already formatted, no animation needed
                    return;
                }
            });
        }

        // Trigger counter animation when hero is visible
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const heroSection = document.querySelector('.hero-contact');
        if (heroSection) {
            heroObserver.observe(heroSection);
        }
    }

    // Contact Form Functionality
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const messageTextarea = document.getElementById('message');
        const charCounter = document.querySelector('.char-counter');
        const submitBtn = document.querySelector('.submit-btn');
        const btnText = document.querySelector('.btn-text');
        const btnLoader = document.querySelector('.btn-loader');
        const formSuccess = document.querySelector('.form-success');

        // Character counter for message
        if (messageTextarea && charCounter) {
            messageTextarea.addEventListener('input', function() {
                const currentLength = this.value.length;
                const maxLength = 500;
                charCounter.textContent = `${currentLength}/${maxLength}`;
                
                if (currentLength > maxLength * 0.9) {
                    charCounter.style.color = '#dc3545';
                } else {
                    charCounter.style.color = '#666';
                }
            });
        }

        // Form validation and submission
        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                if (!validateForm()) {
                    return;
                }

                // Show loading state
                submitBtn.disabled = true;
                btnText.style.display = 'none';
                btnLoader.style.display = 'inline-flex';

                try {
                    // Simulate API call
                    await simulateFormSubmission();
                    
                    // Show success message
                    form.style.display = 'none';
                    formSuccess.style.display = 'block';
                    
                    // Scroll to success message
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                } catch (error) {
                    console.error('Error sending message:', error);
                    alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
                } finally {
                    // Reset button state
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline';
                    btnLoader.style.display = 'none';
                }
            });
        }

        function validateForm() {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    showFieldError(field, 'Este campo es obligatorio');
                    isValid = false;
                } else {
                    clearFieldError(field);
                }
            });

            // Email validation
            const emailField = document.getElementById('email');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    showFieldError(emailField, 'Por favor, ingresa un email válido');
                    isValid = false;
                }
            }

            // Phone validation (if provided)
            const phoneField = document.getElementById('phone');
            if (phoneField && phoneField.value) {
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(phoneField.value)) {
                    showFieldError(phoneField, 'Por favor, ingresa un teléfono válido');
                    isValid = false;
                }
            }

            return isValid;
        }

        function showFieldError(field, message) {
            clearFieldError(field);
            field.style.borderColor = '#dc3545';
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.color = '#dc3545';
            errorDiv.style.fontSize = '0.8rem';
            errorDiv.style.marginTop = '5px';
            errorDiv.textContent = message;
            
            field.parentNode.appendChild(errorDiv);
        }

        function clearFieldError(field) {
            field.style.borderColor = '#e9ecef';
            const existingError = field.parentNode.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }
        }

        async function simulateFormSubmission() {
            // Simulate API delay
            return new Promise(resolve => {
                setTimeout(resolve, 2000);
            });
        }
    }

    // FAQ Functionality
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // Live Chat functionality
    function initLiveChat() {
        // This would integrate with your actual chat system
        window.openLiveChat = function() {
            // Simulate opening chat
            alert('¡El chat en vivo se está iniciando! En un entorno real, esto abriría tu sistema de chat.');
            
            // Example integration with popular chat services:
            // Intercom: Intercom('show');
            // Zendesk: zE('widget', 'toggle');
            // Tawk.to: Tawk_API.toggle();
        };
    }

    // Parallax effect for floating elements
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.3;
            element.style.transform = `translateY(${parallax * speed}px)`;
        });
    });

    // Method cards hover effects
    const methodCards = document.querySelectorAll('.method-card');
    methodCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add entrance animations CSS
    const style = document.createElement('style');
    style.textContent = `
        .contact-methods,
        .contact-form-section,
        .faq-section {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s ease;
        }
        
        .contact-methods.animate-in,
        .contact-form-section.animate-in,
        .faq-section.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .method-card,
        .form-wrapper,
        .faq-item {
            transition: all 0.3s ease;
        }
        
        .floating-element {
            transition: transform 0.1s ease-out;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .method-card.featured {
            animation: pulse 2s infinite;
        }
        
        .method-card.featured:hover {
            animation: none;
        }
    `;
    document.head.appendChild(style);

    // Smooth page load animation
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Auto-scroll to form if hash is present
    if (window.location.hash === '#contact-form') {
        setTimeout(() => {
            document.querySelector('.contact-form-section').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 500);
    }
});

// Utility function to format phone numbers as user types
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{3})/, '($1) $2');
            }
            e.target.value = value;
        });
    }
});
