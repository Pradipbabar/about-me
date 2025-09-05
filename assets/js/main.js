/*===== MODERN PORTFOLIO JAVASCRIPT =====*/

'use strict';

// Utility functions
const utils = {
  // Debounce function for performance
  debounce: (func, wait, immediate) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  // Throttle function for performance
  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Check if element is in viewport
  isElementInViewport: (el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Smooth scroll to element
  smoothScrollTo: (element, duration = 800) => {
    const targetPosition = element.offsetTop - 80;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }
};

// Loading Screen Management
class LoadingScreen {
  constructor() {
    this.loadingScreen = document.getElementById('loading-screen');
    this.init();
  }

  init() {
    // Simulate loading time
    setTimeout(() => {
      this.hide();
    }, 2000);

    // Hide loading screen when page is fully loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.hide();
      }, 500);
    });
  }

  hide() {
    if (this.loadingScreen) {
      this.loadingScreen.classList.add('hidden');
      setTimeout(() => {
        this.loadingScreen.style.display = 'none';
      }, 500);
    }
  }
}

// Theme Management System
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('portfolio-theme') || 'default';
    this.themeToggle = document.getElementById('theme-toggle');
    this.themeMenu = document.getElementById('theme-menu');
    this.themeIcon = document.getElementById('theme-icon');
    this.themeOptions = document.querySelectorAll('.theme-option');
    this.init();
  }

  init() {
    console.log('ThemeManager initializing...');
    // Apply saved theme
    this.applyTheme(this.currentTheme);
    
    // Event listeners
    if (this.themeToggle) {
      console.log('Theme toggle found, adding event listener');
      this.themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Theme toggle clicked');
        this.toggleMenu();
      });
    } else {
      console.error('Theme toggle button not found!');
    }

    // Theme option click handlers
    if (this.themeOptions.length > 0) {
      console.log('Found', this.themeOptions.length, 'theme options');
      this.themeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          const theme = e.currentTarget.dataset.theme;
          console.log('Theme option clicked:', theme);
          this.setTheme(theme);
          this.closeMenu();
        });
      });
    } else {
      console.error('No theme options found!');
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.themeToggle?.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    console.log('Toggle menu called');
    if (this.themeMenu) {
      this.themeMenu.classList.toggle('active');
      console.log('Menu is now active:', this.themeMenu.classList.contains('active'));
    } else {
      console.error('Theme menu not found!');
    }
  }

  closeMenu() {
    if (this.themeMenu) {
      this.themeMenu.classList.remove('active');
    }
  }

  setTheme(theme) {
    console.log('Setting theme to:', theme);
    this.currentTheme = theme;
    this.applyTheme(theme);
    localStorage.setItem('portfolio-theme', theme);
    
    // Update theme icon based on current theme
    this.updateThemeIcon(theme);
    
    // Trigger theme change animation
    this.animateThemeChange();
  }

  applyTheme(theme) {
    console.log('Applying theme:', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update particle system colors if exists
    if (window.particleSystem) {
      window.particleSystem.updateTheme();
    }
    
    // Trigger custom theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: theme } 
    }));
    
    // Add theme transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }

  updateThemeIcon(theme) {
    if (!this.themeIcon) return;

    const iconMap = {
      'default': 'bx-water',
      'dark': 'bx-moon',
      'purple': 'bx-crown',
      'green': 'bx-leaf',
      'orange': 'bx-sun'
    };

    this.themeIcon.className = `bx ${iconMap[theme] || 'bx-palette'} theme-icon`;
  }

  animateThemeChange() {
    document.body.style.transition = 'all 0.5s ease-in-out';
    
    // Reset transition after animation
    setTimeout(() => {
      document.body.style.transition = '';
    }, 500);
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}

