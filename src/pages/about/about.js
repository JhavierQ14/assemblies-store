// About Page JavaScript - Modern Interactions

document.addEventListener('DOMContentLoaded', function() {
    // Animation on scroll
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
    const sections = document.querySelectorAll('.mission-section, .why-choose-us, .team-section, .reviews-section, .cta-section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Animate stats counter
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + '+';
                }
            }, 40);
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

    const heroSection = document.querySelector('.hero-about');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // Smooth scrolling for CTA buttons
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const href = button.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

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

    // Team member card interactions
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', () => {
            member.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        member.addEventListener('mouseleave', () => {
            member.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Review cards auto-rotation (optional)
    const reviewCards = document.querySelectorAll('.review-card');
    let currentReview = 0;
    
    function highlightReview() {
        reviewCards.forEach((card, index) => {
            card.style.opacity = index === currentReview ? '1' : '0.7';
            card.style.transform = index === currentReview ? 'scale(1.02)' : 'scale(1)';
        });
        currentReview = (currentReview + 1) % reviewCards.length;
    }

    // Start review highlighting every 3 seconds
    if (reviewCards.length > 0) {
        setInterval(highlightReview, 3000);
    }

    // Add entrance animations CSS
    const style = document.createElement('style');
    style.textContent = `
        .mission-section,
        .why-choose-us,
        .team-section,
        .reviews-section,
        .cta-section {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s ease;
        }
        
        .mission-section.animate-in,
        .why-choose-us.animate-in,
        .team-section.animate-in,
        .reviews-section.animate-in,
        .cta-section.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .mission-card,
        .feature-card,
        .team-member,
        .review-card {
            transition: all 0.3s ease;
        }
        
        .floating-element {
            transition: transform 0.1s ease-out;
        }
    `;
    document.head.appendChild(style);

    // Smooth page load animation
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add some dynamic content based on current date
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
