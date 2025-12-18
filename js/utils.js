
// ============================================
// SCROLL UTILITIES
// ============================================

/**
 * Smooth scroll para uma seção específica
 * @param {string} elementId - ID do elemento alvo
 */
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 64;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navbarHeight - 20;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

/**
 * Detecta se elemento está visível na viewport
 * @param {Element} element - Elemento DOM
 * @returns {boolean}
 */
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Verifica se usuário scrollou além de determinado ponto
 * @param {number} threshold - Quantidade de pixels
 * @returns {boolean}
 */
function hasScrolledPast(threshold = 100) {
  return window.pageYOffset > threshold;
}

// ============================================
// DOM UTILITIES
// ============================================

/**
 * Seleciona elemento do DOM
 * @param {string} selector - Seletor CSS
 * @returns {Element|null}
 */
function $(selector) {
  return document.querySelector(selector);
}

/**
 * Seleciona múltiplos elementos do DOM
 * @param {string} selector - Seletor CSS
 * @returns {NodeList}
 */
function $$(selector) {
  return document.querySelectorAll(selector);
}

/**
 * Adiciona classe a elemento
 * @param {Element} element 
 * @param {string} className 
 */
function addClass(element, className) {
  if (element) {
    element.classList.add(className);
  }
}

/**
 * Remove classe de elemento
 * @param {Element} element 
 * @param {string} className 
 */
function removeClass(element, className) {
  if (element) {
    element.classList.remove(className);
  }
}

/**
 * Alterna classe de elemento
 * @param {Element} element 
 * @param {string} className 
 */
function toggleClass(element, className) {
  if (element) {
    element.classList.toggle(className);
  }
}

/**
 * Verifica se elemento tem classe
 * @param {Element} element 
 * @param {string} className 
 * @returns {boolean}
 */
function hasClass(element, className) {
  return element ? element.classList.contains(className) : false;
}

// ============================================
// URL & NAVIGATION UTILITIES
// ============================================

/**
 * Obtém parâmetro da URL
 * @param {string} param - Nome do parâmetro
 * @returns {string|null}
 */
function getUrlParameter(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Atualiza parâmetro da URL sem recarregar página
 * @param {string} param - Nome do parâmetro
 * @param {string} value - Valor do parâmetro
 */
function updateUrlParameter(param, value) {
  const url = new URL(window.location);
  url.searchParams.set(param, value);
  window.history.pushState({}, '', url);
}

/**
 * Obtém nome da página atual
 * @returns {string}
 */
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  return page.replace('.html', '');
}

// ============================================
// ANIMATION UTILITIES
// ============================================

/**
 * Adiciona animação de fade in aos elementos ao scroll
 */
function initScrollAnimations() {
  const animatedElements = $$('[data-animate]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const animationType = entry.target.getAttribute('data-animate');
        addClass(entry.target, `animate-${animationType}`);
        addClass(entry.target, 'animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Debounce function - executa função após delay
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - limita execuções por tempo
 * @param {Function} func 
 * @param {number} limit 
 * @returns {Function}
 */
function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ============================================
// LOADING & FEEDBACK UTILITIES
// ============================================

/**
 * Mostra indicador de loading
 * @param {Element} element 
 */
function showLoading(element) {
  if (element) {
    addClass(element, 'loading');
    element.disabled = true;
  }
}

/**
 * Esconde indicador de loading
 * @param {Element} element 
 */
function hideLoading(element) {
  if (element) {
    removeClass(element, 'loading');
    element.disabled = false;
  }
}

/**
 * Mostra toast/notificação simples
 * @param {string} message 
 * @param {string} type - 'success', 'error', 'info'
 */
function showToast(message, type = 'info') {
  // Remove toast anterior se existir
  const existingToast = $('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Cria novo toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // Estilos inline para toast
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 16px 24px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 9999;
    animation: slideInRight 0.3s ease-out;
    font-weight: 500;
  `;

  document.body.appendChild(toast);

  // Remove após 3 segundos
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// DATE & TIME UTILITIES
// ============================================

/**
 * Formata data para padrão brasileiro
 * @param {Date|string} date 
 * @returns {string}
 */
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formata período (data início - data fim)
 * @param {Date|string} startDate 
 * @param {Date|string} endDate 
 * @param {boolean} ongoing 
 * @returns {string}
 */
function formatPeriod(startDate, endDate = null, ongoing = false) {
  const start = new Date(startDate);
  const startFormatted = start.toLocaleDateString('pt-BR', {
    month: 'short',
    year: 'numeric'
  });

  if (ongoing) {
    return `${startFormatted} - Atual`;
  }

  if (endDate) {
    const end = new Date(endDate);
    const endFormatted = end.toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric'
    });
    return `${startFormatted} - ${endFormatted}`;
  }

  return startFormatted;
}

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Valida email
 * @param {string} email 
 * @returns {boolean}
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Valida telefone brasileiro
 * @param {string} phone 
 * @returns {boolean}
 */
function validatePhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
}

/**
 * Formata telefone brasileiro
 * @param {string} phone 
 * @returns {string}
 */
function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

// ============================================
// EXPORT (para usar em outros arquivos)
// ============================================

// Se estiver usando módulos ES6, descomente:
// export { scrollToElement, isElementInViewport, ... };

// Para uso global, as funções já estão disponíveis no window
console.log('✅ Utils.js carregado com sucesso!');