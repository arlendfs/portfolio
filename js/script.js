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

// Arquivos de CV por idioma
const CV_FILES = {
    pt: 'assets/resume/Arlen_CV_Portugues.pdf',
    en: 'assets/resume/Arlen_Resume_English.pdf'
};

// Função de download de CV
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

        // Mensagem de sucesso
        const message = currentLang === 'pt' 
            ? 'Download do CV iniciado!' 
            : 'Resume download started!';

        showNotification(message, 'success');

        // Analytics (se estiver configurado)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download_cv', {
                'event_category': 'engagement',
                'event_label': currentLang,
                'value': 1
            });
        }

    } catch (error) {
        console.error('Erro ao baixar CV:', error);

        // Mensagem alternativa (fallback)
        const fallbackMessage = currentLang === 'pt' 
            ? 'CV em desenvolvimento. Entre em contato para solicitar uma cópia.' 
            : 'Resume under development. Please contact me to request a copy.';

        showNotification(fallbackMessage, 'info');
    }
}

// Função de notificação
function showNotification(message, type = 'info') {
    // Cria elemento
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" aria-label="Fechar notificação">×</button>
    `;

    // Estilo inline
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

    // Estilo de animação (adicionado apenas uma vez)
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

    // Remove automático após 5s
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Eventos nos botões de download
document.querySelectorAll('#downloadCV, #downloadCVContact').forEach(button => {
    button.addEventListener('click', downloadCV);
});