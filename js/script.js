// Language and theme management
let currentLang = 'pt';
const langToggle = document.getElementById('langToggle');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// CV download functionality
const CV_FILES = {
    pt: 'assets/resume/Arlen_CV_Portugues.pdf',
    en: 'assets/resume/Arlen_Resume_English.pdf'
};

// Language Toggle Function
function toggleLanguage() {
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    langToggle.textContent = currentLang === 'pt' ? 'EN' : 'PT';
    
    // Update all elements with language attributes
    const elements = document.querySelectorAll('[data-pt][data-en]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${currentLang}`);
        if (text) {
            element.innerHTML = text;
        }
    });

    // Update placeholder for textarea
    const textarea = document.querySelector('textarea[data-pt-placeholder][data-en-placeholder]');
    if (textarea) {
        const placeholder = textarea.getAttribute(`data-${currentLang}-placeholder`);
        if (placeholder) {
            textarea.placeholder = placeholder;
        }
    }

    // Update aria-labels and titles for CV buttons
    updateCVButtonLabels();

    // Update HTML lang attribute
    document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : 'en';
    
    // Save language preference
    localStorage.setItem('language', currentLang);
    
    // Announce language change to screen readers
    announceToScreenReader(
        currentLang === 'pt' ? 'Idioma alterado para Português' : 'Language changed to English'
    );
}

// Update CV button labels based on current language
function updateCVButtonLabels() {
    const cvButtons = document.querySelectorAll('#downloadCV, #downloadCVContact');
    cvButtons.forEach(button => {
        const ariaLabel = currentLang === 'pt' 
            ? 'Baixar currículo em PDF' 
            : 'Download resume in PDF';
        const title = currentLang === 'pt' 
            ? 'Baixar currículo em PDF' 
            : 'Download resume in PDF';
        
        button.setAttribute('aria-label', ariaLabel);
        button.setAttribute('title', title);
    });
}

// CV Download Function
function downloadCV() {
    const fileName = CV_FILES[currentLang];
    const link = document.createElement('a');
    try {
        link.href = fileName;
        link.download = currentLang === 'pt' ? 'Arlen_CV_Portugues.pdf' : 'Arlen_Resume_English.pdf';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Success message
        const message = currentLang === 'pt' 
            ? 'Download do CV iniciado!' 
            : 'Resume download started!';
        
        showNotification(message, 'success');
        
        // Analytics tracking (if needed)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download_cv', {
                'event_category': 'engagement',
                'event_label': currentLang,
                'value': 1
            });
        }
        
    } catch (error) {
        console.error('Error downloading CV:', error);
        
        // For demo purposes, show alternative message
        const fallbackMessage = currentLang === 'pt' 
            ? 'CV em desenvolvimento. Entre em contato para solicitar uma cópia.' 
            : 'Resume under development. Please contact me to request a copy.';
        
        showNotification(fallbackMessage, 'info');
    }
}

// Show notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" aria-label="Fechar notificação">×</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary-color)' : 'var(--secondary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add animation styles
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Screen reader announcement function
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Theme Toggle Function
function toggleTheme() {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    const themeIcon = themeToggle.querySelector('img'); // 1. Selecionamos a imagem dentro do botão

    // 2. Trocamos o SRC da imagem
    themeIcon.src = isLight ? 'assets/icons/sol.gif' : 'assets/icons/lua.gif';

    // Update aria-label
    const ariaLabel = isLight 
        ? (currentLang === 'pt' ? 'Alternar para tema escuro' : 'Switch to dark theme')
        : (currentLang === 'pt' ? 'Alternar para tema claro' : 'Switch to light theme');
    themeToggle.setAttribute('aria-label', ariaLabel);

    localStorage.setItem('theme', isLight ? 'light' : 'dark');

    // Announce theme change
    const message = isLight 
        ? (currentLang === 'pt' ? 'Tema claro ativado' : 'Light theme activated')
        : (currentLang === 'pt' ? 'Tema escuro ativado' : 'Dark theme activated');
    announceToScreenReader(message);
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.getElementById('mobileToggle');
    
    navMenu.classList.toggle('active');
    
    // Update aria attributes
    const isOpen = navMenu.classList.contains('active');
    mobileToggle.setAttribute('aria-expanded', isOpen.toString());
    
    // Animate hamburger menu
    const spans = mobileToggle.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (isOpen) {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            span.style.transform = 'none';
            span.style.opacity = '1';
        }
    });
}

