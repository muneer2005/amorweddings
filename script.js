document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Portfolio filtering and gallery
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const galleryModal = document.getElementById('gallery-modal');
    const galleryImage = document.getElementById('gallery-image');
    const imageCaption = document.querySelector('.image-caption');
    const closeModal = document.querySelector('.close-modal');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const loadingIndicator = document.getElementById('loading');
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.textContent = 'Load More';
    loadMoreBtn.classList.add('cta-button', 'load-more-btn');
    loadMoreBtn.style.display = 'none';
    portfolioGrid.after(loadMoreBtn);

    let page = 1;
    let isLoading = false;
    let hasMoreItems = true;
    let currentIndex = 0;
    let portfolioItems = [];

    async function fetchPortfolioItems(page, filter = 'all') {
        const itemsPerPage = 8;
        const allItems = [
            { src: 'public/images/suits/suit-2.jpg', alt: 'Dapper Brown Suit', category: 'suits', caption: 'Retro Style with a Contemporary Edge' },
            { src: 'public/images/traditionalwear/traditionalwear-1.jpg', alt: 'Kandura with Bisht', category: 'traditionalwear', caption: 'Traditional Arabian Kandura with Bisht' },
            { src: 'public/images/suits/suit-3.jpg', alt: 'Regal Bandhgala Suit', category: 'suits', caption: ' Elevate Your Presence with Embroidered Elegance' },
            { src: 'public/images/traditionalwear/traditionalwear-2.jpg', alt: 'Off-White Sherwani', category: 'traditionalwear', caption: 'Minimalist Style for the Contemporary Gentleman.' },
            { src: 'public/images/suits/suit-4.jpg', alt: 'Black Mandarin-Collar Suit', category: 'suits', caption: 'The All-Black Mandarin Suit for Effortless Class' },
            { src: 'public/images/traditionalwear/traditionalwear-3.jpg', alt: 'Ivory Majesty Sherwani', category: 'traditionalwear', caption: 'An embodiment of refined elegance' },
            { src: 'public/images/suits/suit-5.jpg', alt: 'Two-Tone Blazer with Beige Accents', category: 'suits', caption: 'Embracing Contrast with a Bold Black and Beige Suit' },
            { src: 'public/images/traditionalwear/traditionalwear-4.jpg', alt: 'Sublime Ivory Kurta Set', category: 'traditionalwear', caption: 'A timeless piece for the modern man.' },
            { src: 'public/images/suits/suit-6.jpg', alt: 'Two-Tone Blazer with Beige Accents', category: 'suits', caption: 'Embracing Contrast with a Bold Black and Beige Suit' },
            { src: 'public/images/traditionalwear/traditionalwear-5.jpg', alt: 'Noir Luxe Kurta', category: 'traditionalwear', caption: 'A statement of bold elegance.' },
            { src: 'public/images/suits/suit-7.jpg', alt: 'Black Sherwani', category: 'suits', caption: 'Elegance with a Touch of Embroidery.' },
          //  { src: 'public/images/traditionalwear/traditionalwear-6.jpg', alt: 'Classic White Kurta Pajama', category: 'traditionalwear', caption: 'Embrace Timeless Tradition with a Modern Twist' }, //
            { src: 'public/images/suits/suit-8.jpg', alt: 'Midnight Elegance Tuxedo', category: 'suits', caption: 'classic sophistication meets modern flair.' },
            { src: 'public/images/traditionalwear/traditionalwear-7.jpg', alt: 'Elegant White Sherwani', category: 'traditionalwear', caption: 'Timeless Sophistication with Intricate Embroidery' },
          //  { src: 'public/images/suits/suit-9.jpg', alt: 'Black Majesty Sherwani', category: 'suits', caption: 'A Timeless Fusion of Tradition and Modern Elegance.' }, //
            { src: 'public/images/traditionalwear/traditionalwear-8.jpg', alt: 'Regal Kurta Ensemble', category: 'traditionalwear', caption: 'A look that exudes sophistication and grace.' },
            { src: 'public/images/suits/suit-10.jpg', alt: 'Onyx Regal Sherwani', category: 'suits', caption: 'Exude Unmatched Sophistication with the Onyx Sherwani' },
            { src: 'public/images/traditionalwear/traditionalwear-9.jpg', alt: 'Royal Ethnic Kurta-Dhoti', category: 'traditionalwear', caption: 'Embracing Cultural Heritage with Modern Sophistication' },
            // Add more items as needed
        ];
        const filteredItems = filter === 'all' ? allItems : allItems.filter(item => item.category === filter);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const items = filteredItems.slice(startIndex, endIndex);
    
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
    
        return {
            items,
            hasMore: endIndex < filteredItems.length
        };
    }

    function renderPortfolioItems(items) {
        const itemsHTML = items.map((item, index) => `
            <div class="portfolio-item" data-category="${item.category}" data-index="${portfolioItems.length + index}">
                <img src="${item.src}" alt="${item.alt}" class="portfolio-img">
                <div class="portfolio-overlay">
                    <h3>${item.alt}</h3>
                    <p>${item.caption}</p>
                </div>
            </div>
        `).join('');
        portfolioGrid.insertAdjacentHTML('beforeend', itemsHTML);
        portfolioItems = portfolioItems.concat(items);

        document.querySelectorAll('.portfolio-item:not(.initialized)').forEach(item => {
            item.addEventListener('click', openGallery);
            item.classList.add('initialized');
        });
    }

    async function loadMoreItems() {
        if (isLoading || !hasMoreItems) return;

        isLoading = true;
        loadingIndicator.style.display = 'block';
        loadMoreBtn.style.display = 'none';

        try {
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            const result = await fetchPortfolioItems(page, activeFilter);
            renderPortfolioItems(result.items);
            hasMoreItems = result.hasMore;
            page++;
        } catch (error) {
            console.error('Error loading portfolio items:', error);
        } finally {
            isLoading = false;
            loadingIndicator.style.display = 'none';
            loadMoreBtn.style.display = hasMoreItems ? 'block' : 'none';
        }
    }

    loadMoreBtn.addEventListener('click', loadMoreItems);

    // Gallery functionality
    const openGallery = (e) => {
        const clickedItem = e.currentTarget;
        currentIndex = parseInt(clickedItem.dataset.index);
        updateGalleryImage();
        galleryModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    const closeGallery = () => {
        galleryModal.style.display = 'none';
        document.body.style.overflow = '';
    };

    const updateGalleryImage = () => {
        const item = portfolioItems[currentIndex];
        galleryImage.src = item.src;
        galleryImage.alt = item.alt;
        imageCaption.textContent = item.caption;
    };

    const navigateGallery = (direction) => {
        currentIndex = (currentIndex + direction + portfolioItems.length) % portfolioItems.length;
        updateGalleryImage();
    };

    // Swipe functionality for gallery
    let touchStartX = 0;
    let touchEndX = 0;

    galleryModal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    galleryModal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    const handleSwipe = () => {
        const swipeThreshold = 50; // Minimum distance for a swipe
        if (touchEndX < touchStartX - swipeThreshold) navigateGallery(1); // Swipe left
        if (touchEndX > touchStartX + swipeThreshold) navigateGallery(-1); // Swipe right
    };

    // Keyboard navigation for gallery
    document.addEventListener('keydown', (e) => {
        if (galleryModal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') navigateGallery(-1);
            if (e.key === 'ArrowRight') navigateGallery(1);
            if (e.key === 'Escape') closeGallery();
        }
    });


    closeModal.addEventListener('click', closeGallery);
    prevBtn.addEventListener('click', () => navigateGallery(-1));
    nextBtn.addEventListener('click', () => navigateGallery(1));

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const filter = button.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            portfolioGrid.innerHTML = '';
            portfolioItems = [];
            page = 1;
            hasMoreItems = true;

            await loadMoreItems();
        });
    });

    // Initial load
    loadMoreItems();

    console.log("Portfolio functionality has been updated with a 'Load More' button.");

    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial-item');
    const prevButton = document.querySelector('.prev-testimonial');
    const nextButton = document.querySelector('.next-testimonial');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        testimonials[index].classList.add('active');
    }

    prevButton.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    });

    nextButton.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    });

    // Show first testimonial initially
    showTestimonial(currentTestimonial);

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const formGroups = document.querySelectorAll('.form-group');

    // Add animation to form inputs
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');

        input.addEventListener('focus', () => {
            label.classList.add('active');
        });

        input.addEventListener('blur', () => {
            if (input.value === '') {
                label.classList.remove('active');
            }
        });
    });

    // Form submission with validation and AJAX
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic form validation
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        if (!name.value || !email.value || !message.value) {
            alert('Please fill in all required fields.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Simulate form submission with a delay
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');

        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        try {
            // Simulate an API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success message
            alert('Thank you for your message. We will get back to you soon!');
            contactForm.reset();

            // Reset button state
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
            btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';

            // Reset labels
            formGroups.forEach(group => {
                const label = group.querySelector('label');
                label.classList.remove('active');
            });
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');

            // Reset button state
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
            btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
        }
    });

    // Lazy Loading Images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const loadImage = (image) => {
        image.setAttribute('src', image.getAttribute('data-src'));
        image.onload = () => {
            image.removeAttribute('data-src');
            image.classList.add('fade-in');
        };
    };

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        lazyImages.forEach(img => loadImage(img));
    }

    // Header Scroll Effect
    const header = document.getElementById('header');
    const headerScrollThreshold = 100;

    window.addEventListener('scroll', () => {
        if (window.scrollY > headerScrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Footer year update
    const currentYear = new Date().getFullYear();
    document.querySelector('.footer-bottom p', 'footer-bottom b').innerHTML = `<p>© ${currentYear} Amor Weddings. All rights reserved. Created by <a  href="https://muhammedmuneer.onrender.com" href="mmk" ><b>MMK</a>.</b></p>`;

    document.getElementById('hero-video').addEventListener('loadeddata', function() {
        document.querySelector('.hero-spinner-overlay').classList.add('hidden-hero-spinner');
    });
    
});

