// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== Navigation Smooth Scrolling ==========
    // Sélectionner tous les liens dans la navigation
    const navLinks = document.querySelectorAll('nav a');
    
    // Ajouter un écouteur d'événement à chaque lien
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Empêcher le comportement par défaut du lien
            e.preventDefault();
            
            // Obtenir l'ID de la section cible depuis l'attribut href
            const targetId = this.getAttribute('href');
            
            // Si c'est un lien interne commençant par #
            if (targetId.startsWith('#')) {
                // Sélectionner l'élément cible
                const targetElement = document.querySelector(targetId);
                
                // Si l'élément existe, faire défiler vers lui en douceur
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, // Réduire de 70px pour tenir compte du header
                        behavior: 'smooth'
                    });
                    
                    // Mettre à jour l'URL sans recharger la page
                    history.pushState(null, null, targetId);
                    
                    // Mettre à jour la classe active
                    updateActiveNavLink(targetId);
                }
            } else {
                // Si c'est un lien externe, simplement y naviguer
                window.location.href = targetId;
            }
        });
    });
    
    // ========== Mise à jour de la navigation active au défilement ==========
    window.addEventListener('scroll', throttle(function() {
        // Obtenir la position actuelle du défilement
        const scrollPosition = window.scrollY;
        
        // Trouver quelle section est actuellement visible
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Tenir compte du header
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        // Si nous sommes tout en haut de la page, considérer que nous sommes à l'accueil
        if (scrollPosition < 100) {
            currentSection = '#';
        }
        
        // Mettre à jour la classe active dans la navigation
        updateActiveNavLink(currentSection);
    }, 100)); // Limiter à une fois toutes les 100ms
    
    // ========== Gestion du formulaire de contact ==========
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const firstName = document.getElementById('firstname').value;
            const lastName = document.getElementById('lastname').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Validation simple
            if (!firstName || !lastName || !subject || !message) {
                alert('Veuillez remplir tous les champs du formulaire.');
                return;
            }
            
            // Simuler l'envoi du formulaire (à remplacer par votre logique d'envoi réelle)
            console.log('Envoi du formulaire:', {
                firstName,
                lastName,
                subject,
                message
            });
            
            // Réinitialiser le formulaire
            contactForm.reset();
            
            // Afficher un message de confirmation
            alert('Votre message a été envoyé avec succès !');
        });
    }
    
    // ========== Animation des barres de compétences ==========
    // Animation des barres de progression lors du défilement
    const skillBars = document.querySelectorAll('.skill-progress');
    
    // Observer les barres de compétences et les animer quand elles entrent dans la vue
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Récupérer la largeur définie en style inline
                const width = entry.target.style.width;
                
                // Réinitialiser d'abord la largeur à 0
                entry.target.style.width = '0';
                
                // Puis animer vers la largeur cible
                setTimeout(() => {
                    entry.target.style.transition = 'width 1s ease-in-out';
                    entry.target.style.width = width;
                }, 100);
                
                // Arrêter d'observer une fois animé
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Observer chaque barre de compétence
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
    
    // ========== Fonctions utilitaires ==========
    
    // Fonction pour mettre à jour la navigation active
    function updateActiveNavLink(targetId) {
        navLinks.forEach(link => {
            // Récupérer l'attribut href du lien
            const href = link.getAttribute('href');
            
            // Si nous sommes à l'accueil et le lien est #, ou si le lien correspond à la section active
            if ((targetId === '#' && href === '#') || href === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Fonction pour limiter la fréquence d'exécution (throttle)
    function throttle(callback, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            callback(...args);
        };
    }
});