// EFEITO UFO - FUNÇÕES PARA O DISCO VOADOR
// Função para atualizar a posição do UFO
function updateUFOPosition() {
    const navMenu = document.querySelector('.nav-menu');
    const activeLink = document.querySelector('.nav-menu a.active');
    
    if (!navMenu) return;
    
    if (activeLink) {
        const navRect = navMenu.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        
        // Calcula a posição relativa do link ativo dentro do menu
        const leftPosition = linkRect.left - navRect.left;
        const linkWidth = linkRect.width;
        
        // Define as propriedades CSS customizadas para posicionar o UFO
        navMenu.style.setProperty('--ufo-left', `${leftPosition}px`);
        navMenu.style.setProperty('--ufo-width', `${linkWidth}px`);
        
        // Adiciona a classe que mostra o UFO
        navMenu.classList.add('has-active');
    } else {
        // Remove o UFO se não há link ativo
        navMenu.classList.remove('has-active');
    }
}

// Função melhorada para definir o link ativo com efeito UFO
function setActiveNavLink(link) {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    // Remove a classe ativa de todos os links
    navLinks.forEach(l => l.classList.remove('active'));
    
    // Adiciona a classe ativa ao link especificado
    if (link) {
        link.classList.add('active');
    }
    
    // Atualiza a posição do UFO
    requestAnimationFrame(updateUFOPosition);
}

// Função para detectar seção ativa durante o scroll com UFO
function onScrollNavActive() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    let scrollPos = window.scrollY || window.pageYOffset;
    let found = false;
    
    navLinks.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (section) {
            const top = section.offsetTop - 100; // Offset para compensar o header
            const bottom = top + section.offsetHeight;
            
            if (scrollPos >= top && scrollPos < bottom) {
                setActiveNavLink(link);
                found = true;
            }
        }
    });
    
    // Se não encontrou nenhuma seção ativa, remove o UFO
    if (!found) {
        setActiveNavLink(null);
    }
}

// Função para inicializar o efeito UFO
function initializeUFOEffect() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    // Adiciona event listener para cliques nos links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            setActiveNavLink(this);
        });
        
        // Efeito hover temporário para preview
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                const navMenu = document.querySelector('.nav-menu');
                const navRect = navMenu.getBoundingClientRect();
                const linkRect = this.getBoundingClientRect();
                
                const leftPosition = linkRect.left - navRect.left;
                const linkWidth = linkRect.width;
                
                // Cria um UFO temporário para hover
                navMenu.style.setProperty('--ufo-hover-left', `${leftPosition}px`);
                navMenu.style.setProperty('--ufo-hover-width', `${linkWidth}px`);
                navMenu.classList.add('has-hover');
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.classList.remove('has-hover');
        });
    });
    
    // Event listener para scroll
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                onScrollNavActive();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Event listener para resize
    window.addEventListener('resize', () => {
        setTimeout(updateUFOPosition, 100);
    });
    
    // Inicialização
    requestAnimationFrame(() => {
        onScrollNavActive();
    });
}

