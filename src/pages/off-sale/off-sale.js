// Offers Page JavaScript - Modern Interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initCountdown();
    initFlashDeals();
    initDailyDeals();
    initCategoryCards();
    initNewsletterForm();
    initAnimations();
    
    // Countdown Timer
    function initCountdown() {
        // Set countdown target (2 days from now for demo)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 2);
        targetDate.setHours(23, 59, 59, 999);
        
        const countdown = document.getElementById('flashCountdown');
        if (!countdown) return;
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;
            
            if (distance < 0) {
                // Countdown finished - restart with new date
                targetDate.setDate(targetDate.getDate() + 3);
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // Flash Deals Data and Loading
    function initFlashDeals() {
        const flashDealsGrid = document.getElementById('flashDealsGrid');
        const dealsLoading = document.querySelector('.deals-loading');
        
        if (!flashDealsGrid) return;
        
        // Sample flash deals data
        const flashDeals = [
            {
                id: 1,
                name: 'RTX 4070 Super',
                originalPrice: 699,
                salePrice: 489,
                discount: 30,
                image: '../../assets/images/geforce-rtx-5090-learn-more-og-1200x630.jpg',
                stock: 15,
                totalStock: 50,
                timeLeft: '02:15:30'
            },
            {
                id: 2,
                name: 'Intel i7-13700K',
                originalPrice: 449,
                salePrice: 359,
                discount: 20,
                image: '../../assets/images/intel i7.png',
                stock: 8,
                totalStock: 25,
                timeLeft: '01:45:20'
            },
            {
                id: 3,
                name: 'DDR5 32GB Kit',
                originalPrice: 299,
                salePrice: 189,
                discount: 37,
                image: '../../assets/images/ddr5.png',
                stock: 22,
                totalStock: 40,
                timeLeft: '03:20:15'
            },
            {
                id: 4,
                name: 'ASUS ROG Motherboard',
                originalPrice: 399,
                salePrice: 279,
                discount: 30,
                image: '../../assets/images/ROG PLACA MADRE.png',
                stock: 12,
                totalStock: 30,
                timeLeft: '02:35:45'
            }
        ];
        
        // Simulate loading
        setTimeout(() => {
            dealsLoading.style.display = 'none';
            flashDealsGrid.innerHTML = '';
            
            flashDeals.forEach(deal => {
                const dealCard = createDealCard(deal);
                flashDealsGrid.appendChild(dealCard);
            });
            
            // Animate cards entrance
            const cards = flashDealsGrid.querySelectorAll('.deal-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(50px)';
                    card.style.transition = 'all 0.5s ease';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                }, index * 200);
            });
        }, 1500);
    }
    
    function createDealCard(deal) {
        const card = document.createElement('div');
        card.className = 'deal-card';
        
        const stockPercentage = (deal.stock / deal.totalStock) * 100;
        
        card.innerHTML = `
            <div class="deal-timer">${deal.timeLeft}</div>
            <div class="deal-image">
                <img src="${deal.image}" alt="${deal.name}" onerror="this.src='../../assets/images/image2.png'">
                <div class="deal-discount">-${deal.discount}%</div>
            </div>
            <div class="deal-info">
                <h4>${deal.name}</h4>
                <div class="deal-pricing">
                    <span class="original-price">$${deal.originalPrice}</span>
                    <span class="deal-price">$${deal.salePrice}</span>
                </div>
                <div class="deal-progress">
                    <div class="progress-label">
                        <span>Vendidos: ${deal.totalStock - deal.stock}</span>
                        <span>Quedan: ${deal.stock}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${100 - stockPercentage}%"></div>
                    </div>
                </div>
                <button class="deal-btn" onclick="addToCart(${deal.id})">
                    <i class="fas fa-bolt"></i> Comprar Ahora
                </button>
            </div>
        `;
        
        return card;
    }
    
    // Daily Deals Carousel
    function initDailyDeals() {
        const track = document.getElementById('dailyDealsTrack');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (!track) return;
        
        // Sample daily deals
        const dailyDeals = [
            { name: 'MSI Gaming Laptop', price: 1299, originalPrice: 1599, image: '../../assets/images/desktopHP.jpg' },
            { name: 'Corsair RGB Mouse', price: 79, originalPrice: 99, image: '../../assets/images/corsair.png' },
            { name: 'Samsung SSD 1TB', price: 89, originalPrice: 129, image: '../../assets/images/sansumg.png' },
            { name: 'HP Pavilion Monitor', price: 199, originalPrice: 249, image: '../../assets/images/hp pavilion.png' },
            { name: 'Corsair Power Supply', price: 149, originalPrice: 189, image: '../../assets/images/fuente de poder.png' },
            { name: 'ASUS Gaming Monitor', price: 299, originalPrice: 379, image: '../../assets/images/asus.jpg' }
        ];
        
        // Populate daily deals
        track.innerHTML = '';
        dailyDeals.forEach(deal => {
            const dealElement = document.createElement('div');
            dealElement.className = 'deal-card';
            dealElement.innerHTML = `
                <div class="deal-image">
                    <img src="${deal.image}" alt="${deal.name}" onerror="this.src='../../assets/images/image2.png'">
                    <div class="deal-discount">-${Math.round((1 - deal.price / deal.originalPrice) * 100)}%</div>
                </div>
                <div class="deal-info">
                    <h4>${deal.name}</h4>
                    <div class="deal-pricing">
                        <span class="original-price">$${deal.originalPrice}</span>
                        <span class="deal-price">$${deal.price}</span>
                    </div>
                    <button class="deal-btn" onclick="addToCart('daily-${deal.name}')">
                        <i class="fas fa-shopping-cart"></i> Añadir
                    </button>
                </div>
            `;
            track.appendChild(dealElement);
        });
        
        // Carousel functionality
        let currentIndex = 0;
        const cardWidth = 320; // Approximate card width + gap
        
        function updateCarousel() {
            const offset = -currentIndex * cardWidth;
            track.style.transform = `translateX(${offset}px)`;
        }
        
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            const maxIndex = Math.max(0, dailyDeals.length - 3); // Show 3 cards at a time
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });
        
        // Auto-scroll carousel
        setInterval(() => {
            const maxIndex = Math.max(0, dailyDeals.length - 3);
            currentIndex = (currentIndex + 1) % (maxIndex + 1);
            updateCarousel();
        }, 5000);
    }
    
    // Category Cards Interaction
    function initCategoryCards() {
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                // In a real application, this would navigate to the category page
                console.log(`Navigating to category: ${category}`);
                
                // Visual feedback
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
                
                // Simulate navigation
                alert(`Navegando a la categoría: ${card.querySelector('h3').textContent}`);
            });
        });
    }
    
    // Newsletter Form
    function initNewsletterForm() {
        const form = document.getElementById('newsletterForm');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Suscribiendo...';
            submitBtn.disabled = true;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Success feedback
                submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Suscrito!';
                submitBtn.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
                emailInput.value = '';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
                
            } catch (error) {
                console.error('Newsletter subscription error:', error);
                submitBtn.innerHTML = '<i class="fas fa-times"></i> Error';
                submitBtn.style.background = 'linear-gradient(45deg, #dc3545, #c82333)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
    
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
        const sections = document.querySelectorAll('.deal-categories, .flash-deals, .daily-deals, .bundle-offers, .newsletter-offers');
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // Parallax effect for floating elements
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        const floatingElements = document.querySelectorAll('.floating-element, .floating-discount');
        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.2;
            element.style.transform = `translateY(${parallax * speed}px)`;
        });
    });
    
    // Add entrance animations CSS
    const style = document.createElement('style');
    style.textContent = `
        .deal-categories,
        .flash-deals,
        .daily-deals,
        .bundle-offers,
        .newsletter-offers {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s ease;
        }
        
        .deal-categories.animate-in,
        .flash-deals.animate-in,
        .daily-deals.animate-in,
        .bundle-offers.animate-in,
        .newsletter-offers.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .floating-element,
        .floating-discount {
            transition: transform 0.1s ease-out;
        }
    `;
    document.head.appendChild(style);
    
    // Global functions for buttons
    window.addToCart = function(productId) {
        // In a real application, this would add the item to cart
        console.log(`Adding product ${productId} to cart`);
        
        // Visual feedback
        const button = event.target.closest('.deal-btn') || event.target.closest('.bundle-btn');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-check"></i> ¡Añadido!';
        button.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
        
        // Show notification
        showNotification('Producto añadido al carrito', 'success');
    };
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#667eea'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Smooth page load animation
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
