// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initCompetenciasPage();
});

function initCompetenciasPage() {
  // Inicializar animações de scroll
  initScrollAnimations();
  
  // Inicializar observer para animar barras
  initSkillBarsObserver();
  
  console.log('✅ Página de competências inicializada');
}

// ============================================
// ANIMAÇÃO DAS BARRAS DE PROGRESSO
// ============================================

function initSkillBarsObserver() {
  const skillItems = document.querySelectorAll('.skill-item');
  
  // Intersection Observer para detectar quando skill entra na viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBar(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  });
  
  // Observar cada skill item
  skillItems.forEach(item => {
    observer.observe(item);
  });
}

function animateSkillBar(skillItem) {
  const progressBar = skillItem.querySelector('.skill-progress');
  if (!progressBar) return;
  
  const progress = progressBar.getAttribute('data-progress');
  
  // Marcar como visível
  skillItem.classList.add('visible');
  
  // Animar a barra
  progressBar.style.setProperty('--progress-width', `${progress}%`);
  progressBar.style.width = `${progress}%`;
}

// ============================================
// ANIMAR TODAS AS BARRAS (fallback)
// ============================================

// Se o Intersection Observer não funcionar, animar após 1 segundo
setTimeout(() => {
  const skillItems = document.querySelectorAll('.skill-item:not(.visible)');
  skillItems.forEach((item, index) => {
    setTimeout(() => {
      animateSkillBar(item);
    }, index * 100);
  });
}, 1000);

console.log('✅ Competencias.js carregado');