// Initialize application
function initializeApp() {
    // Load saved preferences
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedLang = localStorage.getItem('language') || 'pt';
    
    // Apply saved theme
    const themeIcon = themeToggle.querySelector('img');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeIcon.src = 'assets/icons/sol.gif';
    } else {
        themeIcon.src = 'assets/icons/lua.gif';
    }
    
    // Apply saved language
    if (savedLang !== currentLang) {
        toggleLanguage();
    }

    // Set initial ARIA labels
    updateCVButtonLabels();
    const isLight = body.classList.contains('light-mode');
    const themeAriaLabel = isLight 
        ? (currentLang === 'pt' ? 'Alternar para tema escuro' : 'Switch to dark theme')
        : (currentLang === 'pt' ? 'Alternar para tema claro' : 'Switch to light theme');
    themeToggle.setAttribute('aria-label', themeAriaLabel);
    
    // Mobile menu initial state
    document.getElementById('mobileToggle').setAttribute('aria-expanded', 'false');
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                const mobileToggle = document.getElementById('mobileToggle');
                
                if (navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
                
                // Smooth scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Focus management for accessibility
                target.focus();
                if (target.scrollIntoView) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Progress Bar Animation
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 200);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// Header Background on Scroll
function initializeHeaderScroll() {
    let ticking = false;
    const header = document.querySelector('.header');
    const logo = document.querySelector('.logo');

    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header.style.background = body.classList.contains('light-mode') 
                ? 'rgba(255, 255, 255, 0.98)' 
                : 'rgba(10, 10, 10, 0.98)';
            
            // Altera o logo quando o usuário rola a página
            logo.innerHTML = '<a href="#home" aria-label="Voltar para o início"><span>&lt;</span>Arlen Freitas<span> /&gt;</span></a>'; 
        } else {
            header.style.background = 'transparent';
            
            // Volta para o logo inicial
            logo.innerHTML = '<a href="#home" aria-label="Voltar para o início"><span>&lt;</span>A<span> /&gt;</span></a>'; 
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    // Chama a função uma vez no início para definir o estado inicial
    requestTick(); 
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Contact Form Handling
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                const errorMessage = currentLang === 'pt' 
                    ? 'Por favor, preencha todos os campos.' 
                    : 'Please fill in all fields.';
                showNotification(errorMessage, 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                const errorMessage = currentLang === 'pt' 
                    ? 'Por favor, digite um email válido.' 
                    : 'Please enter a valid email address.';
                showNotification(errorMessage, 'error');
                return;
            }
            
            // Show success message
            const successMessage = currentLang === 'pt' 
                ? 'Obrigado pela sua mensagem! Entrarei em contato em breve.' 
                : 'Thank you for your message! I will get in touch soon.';
            
            showNotification(successMessage, 'success');
            
            // Reset form
            this.reset();
            
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'contact_form_submit', {
                    'event_category': 'engagement',
                    'event_label': 'contact_form'
                });
            }
        });
    }
}

// Stats Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const hasPlus = counter.textContent.includes('+');
        const hasPercent = counter.textContent.includes('%');
        
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                const suffix = hasPercent ? '%' : (hasPlus ? '+' : '');
                counter.textContent = target + suffix;
                clearInterval(timer);
            } else {
                const suffix = hasPercent ? '%' : (hasPlus ? '+' : '');
                counter.textContent = Math.floor(current) + suffix;
            }
        }, 20);
    });
}

// Initialize stats counter animation
function initializeStatsCounter() {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }
}

// Typing Animation for Hero Section
const heroTitle = document.querySelector('.hero-content h1');
const originalText = heroTitle ? heroTitle.textContent : '';

