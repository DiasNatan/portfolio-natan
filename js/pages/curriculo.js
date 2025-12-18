
// ============================================
// VARIÁVEIS GLOBAIS
// ============================================

let timelineData = [];
let currentFilter = 'todos';

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initTimelinePage();
});

async function initTimelinePage() {
  // Inicializar animações
  initScrollAnimations();
  
  // Carregar dados da timeline
  await loadTimelineData();
  
  // Inicializar filtros
  initFilters();
  
  // Inicializar scroll indicator
  initScrollIndicator();
  
  console.log('✅ Página de currículo inicializada');
}

// ============================================
// CARREGAR DADOS DO FIREBASE
// ============================================

async function loadTimelineData() {
  const loadingElement = document.getElementById('timeline-loading');
  const itemsContainer = document.getElementById('timeline-items');
  const emptyElement = document.getElementById('timeline-empty');
  
  try {
    // Verificar se Firebase está disponível
    if (!window.firebaseDb) {
      console.warn('⚠️ Firebase não disponível, usando dados mockados');
      timelineData = getMockData();
      renderTimeline();
      return;
    }
    
    // Buscar dados do Firestore
    const snapshot = await window.firebaseDb
      .collection('timeline')
      .where('visivel', '==', true)
      .orderBy('dataInicio', 'desc')
      .get();
    
    if (snapshot.empty) {
      console.log('ℹ️ Nenhum dado no Firestore, usando dados mockados');
      timelineData = getMockData();
    } else {
      timelineData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Converter Timestamps do Firebase para Date
          dataInicio: data.dataInicio?.toDate() || new Date(data.dataInicio),
          dataFim: data.dataFim ? (data.dataFim.toDate() || new Date(data.dataFim)) : null
        };
      });
      console.log(`✅ ${timelineData.length} itens carregados do Firebase`);
    }
    
    // Renderizar timeline
    renderTimeline();
    
  } catch (error) {
    console.error('❌ Erro ao carregar timeline:', error);
    // Em caso de erro, usar dados mockados
    timelineData = getMockData();
    renderTimeline();
  }
}

// ============================================
// RENDERIZAR TIMELINE
// ============================================

function renderTimeline(filter = 'todos') {
  const itemsContainer = document.getElementById('timeline-items');
  const loadingElement = document.getElementById('timeline-loading');
  const emptyElement = document.getElementById('timeline-empty');
  
  // Esconder loading
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
  
  // Filtrar dados
  let filteredData = timelineData;
  if (filter !== 'todos') {
    filteredData = timelineData.filter(item => item.tipo === filter);
  }
  
  // Verificar se há dados
  if (filteredData.length === 0) {
    itemsContainer.innerHTML = '';
    emptyElement.style.display = 'block';
    return;
  }
  
  emptyElement.style.display = 'none';
  
  // Renderizar itens
  itemsContainer.innerHTML = filteredData.map((item, index) => `
    <div class="timeline-item" data-type="${item.tipo}" style="animation-delay: ${index * 0.1}s">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-badge">
          ${getIconForType(item.tipo)}
          ${getTypeName(item.tipo)}
        </div>
        
        <h3 class="timeline-title">${item.titulo}</h3>
        <p class="timeline-institution">${item.instituicao}</p>
        
        <div class="timeline-period">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${formatPeriod(item.dataInicio, item.dataFim, item.emAndamento)}
        </div>
        
        ${item.descricao ? `<p class="timeline-description">${item.descricao}</p>` : ''}
        
        ${item.atividades && item.atividades.length > 0 ? `
          <ul class="timeline-activities">
            ${item.atividades.map(atividade => `<li>${atividade}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    </div>
  `).join('');
  
  // Inicializar animação de aparição
  setTimeout(() => {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('visible');
      }, index * 100);
    });
  }, 100);
}

// ============================================
// FILTROS
// ============================================

function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      
      // Atualizar botão ativo
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Aplicar filtro
      currentFilter = filter;
      renderTimeline(filter);
    });
  });
}

// ============================================
// SCROLL INDICATOR (Bola flutuante)
// ============================================

function initScrollIndicator() {
  const indicator = document.querySelector('.timeline-indicator');
  const timeline = document.querySelector('.timeline');
  
  if (!indicator || !timeline) return;
  
  window.addEventListener('scroll', throttle(() => {
    updateIndicatorPosition();
  }, 100));
  
  // Posição inicial
  updateIndicatorPosition();
}

