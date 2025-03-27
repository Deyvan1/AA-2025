/**
 * Main JavaScript file for the portfolio website
 * Includes navigation, animations, form handling, and more
 */

document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // NAVIGATION & MENU TOGGLE
    // =============================================
    
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');
    
    // Ajouter les indices pour le délai d'animation du menu
    navLinksItems.forEach((link, index) => {
      link.style.setProperty('--i', index);
    });
    
    // Toggle menu function
    function toggleMenu() {
      // Toggle active class for hamburger animation
      hamburger.classList.toggle('active');
      
      // Toggle active class for menu display
      navLinks.classList.toggle('active');
      
      // Toggle body scroll when menu is open
      document.body.classList.toggle('no-scroll', navLinks.classList.contains('active'));
    }
    
    // Event listener for hamburger click
    hamburger.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on a link
    navLinksItems.forEach(item => {
      item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
          toggleMenu();
        }
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      const isClickInsideNav = navLinks.contains(event.target);
      const isClickOnHamburger = hamburger.contains(event.target);
      
      if (navLinks.classList.contains('active') && !isClickInsideNav && !isClickOnHamburger) {
        toggleMenu();
      }
    });
    
    // =============================================
    // SMOOTH SCROLLING
    // =============================================
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Calculate header height for offset
          const headerHeight = document.querySelector('header').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Scroll Down button in hero section
    const scrollDownBtn = document.querySelector('.scroll-down');
    if (scrollDownBtn) {
      scrollDownBtn.addEventListener('click', () => {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
          const headerHeight = document.querySelector('header').offsetHeight;
          const targetPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    }
    
    // =============================================
    // SCROLL REVEAL ANIMATIONS
    // =============================================
    
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll(
      '.section-title, .about-img, .about-text, .project-card, .contact-info, .contact-form, .skill'
    );
    
    // Add fade-in class to all elements to be animated
    animatedElements.forEach(el => {
      el.classList.add('fade-in');
    });
    
    // Function to check if element is in viewport and trigger animation
    function checkScroll() {
      const triggerBottom = window.innerHeight * 0.85; // 85% of viewport height
      
      animatedElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        
        if (elementTop < triggerBottom) {
          el.classList.add('visible');
        }
      });
    }
    
    // Check elements on load and scroll
    window.addEventListener('load', checkScroll);
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    
    // =============================================
    // TYPING ANIMATION FOR HERO NAME
    // =============================================
    
    const nameElement = document.getElementById('name');
    if (nameElement) {
      const nameText = nameElement.textContent;
      // Store original text
      nameElement.setAttribute('data-text', nameText);
      // Clear for animation
      nameElement.textContent = '';
      nameElement.classList.add('typing-effect');
      
      // Start typing animation
      let charIndex = 0;
      
      function typeText() {
        if (charIndex < nameText.length) {
          nameElement.textContent += nameText.charAt(charIndex);
          charIndex++;
          setTimeout(typeText, 100); // Typing speed
        } else {
          // Remove typing cursor when done
          nameElement.classList.remove('typing-effect');
        }
      }
      
      // Delay start of typing animation for better UX
      setTimeout(typeText, 500);
    }
    
    // =============================================
    // DYNAMIC HEADER
    // =============================================
    
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    // Function to update header on scroll
    function updateHeader() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add shadow and reduce padding when scrolled
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      // Hide header when scrolling down, show when scrolling up
      if (scrollTop > lastScrollTop && scrollTop > 200) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop;
    }
    
    window.addEventListener('scroll', updateHeader);
    
    // =============================================
    // CONTACT FORM SUBMISSION
    // =============================================
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
      contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Display loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          subject: document.getElementById('subject').value,
          message: document.getElementById('message').value
        };
        
        try {
          // Send data to server
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          
          const data = await response.json();
          
          // Create notification element
          const notification = document.createElement('div');
          notification.className = 'notification';
          
          if (data.success) {
            notification.classList.add('success');
            notification.textContent = 'Merci pour votre message ! Je vous répondrai dès que possible.';
            contactForm.reset();
          } else {
            notification.classList.add('error');
            notification.textContent = `Erreur: ${data.message || 'Une erreur est survenue.'}`;
          }
          
          // Add notification to page
          contactForm.appendChild(notification);
          
          // Remove notification after 5 seconds
          setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
              notification.remove();
            }, 500);
          }, 5000);
          
        } catch (error) {
          console.error('Erreur:', error);
          
          // Show error notification
          const notification = document.createElement('div');
          notification.className = 'notification error';
          notification.textContent = 'Une erreur est survenue lors de l\'envoi du message.';
          contactForm.appendChild(notification);
          
          // Remove notification after 5 seconds
          setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
              notification.remove();
            }, 500);
          }, 5000);
        } finally {
          // Restore button state
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        }
      });
    }
    
    // =============================================
    // PROJECT FILTERS (Optional feature)
    // =============================================
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length > 0) {
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Remove active class from all buttons
          filterButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active class to clicked button
          button.classList.add('active');
          
          // Get filter value
          const filterValue = button.getAttribute('data-filter');
          
          // Filter projects
          projectCards.forEach(card => {
            if (filterValue === 'all') {
              card.style.display = 'block';
            } else {
              if (card.classList.contains(filterValue)) {
                card.style.display = 'block';
              } else {
                card.style.display = 'none';
              }
            }
          });
        });
      });
    }
    
    // =============================================
    // SKILLS PROGRESS BARS (Optional feature)
    // =============================================
    
    const skillBars = document.querySelectorAll('.skill-progress');
    
    function animateSkills() {
      skillBars.forEach(skill => {
        const percentage = skill.getAttribute('data-progress');
        const progressBar = skill.querySelector('.progress-bar');
        
        progressBar.style.width = '0%';
        
        setTimeout(() => {
          progressBar.style.width = percentage + '%';
        }, 200);
      });
    }
    
    // Animate skills when about section is visible
    const aboutSection = document.querySelector('#about');
    if (aboutSection && skillBars.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateSkills();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(aboutSection);
    }
    
    // =============================================
    // THEME SWITCHER (Optional feature)
    // =============================================
    
    const themeSwitcher = document.querySelector('.theme-switch');
    
    if (themeSwitcher) {
      const storedTheme = localStorage.getItem('theme') || 'light';
      
      // Set initial theme
      if (storedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeSwitcher.classList.add('active');
      }
      
      themeSwitcher.addEventListener('click', () => {
        // Toggle theme
        document.body.classList.toggle('dark-theme');
        themeSwitcher.classList.toggle('active');
        
        // Store preference
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
      });
    }
    
    // =============================================
    // PRELOADER (Optional feature)
    // =============================================
    
    const preloader = document.querySelector('.preloader');
    
    if (preloader) {
      window.addEventListener('load', () => {
        preloader.classList.add('fade-out');
        
        setTimeout(() => {
          preloader.style.display = 'none';
          
          // Start animations after preloader is gone
          document.body.classList.add('loaded');
        }, 500);
      });
    }
    
    // =============================================
    // BACK TO TOP BUTTON
    // =============================================
    
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          backToTopBtn.classList.add('show');
        } else {
          backToTopBtn.classList.remove('show');
        }
      });
      
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
    
    // =============================================
    // IMAGE LAZY LOADING
    // =============================================
    
    // Use Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[data-src]');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    }
  });