// Particle System
class ParticleSystem {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
    this.init();
  }

  init() {
    this.createCanvas();
    this.createParticles();
    this.animate();
    this.handleResize();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particle-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-2';
    this.canvas.style.pointerEvents = 'none';
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
  }

  createParticles() {
    const particleCount = Math.min(100, Math.floor(window.innerWidth / 10));
    this.particles = [];

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: `hsla(${230 + Math.random() * 60}, 70%, 60%, ${Math.random() * 0.3 + 0.1})`
      });
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  handleResize() {
    window.addEventListener('resize', utils.debounce(() => {
      this.resize();
      this.createParticles();
    }, 250));
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
    });

    // Draw connections
    this.drawConnections();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  drawConnections() {
    const maxDistance = 100;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = 1 - (distance / maxDistance);
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(74, 112, 244, ${opacity * 0.1})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  updateTheme() {
    // Update particle colors based on current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'default';
    
    const themeColors = {
      'default': { hue: 230, saturation: 70 },
      'dark': { hue: 220, saturation: 85 },
      'purple': { hue: 280, saturation: 89 },
      'green': { hue: 160, saturation: 89 },
      'orange': { hue: 30, saturation: 89 }
    };

    const { hue, saturation } = themeColors[currentTheme] || themeColors.default;

    this.particles.forEach(particle => {
      particle.color = `hsla(${hue + Math.random() * 60}, ${saturation}%, 60%, ${Math.random() * 0.3 + 0.1})`;
    });
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas) {
      this.canvas.remove();
    }
  }
}

// Navigation Management
class Navigation {
  constructor() {
    this.nav = document.getElementById('header');
    this.navMenu = document.getElementById('nav-menu');
    this.navToggle = document.getElementById('nav-toggle');
    this.navLinks = document.querySelectorAll('.nav__link');
    this.sections = document.querySelectorAll('section[id]');
    
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupScrollSpy();
    this.setupSmoothScrolling();
    this.setupHeaderBackground();
  }

  setupMobileMenu() {
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => {
        this.navMenu?.classList.toggle('show-menu');
        this.updateBurgerAnimation();
      });
    }

    // Close menu when clicking on nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.navMenu?.classList.remove('show-menu');
        this.updateBurgerAnimation();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.nav?.contains(e.target)) {
        this.navMenu?.classList.remove('show-menu');
        this.updateBurgerAnimation();
      }
    });
  }

  updateBurgerAnimation() {
    const burger = document.querySelector('.nav__burger');
    if (burger) {
      burger.classList.toggle('active');
    }
  }

  setupScrollSpy() {
    const scrollSpy = utils.throttle(() => {
      const scrollY = window.pageYOffset;
      
      this.sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          this.navLinks.forEach(link => link.classList.remove('active-link'));
          correspondingLink?.classList.add('active-link');
        }
      });
    }, 100);

    window.addEventListener('scroll', scrollSpy);
  }

  setupSmoothScrolling() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Ensure all sections are visible before scrolling
          this.ensureSectionsVisible();
          utils.smoothScrollTo(targetElement);
          
          // Update active states immediately
          this.updateActiveNavigation(link);
          
          // Trigger any necessary animations after scroll
          setTimeout(() => {
            this.triggerSectionAnimations(targetElement);
          }, 500);
        }
      });
    });
  }

  ensureSectionsVisible() {
    // Make sure all sections are visible
    const allSections = document.querySelectorAll('section[id]');
    allSections.forEach(section => {
      if (section.style.display === 'none') {
        section.style.display = 'block';
      }
      if (section.style.visibility === 'hidden') {
        section.style.visibility = 'visible';
      }
      if (section.style.opacity === '0') {
        section.style.opacity = '1';
      }
    });
  }

  updateActiveNavigation(activeLink) {
    this.navLinks.forEach(link => link.classList.remove('active-link'));
    activeLink.classList.add('active-link');
  }

  triggerSectionAnimations(targetSection) {
    // Trigger animations for elements in the target section
    const animatedElements = targetSection.querySelectorAll('.glass-card, .about__info-item, .skill__item, .project-card');
    animatedElements.forEach((el, index) => {
      if (el.style.opacity === '0' || !el.style.animation) {
        setTimeout(() => {
          el.style.animation = 'slideInUp 0.6s ease forwards';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }

  setupHeaderBackground() {
    const scrollHeader = utils.throttle(() => {
      if (window.scrollY >= 80) {
        this.nav?.classList.add('scroll-header');
      } else {
        this.nav?.classList.remove('scroll-header');
      }
    }, 100);

    window.addEventListener('scroll', scrollHeader);
  }
}

// Typing Effect
class TypingEffect {
  constructor() {
    this.element = document.getElementById('dynamic-title');
    this.texts = [
      'DevOps Engineer',
      'Cloud Architect', 
      'Software Engineer',
      'Tech Enthusiast',
      'Automation Expert'
    ];
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.typingSpeed = 150;
    this.deletingSpeed = 100;
    this.pauseTime = 2000;
    
    this.init();
  }

  init() {
    if (this.element) {
      this.type();
    }
  }

  type() {
    const currentText = this.texts[this.textIndex];
    
    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
      
      if (this.charIndex === 0) {
        this.isDeleting = false;
        this.textIndex = (this.textIndex + 1) % this.texts.length;
        setTimeout(() => this.type(), 500);
        return;
      }
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
      
      if (this.charIndex === currentText.length) {
        setTimeout(() => {
          this.isDeleting = true;
          this.type();
        }, this.pauseTime);
        return;
      }
    }
    
    const speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
    setTimeout(() => this.type(), speed);
  }
}

// Skills Animation
class SkillsAnimation {
  constructor() {
    this.skillBars = document.querySelectorAll('.skill__progress');
    this.skillsSection = document.getElementById('skills');
    this.animated = false;
    
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated) {
          this.animateSkills();
          this.animated = true;
        }
      });
    }, {
      threshold: 0.3
    });

    if (this.skillsSection) {
      observer.observe(this.skillsSection);
    }
  }

  animateSkills() {
    this.skillBars.forEach((bar, index) => {
      setTimeout(() => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width;
      }, index * 200);
    });
  }
}

