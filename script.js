document.addEventListener("DOMContentLoaded", function () {
    const viewButtons = document.querySelectorAll(".view-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");

    viewButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Hapus class aktif dari tombol lain
            viewButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const view = button.getAttribute("data-view");

            // Tampilkan hanya gambar yang sesuai
            galleryItems.forEach(item => {
                if (view === "portrait") {
                    item.style.display = item.classList.contains("landscape") ? "none" : "block";
                } else if (view === "landscape") {
                    item.style.display = item.classList.contains("landscape") ? "block" : "none";
                } else {
                    item.style.display = "block"; // Tampilkan semua jika 'all'
                }
            });
        });
    });
});


// Function to update progress bar
function updateProgressBar(section) {
    const milestones = section.querySelectorAll('.milestone');
    const completedMilestones = section.querySelectorAll('.milestone.completed');
    const progressBar = section.querySelector('.progress-bar');
    const progress = (completedMilestones.length / milestones.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Modify the observer to only animate specific sections
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Only add animations for sections up to weekly subject
            if (entry.target.matches('.hero, .about, .stats-container, .roadmap, .hours-breakdown')) {
                entry.target.classList.add('visible');
            }
            
            // If it's a stat item within these sections, trigger counting animation
            if (entry.target.classList.contains('stat-item')) {
                startCountAnimation(entry.target);
            }
        }
    });
}, {
    threshold: 0.1
});

// Handle card interactions
document.addEventListener('DOMContentLoaded', () => {
    // Observe only specific sections
    const sectionsToAnimate = document.querySelectorAll('.hero, .about, .stats-container, .roadmap, .hours-breakdown');
    sectionsToAnimate.forEach(section => {
        observer.observe(section);
    });

    // Observe hero elements
    const title = document.querySelector('.title');
    observer.observe(title);

    const keyTexts = document.querySelectorAll('.key-texts p');
    keyTexts.forEach((text, index) => {
        text.style.setProperty('--text-index', index);
        observer.observe(text);
    });

    // Observe about section elements
    const aboutDescription = document.querySelector('.about-description');
    if (aboutDescription) {
        observer.observe(aboutDescription);
    }

    // Initialize stats with click interaction
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach((stat, index) => {
        stat.style.setProperty('--stat-index', index);
        observer.observe(stat);

        // Add click interaction
        stat.addEventListener('click', () => {
            stat.classList.remove('active');
            void stat.offsetWidth; // Trigger reflow
            stat.classList.add('active');
            startCountAnimation(stat);
        });
    });

    // Initialize and observe timeline elements
    const timelineSections = document.querySelectorAll('.year-section');
    timelineSections.forEach((section, index) => {
        // Set animation index
        section.style.setProperty('--year-index', index);
        observer.observe(section);

        // Update progress bar initially
        updateProgressBar(section);

        // Observe milestones
        const milestones = section.querySelectorAll('.milestone');
        milestones.forEach((milestone, mIndex) => {
            milestone.style.setProperty('--milestone-index', mIndex);
            observer.observe(milestone);

            // Add click handler for milestone completion
            const dot = milestone.querySelector('.milestone-dot');
            dot.addEventListener('click', () => {
                milestone.classList.toggle('completed');
                dot.classList.toggle('active');
                milestone.querySelector('.milestone-text').classList.toggle('active');
                updateProgressBar(section);
            });
        });

        // Set up click handlers
        const header = section.querySelector('.year-header');
        const content = section.querySelector('.year-content');
        
        // Set initial state (first year expanded)
        if (section.id === 'year-2024') {
            section.classList.add('active');
        }

        header.addEventListener('click', () => {
            // Close all other sections
            timelineSections.forEach(otherSection => {
                if (otherSection !== section && otherSection.classList.contains('active')) {
                    otherSection.classList.remove('active');
                }
            });
            
            // Toggle current section
            section.classList.toggle('active');
        });

        // Initialize milestone dots
        const milestoneDots = section.querySelectorAll('.milestone');
        milestoneDots.forEach(milestone => {
            const dot = milestone.querySelector('.milestone-dot');
            const text = milestone.querySelector('.milestone-text');

            dot.addEventListener('click', () => {
                // Toggle active state for this milestone
                dot.classList.toggle('active');
                text.classList.toggle('active');
            });
        });
    });

    // Get all crew cards once
    const crewCards = document.querySelectorAll('.crew-card');
    
    crewCards.forEach((card, index) => {
        // Observe each card for scroll animation
        observer.observe(card);
        
        // Add staggered animation delay
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Handle card click for expand/collapse
        card.addEventListener('click', function() {
            crewCards.forEach(c => {
                if (c !== this && c.classList.contains('expanded')) {
                    c.classList.remove('expanded');
                }
            });
            this.classList.toggle('expanded');
        });
    });
    
    // Show cards with a staggered animation
    crewCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Set card animation index
    const cards = document.querySelectorAll('.crew-card');
    cards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const fleet = button.getAttribute('data-fleet');
            
            // Reset animation delays
            let visibleIndex = 0;

            crewCards.forEach(card => {
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                
                if (fleet === 'all' || card.getAttribute('data-fleet') === fleet) {
                    card.style.display = 'block';
                    card.style.setProperty('--card-index', visibleIndex);
                    card.style.animation = '';
                    visibleIndex++;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Smooth scrolling for navbar links
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            
            window.scrollTo({
                top: targetSection.offsetTop - navbarHeight,
                behavior: 'smooth'
            });
        });
    });

    // Active section highlighting in navbar
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.navbar a');
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const scroll = window.scrollY;
            
            if (scroll >= sectionTop && scroll < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + section.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    initCrewSearch();
    initLegendInteractivity();
    initVisitorCounter();
    initFeedbackForm();
});

