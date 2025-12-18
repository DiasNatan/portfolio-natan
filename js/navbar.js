
// ============================================
// VARIÁVEIS GLOBAIS
// ============================================

let navbar;
let navbarToggle;
let navbarMobile;
let navbarLinks;
let lastScrollPosition = 0;

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollEffects();
  initMobileMenu();
  highlightActiveLink();
});

/**
 * Inicializa elementos do navbar
 */
function initNavbar() {
  navbar = document.querySelector('.navbar');
  navbarToggle = document.querySelector('.navbar-toggle');
  navbarMobile = document.querySelector('.navbar-mobile');
  navbarLinks = document.querySelectorAll('.navbar-link, .navbar-mobile-link');

  if (!navbar) {
    console.warn('⚠️ Navbar não encontrado');
    return;
  }

  console.log('✅ Navbar inicializado');
}

// ============================================
// EFEITOS DE SCROLL
// ============================================

/**
 * Inicializa efeitos ao scrollar
 */
function initScrollEffects() {
  // Throttle do scroll para performance
  const handleScroll = throttle(() => {
    handleNavbarScroll();
    hideNavbarOnScrollDown();
  }, 100);

  window.addEventListener('scroll', handleScroll);
}

/**
 * Adiciona classe 'scrolled' quando scroll > 50px
 */
function handleNavbarScroll() {
  if (!navbar) return;

  if (window.pageYOffset > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

/**
 * Esconde navbar ao scrollar para baixo (opcional)
 */
function hideNavbarOnScrollDown() {
  // Descomente para ativar o hide ao scrollar para baixo
  /*
  const currentScrollPosition = window.pageYOffset;

  if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 100) {
    // Scrollando para baixo
    navbar.style.transform = 'translateY(-100%)';
  } else {
    // Scrollando para cima
    navbar.style.transform = 'translateY(0)';
  }

  lastScrollPosition = currentScrollPosition;
  */
}

// ============================================
// MENU MOBILE
// ============================================

/**
 * Inicializa menu mobile (hamburguer)
 */
function initMobileMenu() {
  if (!navbarToggle || !navbarMobile) {
    console.warn('⚠️ Elementos do menu mobile não encontrados');
    return;
  }

  // Toggle ao clicar no hamburguer
  navbarToggle.addEventListener('click', toggleMobileMenu);

  // Fechar ao clicar em um link
  const mobileLinks = document.querySelectorAll('.navbar-mobile-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Fechar ao clicar fora
  navbarMobile.addEventListener('click', (e) => {
    if (e.target === navbarMobile) {
      closeMobileMenu();
    }
  });

  // Fechar ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbarMobile.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  console.log('✅ Menu mobile inicializado');
}

/**
 * Abre/fecha menu mobile
 */
function toggleMobileMenu() {
  navbarToggle.classList.toggle('active');
  navbarMobile.classList.toggle('active');
  
  // Previne scroll do body quando menu está aberto
  if (navbarMobile.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

/**
 * Fecha menu mobile
 */
function closeMobileMenu() {
  navbarToggle.classList.remove('active');
  navbarMobile.classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================
// NAVEGAÇÃO
// ============================================

/**
 * Destaca link ativo baseado na página atual
 */
function highlightActiveLink() {
  const currentPage = getCurrentPage();
  
  navbarLinks.forEach(link => {
    const linkPage = link.getAttribute('href').replace('.html', '').replace('/', '');
    
    if (linkPage === currentPage || 
        (currentPage === 'index' && linkPage === '') ||
        (currentPage === '' && linkPage === 'index')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Navegação suave para âncoras na mesma página
 */
function initSmoothScroll() {
  navbarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Se for âncora (#section)
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        scrollToElement(targetId);
        closeMobileMenu();
      }
    });
  });
}

// Inicializar smooth scroll
initSmoothScroll();

// ============================================
// UTILITÁRIOS
// ============================================

/**
 * Obtém nome da página atual
 */
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  return page.replace('.html', '');
}

/**
 * Scroll suave para elemento
 */
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    const navbarHeight = navbar ? navbar.offsetHeight : 64;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navbarHeight - 20;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

/**
 * Throttle function para performance
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
// EXPORT
// ============================================

// Exportar funções para uso global
window.navbarUtils = {
  closeMobileMenu,
  highlightActiveLink,
  scrollToElement
};

console.log('✅ Navbar.js carregado com sucesso!');