// Estado inicial de idioma
let currentLang = 'pt';

// Seletores
const langToggle = document.getElementById('langToggle');

// Alternar idioma
function toggleLanguage() {
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    langToggle.textContent = currentLang === 'pt' ? 'EN' : 'PT';
    
    // Atualiza todos os elementos com atributos de idioma
    const elements = document.querySelectorAll('[data-pt][data-en]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${currentLang}`);
        if (text) {
            element.innerHTML = text;
        }
    });

    // Atualiza placeholder de textarea
    const textarea = document.querySelector('textarea[data-pt-placeholder][data-en-placeholder]');
    if (textarea) {
        const placeholder = textarea.getAttribute(`data-${currentLang}-placeholder`);
        if (placeholder) {
            textarea.placeholder = placeholder;
        }
    }

    // Atualiza labels dos botões de CV
    updateCVButtonLabels();

    // Atualiza o atributo lang do HTML
    document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : 'en';

    // Salva preferência no localStorage
    localStorage.setItem('language', currentLang);

    // Anúncio para leitores de tela
    announceToScreenReader(
        currentLang === 'pt' ? 'Idioma alterado para Português' : 'Language changed to English'
    );
}

// Atualizar labels dos botões de CV conforme idioma
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

// Função auxiliar para acessibilidade (leitores de tela)
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

// Evento do botão de idioma
if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
}

// Carregar preferência salva ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'pt';
    if (savedLang !== currentLang) {
        toggleLanguage();
    }
});