// Function to start counting animation
function startCountAnimation(stat) {
    const numberElement = stat.querySelector('.stat-number');
    const targetValue = stat.getAttribute('data-value');
    
    // Special handling for "1M+"
    if (targetValue === "1M+") {
        const duration = 1500; // 1.5 seconds total
        const steps = 50;
        let currentStep = 0;

        // Start from 100K and count up to 1M
        const startValue = 100000;
        const endValue = 1000000;
        const increment = (endValue - startValue) / steps;

        const animation = setInterval(() => {
            currentStep++;
            const currentValue = Math.round(startValue + (increment * currentStep));
            
            // Format the number with K or M suffix
            if (currentValue >= 1000000) {
                numberElement.textContent = "1M+";
                clearInterval(animation);
            } else if (currentValue >= 100000) {
                numberElement.textContent = Math.round(currentValue / 1000) + "K+";
            }
        }, duration / steps);
        return;
    }

    // Regular number animation
    const startValue = 0;
    const duration = 1000; // 1 second
    const steps = 30;
    const increment = (parseInt(targetValue) - startValue) / steps;
    let currentStep = 0;

    const animation = setInterval(() => {
        currentStep++;
        const currentValue = Math.round(startValue + (increment * currentStep));
        numberElement.textContent = currentValue;

        if (currentStep >= steps) {
            numberElement.textContent = targetValue;
            clearInterval(animation);
        }
    }, duration / steps);
}

// Gallery Section

