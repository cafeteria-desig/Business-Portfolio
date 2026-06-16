document.addEventListener('DOMContentLoaded', () => {

    // --- CUSTOM CURSOR ---
    const cursorDot = document.getElementById('custom-cursor');
    const cursorOutline = document.getElementById('custom-cursor-outline');
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant position for the inner dot
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Animate outline with a slight delay (smooth lag effect)
    const animateOutline = () => {
        const xp = 0.15; // interpolation factor
        outlineX += (mouseX - outlineX) * xp;
        outlineY += (mouseY - outlineY) * xp;

        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';

        requestAnimationFrame(animateOutline);
    };
    animateOutline();

    // Hover state over interactive elements
    const hoverElements = document.querySelectorAll('a, button, input, textarea, .project-card, .filter-btn, .social-link');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        element.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    // Hide custom cursor when mouse leaves the window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    });


    // --- HEADER ON SCROLL ---
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // --- MOBILE NAVIGATION ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });


    // --- SCROLL REVEAL & SKILLS PROGRESS ---
    const reveals = document.querySelectorAll('.reveal');
    const skillSection = document.getElementById('skills');
    let skillsAnimated = false;

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            const elementVisible = 150; // offset
            
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('reveal-visible');
                
                // Animate skill progress bars if this is the skills section
                if (reveal === skillSection && !skillsAnimated) {
                    animateSkills();
                }
            }
        });
    };

    const animateSkills = () => {
        skillsAnimated = true;
        const skillBars = document.querySelectorAll('.skill-bar-fill');
        const percentages = document.querySelectorAll('.skill-percentage');
        
        skillBars.forEach((bar, index) => {
            const percentEl = percentages[index];
            const targetVal = parseInt(percentEl.getAttribute('data-val'));
            
            // Animate bar width
            bar.style.width = targetVal + '%';
            
            // Counter animation
            let count = 0;
            const speed = 15; // smaller = faster
            const updateCount = () => {
                if (count < targetVal) {
                    count++;
                    percentEl.innerText = count + '%';
                    setTimeout(updateCount, speed);
                } else {
                    percentEl.innerText = targetVal + '%';
                }
            };
            updateCount();
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check


    // --- ACTIVE LINK TRACKING ---
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 200; // offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });


    // --- PORTFOLIO CATEGORY FILTER ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active state from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Start fade out animation
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hide');
                        // Fade in animation
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.classList.add('hide');
                    }
                }, 300); // match CSS transition duration
            });
        });
    });


    // --- CONTACT FORM SUBMISSION ---
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulate form submission
            formMessage.innerText = 'Sending message...';
            formMessage.classList.add('success');
            
            setTimeout(() => {
                formMessage.innerText = 'Thank you, Bhavik! Your message has been sent successfully. I will get back to you soon.';
                contactForm.reset();
                
                // Remove success message after a few seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                    formMessage.innerText = '';
                    formMessage.classList.remove('success');
                }, 5000);
            }, 1500);
        });
    }
});