// Projects Filter
class ProjectsFilter {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.projectCards = document.querySelectorAll('.project-card');
    
    this.init();
  }

  init() {
    this.setupFilterButtons();
  }

  setupFilterButtons() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        this.filterProjects(filter);
        this.updateActiveButton(button);
      });
    });
  }

  filterProjects(filter) {
    this.projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      
      if (filter === 'all' || category === filter) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 100);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }

  updateActiveButton(activeButton) {
    this.filterButtons.forEach(button => {
      button.classList.remove('active');
    });
    activeButton.classList.add('active');
  }
}

// Modal Management
class ModalManager {
  constructor() {
    this.modals = document.querySelectorAll('.modal');
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Close modal when clicking outside
    this.modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Animate modal content
      const modalContent = modal.querySelector('.modal-content');
      if (modalContent) {
        modalContent.style.animation = 'slideInDown 0.3s ease forwards';
      }
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      const modalContent = modal.querySelector('.modal-content');
      if (modalContent) {
        modalContent.style.animation = 'slideOutUp 0.3s ease forwards';
      }
      
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }, 300);
    }
  }

  closeAllModals() {
    this.modals.forEach(modal => {
      if (modal.style.display === 'flex') {
        this.closeModal(modal.id);
      }
    });
  }
}