function initGallery() {
    // Banner slider functionality
    const bannerContainer = document.querySelector('.banner-container');
    const slides = document.querySelectorAll('.banner-slide');
    let currentSlide = 0;
    let slideInterval;
    
    function updateSlides() {
        bannerContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
    }
    
    function startAutoSlide() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        if (slideInterval) clearInterval(slideInterval);
    }
    
    // Initialize auto-slide
    startAutoSlide();
    
    // Mouse interaction
    bannerContainer.addEventListener('mouseenter', stopAutoSlide);
    bannerContainer.addEventListener('mouseleave', startAutoSlide);
    // logika
    document.addEventListener("DOMContentLoaded", function () {
        const viewButtons = document.querySelectorAll(".view-btn");
        const galleryItems = document.querySelectorAll(".gallery-item");
    
        viewButtons.forEach(button => {
            button.addEventListener("click", () => {
                // Hapus class aktif dari tombol lain
                viewButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
    
                const view = button.getAttribute("data-view");
    
                // Tampilkan hanya gambar yang sesuai
                galleryItems.forEach(item => {
                    if (view === "portrait") {
                        item.style.display = item.classList.contains("landscape") ? "none" : "block";
                    } else {
                        item.style.display = item.classList.contains("landscape") ? "block" : "none";
                    }
                });
            });
        });
    });
    


    // Touch functionality
    let startX, isDragging = false, currentTranslate = 0;
    
    bannerContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoSlide();
    });
    
    bannerContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        currentTranslate = -(currentSlide * 100) - (diff / bannerContainer.offsetWidth * 100);
        bannerContainer.style.transform = `translateX(${currentTranslate}%)`;
    });
    
    bannerContainer.addEventListener('touchend', () => {
        isDragging = false;
        const threshold = 50; // pixels
        if (Math.abs(currentTranslate - (-currentSlide * 100)) > threshold) {
            if (currentTranslate < (-currentSlide * 100)) {
                currentSlide = Math.min(currentSlide + 1, slides.length - 1);
            } else {
                currentSlide = Math.max(currentSlide - 1, 0);
            }
        }
        updateSlides();
        startAutoSlide();
    });

    // Navigation dots
    const dotsContainer = document.querySelector('.banner-dots');
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('banner-dot');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlides();
            stopAutoSlide();
            startAutoSlide();
        });
        dotsContainer.appendChild(dot);
    });

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.banner-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Initialize first slide
    updateSlides();

    // Gallery filtering
    const filterButtons = document.querySelectorAll('.genre-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    function filterGallery(genre) {
        requestAnimationFrame(() => {
            galleryItems.forEach(item => {
                const match = genre === 'all' || item.getAttribute('data-genre') === genre;
                item.style.display = match ? 'block' : 'none';
                item.style.opacity = match ? '1' : '0';
                item.style.transform = match ? 'translateY(0)' : 'translateY(20px)';
            });
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            // Filter gallery immediately
            filterGallery(button.getAttribute('data-genre'));
        });
    });

    // Initialize with all items visible
    window.addEventListener('load', () => {
        requestAnimationFrame(() => {
            galleryItems.forEach(item => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });
        });
    });
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initGallery);