function typeWriter(text, element, speed = 100) {
    if (!element) return;
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Função para o Preloader
function initializePreloader() {
    const preloader = document.createElement('div');
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-color);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;

    const loader = document.createElement('div');
    loader.style.cssText = `
        width: 50px;
        height: 50px;
        border: 3px solid var(--border-color);
        border-top: 3px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;

    // Adiciona a animação @keyframes spin
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    preloader.appendChild(loader);
    document.body.appendChild(preloader);

    // Esconde o preloader após o conteúdo carregar
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
                }, 500); // tempo para a animação de fade-out
            }, 500); // um pequeno delay para garantir que tudo foi renderizado
        });
    }

// Keyboard navigation improvements
function initializeKeyboardNavigation() {
    // Handle mobile menu keyboard navigation
    const mobileToggle = document.getElementById('mobileToggle');
    
    mobileToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
    
    // Trap focus in mobile menu when open
    document.addEventListener('keydown', function(e) {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu.classList.contains('active') && e.key === 'Escape') {
            toggleMobileMenu();
            mobileToggle.focus();
        }
    });
}

// Event Listeners
function attachEventListeners() {
    // Language toggle
    langToggle.addEventListener('click', toggleLanguage);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    mobileToggle.addEventListener('click', toggleMobileMenu);
    
    // CV download buttons
    const downloadCVButton = document.getElementById('downloadCV');
    const downloadCVContactButton = document.getElementById('downloadCVContact');
    
    if (downloadCVButton) {
        downloadCVButton.addEventListener('click', downloadCV);
    }
    
    if (downloadCVContactButton) {
        downloadCVContactButton.addEventListener('click', downloadCV);
    }
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Handle window resize for mobile menu
    window.addEventListener('resize', () => {
        const navMenu = document.querySelector('.nav-menu');
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
}

// Performance optimizations
function optimizePerformance() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Main initialization function
function init() {
    // Wait for DOM to be fully loaded
    initializePreloader();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }

    // Initialize all functionality
    initializeApp();
    attachEventListeners();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeProgressBars();
    initializeHeaderScroll();
    initializeContactForm();
    initializeStatsCounter();
    initializeKeyboardNavigation();
    optimizePerformance();
    
    // INICIALIZAR O EFEITO UFO
    initializeUFOEffect();

    // Start typing animation when page loads
    window.addEventListener('load', () => {
            setTimeout(() => {
                if (heroTitle && originalText) {
                    typeWriter(originalText, heroTitle, 100);
                }
            }, 500);
    });
    
    console.log('Portfolio initialized successfully');
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Portfolio error:', e.error);
    
    // Show user-friendly error message
    const errorMessage = currentLang === 'pt' 
        ? 'Ocorreu um erro inesperado. Tente recarregar a página.' 
        : 'An unexpected error occurred. Please try refreshing the page.';
    
    showNotification(errorMessage, 'error');
});

// MATRIX EFFECT
const state = {
    fps: 60,
    color: "rgba(0, 110, 255, 1)",
    charset: "0123456789ABCDEF",
    size:10
};

// Corrigir criação do dat.GUI
let gui = null, fpsCtrl, colorCtrl, charsetCtrl, sizeCtrl;
if (window.dat && window.dat.GUI) {
    gui = new window.dat.GUI({ closed: true });
    fpsCtrl = gui.add(state, 'fps', 1, 120);
    colorCtrl = gui.addColor(state, 'color');
    charsetCtrl = gui.add(state, 'charset');
    sizeCtrl = gui.add(state, 'size', 5, 20);
}

const canvas = document.getElementById('matrix');
let ctx = null;
if (canvas) {
    ctx = canvas.getContext('2d');
}

let w = 0, h = 0, p = [];

const resize = () => {
    if (!canvas) return;
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    p = Array(Math.floor(w / state.size)).fill(0);
}

window.addEventListener('resize', resize);
if (sizeCtrl && typeof sizeCtrl.onFinishChange === 'function') {
    sizeCtrl.onFinishChange(() => resize());
}
resize();

function drawMatrix() {
    if (!ctx) return;
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, w, h);
    ctx.font = `${state.size}px monospace`;
    ctx.fillStyle = state.color;
    for (let i = 0; i < p.length; i++) {
        const char = state.charset[Math.floor(Math.random() * state.charset.length)];
        ctx.fillText(char, i * state.size, p[i] * state.size);
        if (p[i] * state.size > h && Math.random() > 0.975) {
            p[i] = 0;
        }
        p[i]++;
    }
}

let animationId;
function animate() {
    drawMatrix();
    animationId = setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / state.fps);
}
if (canvas && ctx) animate();

// Start the application
init();