// Contact Form
class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.nameInput = document.getElementById('name');
    this.emailInput = document.getElementById('email');
    this.subjectInput = document.getElementById('subject');
    this.messageInput = document.getElementById('message');
    
    this.init();
  }

  init() {
    if (this.form) {
      this.setupValidation();
      this.setupSubmission();
    }
  }

  setupValidation() {
    // Real-time validation
    this.nameInput?.addEventListener('input', () => 
      this.validateField(this.nameInput, 'name-error', 'Name is required'));
    
    this.emailInput?.addEventListener('input', () => 
      this.validateEmail(this.emailInput, 'email-error'));
    
    this.subjectInput?.addEventListener('input', () => 
      this.validateField(this.subjectInput, 'subject-error', 'Subject is required'));
    
    this.messageInput?.addEventListener('input', () => 
      this.validateField(this.messageInput, 'message-error', 'Message is required'));
  }

  validateField(input, errorId, errorMessage) {
    const errorElement = document.getElementById(errorId);
    if (input.value.trim() === '') {
      this.showError(errorElement, errorMessage);
      return false;
    } else {
      this.clearError(errorElement);
      return true;
    }
  }

  validateEmail(input, errorId) {
    const errorElement = document.getElementById(errorId);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (input.value.trim() === '') {
      this.showError(errorElement, 'Email is required');
      return false;
    } else if (!emailRegex.test(input.value)) {
      this.showError(errorElement, 'Please enter a valid email address');
      return false;
    } else {
      this.clearError(errorElement);
      return true;
    }
  }

  showError(errorElement, message) {
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  clearError(errorElement) {
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  setupSubmission() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const isNameValid = this.validateField(this.nameInput, 'name-error', 'Name is required');
      const isEmailValid = this.validateEmail(this.emailInput, 'email-error');
      const isSubjectValid = this.validateField(this.subjectInput, 'subject-error', 'Subject is required');
      const isMessageValid = this.validateField(this.messageInput, 'message-error', 'Message is required');
      
      if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        this.submitForm();
      }
    });
  }

  submitForm() {
    // Create professional email
    const subject = encodeURIComponent(`${this.subjectInput.value} - Contact from ${this.nameInput.value}`);
    const body = encodeURIComponent(`
Dear Pradip,

I hope this message finds you well. My name is ${this.nameInput.value}, and I am reaching out regarding: ${this.subjectInput.value}

Message:
${this.messageInput.value}

I look forward to hearing from you and discussing potential opportunities to collaborate.

Best regards,
${this.nameInput.value}
Email: ${this.emailInput.value}
    `.trim());

    // Open email client
    window.location.href = `mailto:prb5928@gmail.com?subject=${subject}&body=${body}`;
    
    // Show success message
    this.showSuccessMessage();
    
    // Reset form after a delay
    setTimeout(() => {
      this.form.reset();
      this.clearAllErrors();
    }, 1000);
  }

  showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #06d6a0);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
      ">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <i class="bx bx-check-circle" style="font-size: 1.2rem;"></i>
          <span>Thank you! Your email client should open shortly.</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      successMessage.remove();
    }, 5000);
  }

  clearAllErrors() {
    const errorElements = document.querySelectorAll('.contact__input-error');
    errorElements.forEach(error => this.clearError(error));
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll('.glass-card, .about__info-item, .skill__item, .project-card');
    this.animatedSet = new Set();
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupNavigationReset();
  }

  setupNavigationReset() {
    // Listen for navigation clicks to reset animations
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Small delay to allow scroll to complete, then check visibility
        setTimeout(() => {
          this.checkVisibleElements();
        }, 500);
      });
    });
  }

  checkVisibleElements() {
    this.animatedElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = (
        rect.top < window.innerHeight && 
        rect.bottom > 0 && 
        rect.left < window.innerWidth && 
        rect.right > 0
      );
      
      if (isVisible && !this.animatedSet.has(el)) {
        this.animateElement(el);
      }
    });
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedSet.has(entry.target)) {
          this.animateElement(entry.target);
        }
      });
    }, observerOptions);

    this.animatedElements.forEach(el => {
      // Only set initial hidden state if element is not in view
      const rect = el.getBoundingClientRect();
      const isInitiallyVisible = (
        rect.top < window.innerHeight && 
        rect.bottom > 0
      );
      
      if (!isInitiallyVisible) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
      } else {
        // Element is initially visible, animate it immediately
        this.animateElement(el);
      }
      
      observer.observe(el);
    });
  }

  animateElement(element) {
    if (this.animatedSet.has(element)) return;
    
    element.style.animation = 'slideInUp 0.6s ease forwards';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    this.animatedSet.add(element);
  }
}

// Simple Features Manager
class SimpleFeatures {
  constructor() {
    this.init();
  }

  init() {
    this.setupBubbleBackground();
    this.setupSimpleAnimations();
    this.setupKeyboardNavigation();
  }