function updateIndicatorPosition() {
  const indicator = document.querySelector('.timeline-indicator');
  const timeline = document.querySelector('.timeline');
  const timelineSection = document.querySelector('.timeline-section');
  
  if (!indicator || !timeline || !timelineSection) return;
  
  const sectionRect = timelineSection.getBoundingClientRect();
  const timelineRect = timeline.getBoundingClientRect();
  
  // Se a seção não está visível, não fazer nada
  if (sectionRect.bottom < 0 || sectionRect.top > window.innerHeight) {
    return;
  }
  
  // Calcular progresso do scroll
  const scrollProgress = Math.max(0, Math.min(1, 
    (window.innerHeight / 2 - timelineRect.top) / timelineRect.height
  ));
  
  // Atualizar posição do indicador
  const position = scrollProgress * timelineRect.height;
  indicator.style.top = `${position}px`;
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function getTypeName(tipo) {
  const names = {
    'formacao': 'Formação',
    'experiencia': 'Experiência',
    'curso': 'Curso'
  };
  return names[tipo] || tipo;
}

function getIconForType(tipo) {
  const icons = {
    'formacao': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
    </svg>`,
    'experiencia': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>`,
    'curso': `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>`
  };
  return icons[tipo] || '';
}

function formatPeriod(startDate, endDate, ongoing) {
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
// DADOS MOCKADOS (para teste sem Firebase)
// ============================================

function getMockData() {
  return [
    {
      id: '1',
      tipo: 'formacao',
      titulo: 'Análise e Desenvolvimento de Sistemas',
      instituicao: 'Centro Universitário de João Pessoa (UNIPÊ)',
      dataInicio: new Date('2023-02-01'),
      dataFim: null,
      emAndamento: true,
      descricao: 'Curso focado em desenvolvimento de software, banco de dados, engenharia de software e gestão de projetos de TI.',
      atividades: [],
      visivel: true
    },
    {
      id: '2',
      tipo: 'experiencia',
      titulo: 'Supervisor de Condomínio',
      instituicao: 'Condomínio Residencial Reserva do Atlântico',
      dataInicio: new Date('2022-11-01'),
      dataFim: null,
      emAndamento: true,
      descricao: 'Gestão administrativa e operacional completa do condomínio.',
      atividades: [
        'Gestão de equipe de colaboradores e prestadores de serviços',
        'Atendimento multicanal aos proprietários (presencial, telefone e WhatsApp)',
        'Elaboração de relatórios gerenciais e controle via planilhas Excel',
        'Gestão de fornecedores, cotações e contratos',
        'Organização de assembleias e apoio ao conselho gestor'
      ],
      visivel: true
    },
    {
      id: '3',
      tipo: 'experiencia',
      titulo: 'Auxiliar Contábil',
      instituicao: 'Conforte Administração de Condomínios',
      dataInicio: new Date('2020-10-01'),
      dataFim: new Date('2022-09-01'),
      emAndamento: false,
      descricao: 'Atuação multifuncional em contabilidade, cobrança e atendimento.',
      atividades: [
        'Geração e gestão de boletos de taxas condominiais',
        'Lançamento de despesas e conciliação bancária',
        'Elaboração de livros de prestação de contas',
        'Suporte em admissão e rescisão de funcionários',
        'Atendimento aos clientes via telefone e WhatsApp'
      ],
      visivel: true
    },
    {
      id: '4',
      tipo: 'educacao',
      titulo: 'MBA em Perícia Contábil e Gestão Tributária',
      instituicao: 'UNIESP / IESP',
      dataInicio: new Date('2020-03-01'),
      dataFim: new Date('2021-11-01'),
      emAndamento: false,
      descricao: 'Especialização em análise contábil forense, planejamento tributário e gestão fiscal.',
      atividades: [],
      visivel: true
    },
    {
      id: '5',
      tipo: 'experiencia',
      titulo: 'Auxiliar Administrativo',
      instituicao: 'INITUS Consultores Associados',
      dataInicio: new Date('2017-06-01'),
      dataFim: new Date('2020-09-01'),
      emAndamento: false,
      descricao: 'Consultoria previdenciária para prefeituras municipais.',
      atividades: [
        'Elaboração de relatórios técnicos sobre situação previdenciária',
        'Acompanhamento de obrigações das prefeituras assessoradas',
        'Gestão de parcelamentos de dívidas previdenciárias',
        'Análise de documentação e legislação previdenciária'
      ],
      visivel: true
    },
    {
      id: '6',
      tipo: 'formacao',
      titulo: 'Bacharel em Ciências Contábeis',
      instituicao: 'Universidade Federal da Paraíba (UFPB)',
      dataInicio: new Date('2012-03-01'),
      dataFim: new Date('2016-09-01'),
      emAndamento: false,
      descricao: 'Formação em contabilidade, finanças e gestão empresarial. Registro CRC-PB 012506/O-2.',
      atividades: [],
      visivel: true
    },
    {
      id: '7',
      tipo: 'experiencia',
      titulo: 'Analista de Crédito',
      instituicao: 'Banco Cidadão - Prefeitura Municipal de João Pessoa',
      dataInicio: new Date('2014-04-01'),
      dataFim: new Date('2015-12-01'),
      emAndamento: false,
      descricao: 'Programa de microcrédito da Prefeitura Municipal.',
      atividades: [
        'Atendimento aos beneficiários do programa',
        'Análise técnica de crédito e viabilidade de negócios',
        'Elaboração de planilhas de acompanhamento',
        'Geração de relatórios semanais de performance'
      ],
      visivel: true
    },
    {
      id: '8',
      tipo: 'formacao',
      titulo: 'Bacharel em Arquivologia',
      instituicao: 'Universidade Estadual da Paraíba (UEPB)',
      dataInicio: new Date('2008-03-01'),
      dataFim: new Date('2014-07-01'),
      emAndamento: false,
      descricao: 'Formação em gestão documental e organização de informações. Registro MTE como Arquivista.',
      atividades: [],
      visivel: true
    }
  ];
}

// ============================================
// THROTTLE UTILITY
// ============================================

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

console.log('✅ Curriculo.js carregado');