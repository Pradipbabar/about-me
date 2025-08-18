/*===== MENU SHOW/HIDE =====*/ 
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
          nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show-menu')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
    const scrollDown = window.scrollY

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        
        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass?.classList.add('active-link')
        } else {
            sectionsClass?.classList.remove('active-link')
        }                                                    
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== CHANGE BACKGROUND HEADER ====================*/ 
function scrollHeader(){
    const nav = document.getElementById('header')
    if(this.scrollY >= 80) nav?.classList.add('scroll-header')
    else nav?.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*==================== SHOW SCROLL UP ====================*/ 
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up')
    if(this.scrollY >= 560) scrollUp?.classList.add('show-scroll')
    else scrollUp?.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*==================== SCROLL TO TOP ====================*/
const scrollUpButton = document.getElementById('scroll-up')
if(scrollUpButton) {
    scrollUpButton.addEventListener('click', (e) => {
        e.preventDefault()
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    })
}

/*==================== DARK LIGHT THEME ====================*/ 
const themeButton = document.getElementById('theme-toggle')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-sun'

// Previously selected theme (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// Obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton?.classList.contains(iconTheme) ? 'bx-moon' : 'bx-sun'

// Validate if the user previously chose a theme
if (selectedTheme) {
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
    themeButton?.classList[selectedIcon === 'bx-moon' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton?.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // Save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
    reset: false
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text', {}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img', {delay: 400}); 
sr.reveal('.home__social-icon', {interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input', {interval: 200}); 

/*==================== PROJECT MODALS ====================*/
// Get the modals and images
const modal1 = document.getElementById("modalProject1");
const modal2 = document.getElementById("modalProject2");
const modal3 = document.getElementById("modalProject3");
const modal4 = document.getElementById("modalProject4");
const modal5 = document.getElementById("modalProject5");
const modal6 = document.getElementById("modalProject6");

const project1 = document.getElementById("project1");
const project2 = document.getElementById("project2");
const project3 = document.getElementById("project3");
const project4 = document.getElementById("project4");
const project5 = document.getElementById("project5");
const project6 = document.getElementById("project6");

// When the user clicks an image, open the corresponding modal
project1?.addEventListener('click', () => {
    modal1.style.display = "block";
});

project2?.addEventListener('click', () => {
    modal2.style.display = "block";
});

project3?.addEventListener('click', () => {
    modal3.style.display = "block";
});

project4?.addEventListener('click', () => {
    modal4.style.display = "block";
});

project5?.addEventListener('click', () => {
    modal5.style.display = "block";
});

project6?.addEventListener('click', () => {
    modal6.style.display = "block";
});

// Get all close buttons
const closeButtons = document.getElementsByClassName("close");

// Close the modal when the user clicks on the close button
for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener('click', function() {
        const modalId = this.getAttribute("data-modal");
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "none";
        }
    });
}

// Close the modal if the user clicks outside of it
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
});

// Close modals with Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
});

/*==================== TYPEWRITER EFFECT ====================*/
const titles = [
    "DevOps Engineer",
    "Cloud Architect", 
    "Software Engineer",
    "Tech Enthusiast",
];

let titleIndex = 0;
let charIndex = 0;
let currentTitle = "";
let isDeleting = false;

function animateTitle() {
    const animatedTitleElement = document.querySelector('.animated-title');
    
    if (!animatedTitleElement) return;

    if (isDeleting) {
        currentTitle = titles[titleIndex].substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
        }
    } else {
        currentTitle = titles[titleIndex].substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === titles[titleIndex].length) {
            setTimeout(() => {
                isDeleting = true;
            }, 2000);
        }
    }

    animatedTitleElement.textContent = currentTitle;

    const typingSpeed = isDeleting ? 100 : 150;
    setTimeout(animateTitle, typingSpeed);
}

// Start the animation when page loads
document.addEventListener('DOMContentLoaded', animateTitle);

/*==================== CONTACT FORM VALIDATION ====================*/
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitButton = document.getElementById('submit');

    // Real-time validation
    nameInput?.addEventListener('input', () => validateField(nameInput, 'name-error', 'Name is required'));
    emailInput?.addEventListener('input', () => validateEmail(emailInput, 'email-error'));
    subjectInput?.addEventListener('input', () => validateField(subjectInput, 'subject-error', 'Subject is required'));
    messageInput?.addEventListener('input', () => validateField(messageInput, 'message-error', 'Message is required'));

    function validateField(input, errorId, errorMessage) {
        const errorElement = document.getElementById(errorId);
        if (input.value.trim() === '') {
            showError(errorElement, errorMessage);
            return false;
        } else {
            clearError(errorElement);
            return true;
        }
    }

    function validateEmail(input, errorId) {
        const errorElement = document.getElementById(errorId);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (input.value.trim() === '') {
            showError(errorElement, 'Email is required');
            return false;
        } else if (!emailRegex.test(input.value)) {
            showError(errorElement, 'Please enter a valid email address');
            return false;
        } else {
            clearError(errorElement);
            return true;
        }
    }

    function showError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearError(errorElement) {
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    // Form submission
    contactForm?.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate all fields
        const isNameValid = validateField(nameInput, 'name-error', 'Name is required');
        const isEmailValid = validateEmail(emailInput, 'email-error');
        const isSubjectValid = validateField(subjectInput, 'subject-error', 'Subject is required');
        const isMessageValid = validateField(messageInput, 'message-error', 'Message is required');

        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            // Create professional email
            const subject = encodeURIComponent(`${subjectInput.value} - Contact from ${nameInput.value}`);
            const body = encodeURIComponent(`
Dear Pradip,

I hope this message finds you well. My name is ${nameInput.value}, and I am reaching out regarding: ${subjectInput.value}

Message:
${messageInput.value}

I look forward to hearing from you and discussing potential opportunities to collaborate.

Best regards,
${nameInput.value}
Email: ${emailInput.value}
            `.trim());

            // Open email client
            window.location.href = `mailto:prb5928@gmail.com?subject=${subject}&body=${body}`;
            
            // Show success message
            showSuccessMessage();
            
            // Reset form after a delay
            setTimeout(() => {
                contactForm.reset();
                clearAllErrors();
            }, 1000);
        }
    });

    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you! Your email client should open shortly.';
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #10b981;
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    function clearAllErrors() {
        const errorElements = document.querySelectorAll('.contact__input-error');
        errorElements.forEach(clearError);
    }
});

/*==================== SMOOTH SCROLLING ====================*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/*==================== LOADING ANIMATION ====================*/
window.addEventListener('load', () => {
    const elements = document.querySelectorAll('.fade-in-up');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
});

/*==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================*/
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.skills__data, .about__info-item, .work__img');
    elementsToAnimate.forEach(el => observer.observe(el));
});