  setupBubbleBackground() {
    // Create bubble container
    const bubbleContainer = document.createElement('div');
    bubbleContainer.className = 'bubble-container';
    bubbleContainer.innerHTML = `
      <div class="bubble bubble--large"></div>
      <div class="bubble bubble--medium"></div>
      <div class="bubble bubble--small"></div>
      <div class="bubble bubble--large"></div>
      <div class="bubble bubble--medium"></div>
      <div class="bubble bubble--small"></div>
      <div class="bubble bubble--large"></div>
      <div class="bubble bubble--medium"></div>
    `;
    document.body.appendChild(bubbleContainer);

    // Add bubble styles
    const style = document.createElement('style');
    style.textContent = `
      .bubble-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
      }

      .bubble {
        position: absolute;
        border-radius: 50%;
        background: linear-gradient(135deg, 
          rgba(74, 112, 244, 0.1) 0%, 
          rgba(74, 112, 244, 0.05) 50%, 
          transparent 100%);
        animation: floatUp linear infinite;
      }

      .bubble--large {
        width: 80px;
        height: 80px;
        animation-duration: 20s;
        animation-delay: 0s;
      }

      .bubble--medium {
        width: 50px;
        height: 50px;
        animation-duration: 15s;
        animation-delay: -5s;
      }

      .bubble--small {
        width: 30px;
        height: 30px;
        animation-duration: 12s;
        animation-delay: -10s;
      }

      .bubble:nth-child(1) { left: 10%; animation-delay: 0s; }
      .bubble:nth-child(2) { left: 20%; animation-delay: -2s; }
      .bubble:nth-child(3) { left: 35%; animation-delay: -4s; }
      .bubble:nth-child(4) { left: 50%; animation-delay: -6s; }
      .bubble:nth-child(5) { left: 65%; animation-delay: -8s; }
      .bubble:nth-child(6) { left: 80%; animation-delay: -10s; }
      .bubble:nth-child(7) { left: 90%; animation-delay: -12s; }
      .bubble:nth-child(8) { left: 15%; animation-delay: -14s; }

      @keyframes floatUp {
        0% {
          transform: translateY(100vh) scale(0);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-100px) scale(1);
          opacity: 0;
        }
      }

      [data-theme="dark"] .bubble {
        background: linear-gradient(135deg, 
          rgba(74, 112, 244, 0.15) 0%, 
          rgba(74, 112, 244, 0.08) 50%, 
          transparent 100%);
      }

      [data-theme="purple"] .bubble {
        background: linear-gradient(135deg, 
          rgba(156, 39, 176, 0.12) 0%, 
          rgba(156, 39, 176, 0.06) 50%, 
          transparent 100%);
      }
    `;
    document.head.appendChild(style);
  }

  setupSimpleAnimations() {
    // Simple fade-in animations for cards
    const cards = document.querySelectorAll('.glass-card, .project-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.6s ease';
      observer.observe(card);
    });
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Escape: Close any open modals
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
          modal.style.display = 'none';
        });
      }
    });
  }
}

// Scroll Top Button
class ScrollTopButton {
  constructor() {
    this.scrollTopBtn = document.getElementById('scroll-top');
    this.init();
  }

  init() {
    this.setupScrollListener();
    this.setupClickListener();
  }

  setupScrollListener() {
    const toggleScrollTop = utils.throttle(() => {
      if (window.scrollY >= 560) {
        this.scrollTopBtn?.classList.add('show-scroll');
      } else {
        this.scrollTopBtn?.classList.remove('show-scroll');
      }
    }, 100);

    window.addEventListener('scroll', toggleScrollTop);
  }

  setupClickListener() {
    this.scrollTopBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Floating Elements Animation
class FloatingElements {
  constructor() {
    this.elements = document.querySelectorAll('.floating-element');
    this.init();
  }

  init() {
    this.animateElements();
    this.setupMouseFollow();
  }

  animateElements() {
    this.elements.forEach((element, index) => {
      const speed = parseFloat(element.getAttribute('data-speed')) || 1;
      const amplitude = 20 + (index * 5);
      
      setInterval(() => {
        const offset = Math.sin(Date.now() * 0.001 * speed) * amplitude;
        element.style.transform = `translateY(${offset}px)`;
      }, 16);
    });
  }

  setupMouseFollow() {
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    this.elements.forEach((element, index) => {
      setInterval(() => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (mouseX - centerX) * 0.01;
        const deltaY = (mouseY - centerY) * 0.01;
        
        element.style.transform += ` translate(${deltaX}px, ${deltaY}px)`;
      }, 100);
    });
  }
}

// Performance Optimization
class PerformanceOptimizer {
  constructor() {
    this.performanceMetrics = {
      loadTime: 0,
      renderTime: 0,
      interactionDelay: 0,
      memoryUsage: 0
    };
    this.init();
  }