// Gallery modal functionality
function initGalleryModal() {
    // Create modal elements if they don't exist
    if (!document.getElementById('imageModal')) {
        const modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <span class="close-modal">&times;</span>
            <img class="modal-content" id="modalImage">
        `;
        document.body.appendChild(modal);
    }

    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = modal.querySelector('.close-modal');
    const galleryItems = document.querySelectorAll('.gallery-item img');

    galleryItems.forEach(img => {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            modalImg.src = this.src;
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function initCompactBanner() {
    const wrapper = document.querySelector('.banner-wrapper');
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;
    let startX = 0;
    let currentX = 0;
    let autoplayInterval;

    function goToSlide(index) {
        currentSlide = index;
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
    }

    // Touch events
    wrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        currentX = startX;
        stopAutoplay();
        wrapper.style.transition = 'none';
    });

    wrapper.addEventListener('touchmove', (e) => {
        currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        const offset = -(currentSlide * 100) - (diff / wrapper.offsetWidth * 100);
        wrapper.style.transform = `translateX(${offset}%)`;
    });

    wrapper.addEventListener('touchend', () => {
        wrapper.style.transition = 'transform 0.3s ease';
        const diff = startX - currentX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentSlide < slides.length - 1) {
                currentSlide++;
            } else if (diff < 0 && currentSlide > 0) {
                currentSlide--;
            }
        }
        goToSlide(currentSlide);
        startAutoplay();
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopAutoplay();
            startAutoplay();
        });
    });

    // Start autoplay
    startAutoplay();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGalleryFilters();
    initCompactBanner();
    initGalleryModal();
    initCrewSearch();
    initLegendInteractivity();
});

function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.genre-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const container = document.querySelector('.gallery-grid');

    function filterGallery(genre) {
        const items = Array.from(galleryItems);
        
        if (genre === 'all') {
            // Sort items to show social first
            items.sort((a, b) => {
                const aIsSocial = a.dataset.genre === 'social';
                const bIsSocial = b.dataset.genre === 'social';
                return bIsSocial - aIsSocial;
            });
            
            // Reorder items in DOM
            items.forEach(item => container.appendChild(item));
        }

        // Show/hide items based on genre
        items.forEach(item => {
            const shouldShow = genre === 'all' || item.dataset.genre === genre;
            if (shouldShow) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    // Show all items with social first on initial load
    filterGallery('all');

    // Filter button click handlers
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterGallery(button.dataset.genre);
        });
    });
}

function initCrewSearch() {
    const searchInput = document.getElementById('crewSearch');
    const crewCards = document.querySelectorAll('.crew-card');
    
    // Immediate search function
    const searchCards = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        crewCards.forEach(card => {
            // Get all searchable content from the card
            const name = card.querySelector('.header-info p:first-child').textContent.toLowerCase();
            const role = card.querySelector('.header-info p:last-child').textContent.toLowerCase();
            const fleet = card.getAttribute('data-fleet').toLowerCase();
            const caption = card.querySelector('.card-caption')?.textContent.toLowerCase() || '';
            const hashtags = card.querySelector('.hashtags')?.textContent.toLowerCase() || '';
            
            // Check if any content matches the search term
            const matches = 
                name.includes(searchTerm) ||
                role.includes(searchTerm) ||
                fleet.includes(searchTerm) ||
                caption.includes(searchTerm) ||
                hashtags.includes(searchTerm);
            
            // Show/hide card with animation
            if (matches) {
                card.style.display = '';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 200);
            }
        });
    };

    // Add event listeners
    searchInput.addEventListener('input', searchCards);
    searchInput.addEventListener('search', searchCards); // For when 'x' is clicked
}

// Make sure search is initialized after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initGalleryFilters();
    initCompactBanner();
    initGalleryModal();
    initCrewSearch();
});

// Crew Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('crewSearch');
    const crewCards = document.querySelectorAll('.crew-card');

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();

        crewCards.forEach(card => {
            const nameElement = card.querySelector('.header-info p:first-child');
            const roleElement = card.querySelector('.header-info p:last-child');
            
            if (!nameElement || !roleElement) return;

            const name = nameElement.textContent.toLowerCase();
            const role = roleElement.textContent.toLowerCase();
            const hasMatch = name.includes(searchTerm) || role.includes(searchTerm);

            card.style.display = hasMatch ? 'block' : 'none';
            
            // Animate the transition
            if (hasMatch) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
            }
        });
    });
});

function initLegendInteractivity() {
    const legendItems = document.querySelectorAll('.legend-item');
    const chart = Chart.getChart("hoursChart"); // Get the chart instance

    legendItems.forEach(item => {
        item.addEventListener('click', () => {
            // Toggle active state
            const isActive = item.classList.toggle('active');
            
            // Get the subject name from the legend text
            const subject = item.querySelector('.legend-text').textContent;
            
            // Find the dataset index
            const datasetIndex = chart.data.labels.indexOf(subject);
            
            if (datasetIndex > -1) {
                // Toggle visibility in the chart
                const meta = chart.getDatasetMeta(0);
                meta.data[datasetIndex].hidden = !isActive;
                
                // Update the chart
                chart.update();
                
                // Update total hours
                updateTotalHours(chart);
            }
        });
    });
}

function updateTotalHours(chart) {
    let total = 0;
    const meta = chart.getDatasetMeta(0);
    
    chart.data.datasets[0].data.forEach((value, index) => {
        if (!meta.data[index].hidden) {
            total += value;
        }
    });
    
    // Update the total hours display
    const totalDisplay = document.querySelector('.hours-number');
    totalDisplay.textContent = total.toFixed(1);
}

function updateChartVisibility(legendItem, chart) {
    const subject = legendItem.querySelector('.legend-text').textContent;
    const index = chart.data.labels.indexOf(subject);
    
    if (index > -1) {
        // Toggle visibility
        const meta = chart.getDatasetMeta(0);
        meta.data[index].hidden = !meta.data[index].hidden;
        
        // Update legend item appearance
        legendItem.classList.toggle('active');
        
        // Animate the chart
        chart.update('active');
        
        // Update total hours
        updateTotalHours(chart);
    }
}

function updateTotalHours(chart) {
    let total = 0;
    const meta = chart.getDatasetMeta(0);
    
    chart.data.datasets[0].data.forEach((value, index) => {
        if (!meta.data[index].hidden) {
            total += value;
        }
    });
    
    const totalDisplay = document.querySelector('.hours-number');
    // Animate the total number
    animateValue(totalDisplay, parseFloat(totalDisplay.textContent), total, 500);
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    let current = start;
    const increment = range / (duration / 16);
    const stepTime = 16;

    function step() {
        current += increment;
        element.textContent = Math.abs(current - end) > 0.1 
            ? current.toFixed(1)
            : end.toFixed(1);
            
        if ((increment > 0 && current < end) || (increment < 0 && current > end)) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

// Update existing event listeners
document.querySelectorAll('.legend-item').forEach(item => {
    item.addEventListener('click', () => {
        const chart = Chart.getChart('hoursChart');
        updateChartVisibility(item, chart);
    });
});

// Initialize visitor counter
function initVisitorCounter() {
    const counterElement = document.querySelector('.visitor-count');
    let visitorCount = parseInt(localStorage.getItem('visitorCount')) || 0;
    
    // Increment count only once per session
    if (!sessionStorage.getItem('counted')) {
        visitorCount++;
        localStorage.setItem('visitorCount', visitorCount);
        sessionStorage.setItem('counted', 'true');
    }
    
    // Animate counter
    let start = 0;
    const duration = 1000;
    const step = timestamp => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        
        counterElement.textContent = Math.floor(visitorCount * percentage).toLocaleString();
        
        if (progress < duration) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// Initialize feedback form with security measures
function initFeedbackForm() {
    const form = document.getElementById('feedbackForm');
    const targetEmail = 'nefeearous88@gmail.com'; // Your email address
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic form validation
        const formData = new FormData(form);
        const data = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            rating: formData.get('rating'),
            message: formData.get('message').trim()
        };

        // Validate input
        if (!data.name || data.name.length < 2) {
            alert('Please enter a valid name (minimum 2 characters)');
            return;
        }

        if (!data.email || !isValidEmail(data.email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (!data.rating) {
            alert('Please select a rating');
            return;
        }

        if (!data.message || data.message.length < 10) {
            alert('Please enter a message (minimum 10 characters)');
            return;
        }

        // Rate limiting - check last submission time
        const lastSubmission = localStorage.getItem('lastFeedbackSubmission');
        const now = Date.now();
        if (lastSubmission && (now - parseInt(lastSubmission)) < 300000) { // 5 minutes
            alert('Please wait a few minutes before submitting another feedback');
            return;
        }

        // Store submission time
        localStorage.setItem('lastFeedbackSubmission', now.toString());
        
        // Create sanitized mailto link
        const subject = `Website Feedback from ${encodeURIComponent(data.name)}`;
        const body = `Name: ${encodeURIComponent(data.name)}
Email: ${encodeURIComponent(data.email)}
Rating: ${encodeURIComponent(data.rating)} stars
Message: ${encodeURIComponent(data.message)}`;

        // Open email client safely
        const mailtoLink = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
        
        // Success message and reset form
        alert('Thank you for your feedback! Your email client will open shortly.');
        form.reset();
    });
}

// Email validation helper function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add to document ready event listener
document.addEventListener('DOMContentLoaded', () => {
    initVisitorCounter();
    initFeedbackForm();
});