  init() {
    this.measureInitialPerformance();
    this.setupImageLazyLoading();
    this.setupPrefetching();
    this.setupReducedMotion();
    this.setupPerformanceMonitoring();
    this.optimizeAnimations();
  }

  measureInitialPerformance() {
    // Measure page load performance
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      this.performanceMetrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      
      // Log performance if in development mode
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Portfolio Performance Metrics:', this.performanceMetrics);
      }
    });
  }

  setupImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  setupPrefetching() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', utils.debounce(() => {
        const targetId = link.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          this.prefetchSectionResources(targetElement);
        }
      }, 100));
    });
  }

  prefetchSectionResources(section) {
    const images = section.querySelectorAll('img');
    images.forEach(img => {
      if (img.src && !img.complete) {
        const prefetchImg = new Image();
        prefetchImg.src = img.src;
      }
    });
  }

  setupReducedMotion() {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleReducedMotion = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('reduce-motion');
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-medium', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');
      } else {
        document.documentElement.classList.remove('reduce-motion');
        document.documentElement.style.removeProperty('--transition-fast');
        document.documentElement.style.removeProperty('--transition-medium');
        document.documentElement.style.removeProperty('--transition-slow');
      }
    };

    reducedMotionQuery.addListener(handleReducedMotion);
    handleReducedMotion(reducedMotionQuery);
  }

  setupPerformanceMonitoring() {
    // Monitor FPS
    let lastTime = performance.now();
    let frames = 0;
    
    const measureFPS = (currentTime) => {
      frames++;
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        
        if (fps < 30) {
          this.optimizeForLowPerformance();
        }
        
        frames = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
    
    // Monitor memory usage (if available)
    if ('memory' in performance) {
      setInterval(() => {
        this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize;
        
        // Trigger garbage collection hint if memory usage is high
        if (performance.memory.usedJSHeapSize > 50000000) { // 50MB threshold
          this.triggerMemoryCleanup();
        }
      }, 10000);
    }
  }

  optimizeForLowPerformance() {
    // Reduce particle count
    if (window.particleSystem && window.particleSystem.particles) {
      window.particleSystem.particles = window.particleSystem.particles.slice(0, 20);
    }
    
    // Disable complex animations
    document.documentElement.classList.add('low-performance');
  }

  optimizeAnimations() {
    // Use will-change property for elements that will be animated
    const animatedElements = document.querySelectorAll('.glass-card, .btn, .nav__link, .skill__progress');
    
    animatedElements.forEach(element => {
      element.style.willChange = 'transform, opacity';
      
      // Remove will-change after animation
      element.addEventListener('transitionend', () => {
        element.style.willChange = 'auto';
      });
    });
  }

  triggerMemoryCleanup() {
    // Clean up unused event listeners and references
    // This is a hint to the browser's garbage collector
    if (window.gc) {
      window.gc();
    }
  }

  getPerformanceReport() {
    return {
      ...this.performanceMetrics,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink
      } : null
    };
  }
}

// Global Functions for Modal Control
window.openModal = function(modalId) {
  modalManager.openModal(modalId);
};

window.closeModal = function(modalId) {
  modalManager.closeModal(modalId);
};

// Advanced User Experience Tracker
class UXTracker {
  constructor() {
    this.interactions = [];
    this.sessionStart = Date.now();
    this.init();
  }

  init() {
    this.trackUserInteractions();
    this.trackScrollBehavior();
    this.trackThemeUsage();
    this.trackDeviceInfo();
  }

  trackUserInteractions() {
    // Track button clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('button, .btn, .nav__link, .theme-option')) {
        this.logInteraction('click', {
          element: e.target.tagName,
          className: e.target.className,
          text: e.target.textContent?.trim().substring(0, 50),
          timestamp: Date.now()
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      this.logInteraction('form_submit', {
        formId: e.target.id,
        timestamp: Date.now()
      });
    });

    // Track skill hover interactions
    document.addEventListener('mouseenter', (e) => {
      if (e.target.matches('.skill__item, .tech__item')) {
        this.logInteraction('skill_hover', {
          skill: e.target.querySelector('.skill__name, .tech__name')?.textContent,
          timestamp: Date.now()
        });
      }
    }, true);
  }

  trackScrollBehavior() {
    let scrollDepth = 0;
    let maxScrollDepth = 0;

    window.addEventListener('scroll', utils.throttle(() => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollDepth = (scrollTop / docHeight) * 100;
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Log milestone scroll depths
        if (maxScrollDepth > 25 && !this.scrollMilestones?.quarter) {
          this.logInteraction('scroll_milestone', { depth: '25%' });
          this.scrollMilestones = { ...this.scrollMilestones, quarter: true };
        }
        if (maxScrollDepth > 50 && !this.scrollMilestones?.half) {
          this.logInteraction('scroll_milestone', { depth: '50%' });
          this.scrollMilestones = { ...this.scrollMilestones, half: true };
        }
        if (maxScrollDepth > 75 && !this.scrollMilestones?.threeQuarter) {
          this.logInteraction('scroll_milestone', { depth: '75%' });
          this.scrollMilestones = { ...this.scrollMilestones, threeQuarter: true };
        }
        if (maxScrollDepth > 90 && !this.scrollMilestones?.almost) {
          this.logInteraction('scroll_milestone', { depth: '90%' });
          this.scrollMilestones = { ...this.scrollMilestones, almost: true };
        }
      }
    }, 1000));
  }

  trackThemeUsage() {
    window.addEventListener('themeChanged', (e) => {
      this.logInteraction('theme_change', {
        newTheme: e.detail.theme,
        timestamp: Date.now()
      });
    });
  }

  trackDeviceInfo() {
    this.deviceInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      },
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null,
      timestamp: Date.now()
    };
  }

  logInteraction(type, data) {
    this.interactions.push({
      type,
      data,
      sessionTime: Date.now() - this.sessionStart
    });

    // Keep only last 100 interactions to prevent memory issues
    if (this.interactions.length > 100) {
      this.interactions = this.interactions.slice(-100);
    }
  }

  generateUXReport() {
    const sessionDuration = Date.now() - this.sessionStart;
    const interactionTypes = {};
    
    this.interactions.forEach(interaction => {
      interactionTypes[interaction.type] = (interactionTypes[interaction.type] || 0) + 1;
    });

    return {
      sessionDuration: Math.round(sessionDuration / 1000), // in seconds
      totalInteractions: this.interactions.length,
      interactionTypes,
      deviceInfo: this.deviceInfo,
      averageInteractionRate: this.interactions.length / (sessionDuration / 60000), // per minute
      timestamp: new Date().toISOString()
    };
  }

  exportAnalytics() {
    const report = this.generateUXReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ux-analytics-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Accessibility Enhancer
class AccessibilityEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupAriaLabels();
    this.setupSkipLinks();
    this.setupHighContrastMode();
  }

  setupKeyboardNavigation() {
    // Enhanced tab navigation
    document.addEventListener('keydown', (e) => {
      // Escape key closes modals and menus
      if (e.key === 'Escape') {
        this.closeAllModalsAndMenus();
      }
      
      // Arrow key navigation for theme options
      if (e.target.closest('.theme-menu')) {
        this.handleArrowNavigation(e);
      }
    });
  }

  setupFocusManagement() {
    // Enhanced focus indicators
    document.addEventListener('focusin', (e) => {
      e.target.classList.add('keyboard-focused');
    });

    document.addEventListener('focusout', (e) => {
      e.target.classList.remove('keyboard-focused');
    });

    // Mouse users shouldn't see focus indicators
    document.addEventListener('mousedown', () => {
      document.body.classList.add('using-mouse');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.remove('using-mouse');
      }
    });
  }

  setupAriaLabels() {
    // Add missing aria labels
    const elementsNeedingLabels = [
      { selector: '.theme-toggle', label: 'Toggle theme menu' },
      { selector: '.nav__toggle', label: 'Toggle navigation menu' },
      { selector: '.scroll-top', label: 'Scroll to top' },
      { selector: '.filter-btn', label: 'Filter projects' }
    ];

    elementsNeedingLabels.forEach(({ selector, label }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (!el.getAttribute('aria-label')) {
          el.setAttribute('aria-label', label);
        }
      });
    });

    // Add aria-expanded for toggleable elements
    const toggleElements = document.querySelectorAll('[data-toggle], .theme-toggle, .nav__toggle');
    toggleElements.forEach(el => {
      el.setAttribute('aria-expanded', 'false');
    });
  }

  setupSkipLinks() {
    // Create skip navigation link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--primary-color);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content landmark
    const mainContent = document.querySelector('main') || document.querySelector('.main');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }
  }

  setupHighContrastMode() {
    // Detect high contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    
    const handleHighContrast = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    };

    highContrastQuery.addListener(handleHighContrast);
    handleHighContrast(highContrastQuery);
  }

  closeAllModalsAndMenus() {
    // Close theme menu
    const themeMenu = document.getElementById('theme-menu');
    if (themeMenu) {
      themeMenu.classList.remove('active');
    }

    // Close navigation menu
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
      navMenu.classList.remove('show-menu');
    }

    // Close any open modals
    if (window.modalManager) {
      window.modalManager.closeAllModals();
    }
  }

  handleArrowNavigation(e) {
    const themeOptions = document.querySelectorAll('.theme-option');
    const currentIndex = Array.from(themeOptions).findIndex(option => 
      option === document.activeElement
    );

    if (e.key === 'ArrowDown' && currentIndex < themeOptions.length - 1) {
      e.preventDefault();
      themeOptions[currentIndex + 1].focus();
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
      e.preventDefault();
      themeOptions[currentIndex - 1].focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.activeElement.click();
    }
  }
}

// Initialize Application
class App {
  constructor() {
    this.components = {};
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Core components
      this.components.loadingScreen = new LoadingScreen();
      this.components.themeManager = new ThemeManager();
      this.components.navigation = new Navigation();
      
      // Visual effects
      this.components.particleSystem = new ParticleSystem();
      this.components.typingEffect = new TypingEffect();
      this.components.floatingElements = new FloatingElements();
      
      // Interactive components
      this.components.skillsAnimation = new SkillsAnimation();
      this.components.projectsFilter = new ProjectsFilter();
      this.components.modalManager = new ModalManager();
      this.components.contactForm = new ContactForm();
      
      // UI enhancements
      this.components.scrollAnimations = new ScrollAnimations();
      this.components.scrollTopButton = new ScrollTopButton();
      this.components.simpleFeatures = new SimpleFeatures();
      
      // Performance & Analytics
      this.components.performanceOptimizer = new PerformanceOptimizer();
      this.components.uxTracker = new UXTracker();
      
      // Accessibility
      this.components.accessibilityEnhancer = new AccessibilityEnhancer();
      
      // Make components globally accessible for theme updates and debugging
      window.modalManager = this.components.modalManager;
      window.particleSystem = this.components.particleSystem;
      window.themeManager = this.components.themeManager;
      window.uxTracker = this.components.uxTracker;
      window.performanceOptimizer = this.components.performanceOptimizer;
      
      // Development helpers
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        this.setupDevelopmentHelpers();
      }
      
      console.log('🚀 Advanced Portfolio initialized successfully!');
    } catch (error) {
      console.error('❌ Error initializing portfolio:', error);
    }
  }

  setupDevelopmentHelpers() {
    // Add keyboard shortcuts for development
    document.addEventListener('keydown', (e) => {
      // Ctrl + Shift + P: Export performance report
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        console.log('Performance Report:', window.performanceOptimizer.getPerformanceReport());
      }
      
      // Ctrl + Shift + U: Export UX analytics
      if (e.ctrlKey && e.shiftKey && e.key === 'U') {
        window.uxTracker.exportAnalytics();
      }
      
      // Ctrl + Shift + T: Cycle through themes quickly
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        const themes = ['default', 'dark', 'purple', 'green', 'orange'];
        const currentTheme = window.themeManager.getCurrentTheme();
        const currentIndex = themes.indexOf(currentTheme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        window.themeManager.setTheme(nextTheme);
      }
    });

    // Add development info to console
    console.log('🛠️ Development Mode Active');
    console.log('Keyboard Shortcuts:');
    console.log('  Ctrl+Shift+P: Export Performance Report');
    console.log('  Ctrl+Shift+U: Export UX Analytics');
    console.log('  Ctrl+Shift+T: Cycle Themes');
  }

  destroy() {
    // Cleanup method for SPA navigation
    Object.values(this.components).forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
  }
}

// Initialize the application
const app = new App();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}
