// ============================================
// VARIÁVEIS GLOBAIS
// ============================================

let projectsData = [];
let currentTech = 'todas';

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initProjectsPage();
});

async function initProjectsPage() {
  // Inicializar animações
  initScrollAnimations();
  
  // Carregar projetos
  await loadProjects();
  
  // Inicializar filtros
  initTechFilters();
  
  console.log('✅ Página de projetos inicializada');
}

// ============================================
// CARREGAR PROJETOS DO FIREBASE
// ============================================

async function loadProjects() {
  const loadingElement = document.getElementById('projects-loading');
  const gridElement = document.getElementById('projects-grid');
  const emptyElement = document.getElementById('projects-empty');
  
  try {
    // Verificar se Firebase está disponível
    if (!window.firebaseDb) {
      console.warn('⚠️ Firebase não disponível, usando dados mockados');
      projectsData = getMockProjects();
      renderProjects();
      return;
    }
    
    // Buscar dados do Firestore
    const snapshot = await window.firebaseDb
      .collection('projetos')
      .where('visivel', '==', true)
      .orderBy('ordem', 'asc')
      .get();
    
    if (snapshot.empty) {
      console.log('ℹ️ Nenhum projeto no Firestore, usando dados mockados');
      projectsData = getMockProjects();
    } else {
      projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`✅ ${projectsData.length} projetos carregados do Firebase`);
    }
    
    // Renderizar projetos
    renderProjects();
    
  } catch (error) {
    console.error('❌ Erro ao carregar projetos:', error);
    projectsData = getMockProjects();
    renderProjects();
  }
}

// ============================================
// RENDERIZAR PROJETOS
// ============================================

function renderProjects(techFilter = 'todas') {
  const gridElement = document.getElementById('projects-grid');
  const loadingElement = document.getElementById('projects-loading');
  const emptyElement = document.getElementById('projects-empty');
  
  // Esconder loading
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
  
  // Filtrar por tecnologia
  let filteredProjects = projectsData;
  if (techFilter !== 'todas') {
    filteredProjects = projectsData.filter(project => 
      project.tecnologias.includes(techFilter)
    );
  }
  
  // Verificar se há projetos
  if (filteredProjects.length === 0) {
    gridElement.innerHTML = '';
    emptyElement.style.display = 'block';
    return;
  }
  
  emptyElement.style.display = 'none';
  
  // Renderizar cards
  gridElement.innerHTML = filteredProjects.map(project => `
    <div class="project-card" onclick="openProjectModal('${project.id}')">
      <div class="project-image">
        ${project.imagemUrl ? 
          `<img src="${project.imagemUrl}" alt="${project.titulo}">` : 
          `<div class="project-image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>`
        }
        ${project.destaque ? '<span class="project-featured-badge">Destaque</span>' : ''}
      </div>
      
      <div class="project-content">
        <h3 class="project-title">${project.titulo}</h3>
        <p class="project-description">${project.descricao}</p>
        
        <div class="project-tech">
          ${project.tecnologias.slice(0, 3).map(tech => 
            `<span class="project-tech-tag">${tech}</span>`
          ).join('')}
          ${project.tecnologias.length > 3 ? 
            `<span class="project-tech-tag">+${project.tecnologias.length - 3}</span>` : ''
          }
        </div>
        
        <div class="project-footer">
          <div class="project-links">
            ${project.githubUrl ? `
              <a href="${project.githubUrl}" 
                 class="project-link" 
                 title="Ver no GitHub"
                 onclick="event.stopPropagation()"
                 target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            ` : ''}
            ${project.demoUrl ? `
              <a href="${project.demoUrl}" 
                 class="project-link" 
                 title="Ver Demo"
                 onclick="event.stopPropagation()"
                 target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            ` : ''}
          </div>
          
          <button class="project-view-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ============================================
// FILTROS DE TECNOLOGIA
// ============================================

function initTechFilters() {
  const filterButtons = document.querySelectorAll('.tech-filter-btn');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tech = btn.getAttribute('data-tech');
      
      // Atualizar botão ativo
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Aplicar filtro
      currentTech = tech;
      renderProjects(tech);
    });
  });
}

// ============================================
// MODAL DO PROJETO
// ============================================

function openProjectModal(projectId) {
  const project = projectsData.find(p => p.id === projectId);
  if (!project) return;
  
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  
  // Preencher modal
  modalBody.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">${project.titulo}</h2>
      <p class="modal-subtitle">${project.descricao}</p>
    </div>
    
    ${project.imagemUrl ? `
      <div class="modal-image">
        <img src="${project.imagemUrl}" alt="${project.titulo}">
      </div>
    ` : `
      <div class="modal-image">
        <div class="modal-image-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
      </div>
    `}
    
    <div class="modal-section">
      <h3 class="modal-section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        Sobre o Projeto
      </h3>
      <p class="modal-description">${project.descricaoCompleta || project.descricao}</p>
    </div>
    
    <div class="modal-section">
      <h3 class="modal-section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
        Tecnologias Utilizadas
      </h3>
      <div class="modal-tech-tags">
        ${project.tecnologias.map(tech => 
          `<span class="modal-tech-tag">${tech}</span>`
        ).join('')}
      </div>
    </div>
    
    ${project.funcionalidades && project.funcionalidades.length > 0 ? `
      <div class="modal-section">
        <h3 class="modal-section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Principais Funcionalidades
        </h3>
        <ul class="modal-features">
          ${project.funcionalidades.map(feat => `<li>${feat}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    <div class="modal-actions">
      ${project.demoUrl ? `
        <a href="${project.demoUrl}" target="_blank" class="modal-btn modal-btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          Ver Demo ao Vivo
        </a>
      ` : ''}
      ${project.githubUrl ? `
        <a href="${project.githubUrl}" target="_blank" class="modal-btn modal-btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Ver no GitHub
        </a>
      ` : ''}
    </div>
  `;
  
  // Mostrar modal
  modal.classList.add('active');
  document.body.classList.add('modal-open');
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  modal.classList.remove('active');
  document.body.classList.remove('modal-open');
}

// Fechar modal ao pressionar ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProjectModal();
  }
});

// ============================================
// DADOS MOCKADOS
// ============================================

function getMockProjects() {
  return [
    {
      id: '1',
      titulo: 'CineHub - Portal de Cinema',
      descricao: 'Plataforma completa para descoberta de filmes e séries com interface moderna e intuitiva.',
      descricaoCompleta: 'CineHub é uma aplicação web desenvolvida para cinéfilos e entusiastas de séries. O projeto demonstra minha capacidade de criar interfaces atraentes e funcionais, integrando APIs externas para buscar informações atualizadas sobre filmes, séries, trailers e avaliações.\n\nO sistema permite aos usuários pesquisar títulos, visualizar detalhes completos, assistir trailers e salvar favoritos. A interface responsiva garante uma experiência consistente em qualquer dispositivo.',
      tecnologias: ['HTML5', 'CSS3', 'JavaScript', 'API REST'],
      funcionalidades: [
        'Busca de filmes e séries em tempo real',
        'Integração com API externa de cinema',
        'Sistema de favoritos persistente',
        'Visualização de trailers incorporados',
        'Design totalmente responsivo'
      ],
      imagemUrl: '',
      demoUrl: '#',
      githubUrl: 'https://github.com/DiasNatan',
      destaque: true,
      ordem: 1,
      visivel: true
    },
    {
      id: '2',
      titulo: 'EngProject - Gestão de Projetos',
      descricao: 'Sistema completo para gerenciamento de projetos de engenharia com controle de tarefas e equipes.',
      descricaoCompleta: 'EngProject é uma aplicação desenvolvida para facilitar a gestão de projetos de engenharia civil. O sistema permite o cadastro de projetos, controle de etapas, gerenciamento de equipes e acompanhamento de prazos.\n\nCom autenticação segura, diferentes níveis de acesso e dashboard intuitivo, o EngProject demonstra minha capacidade de desenvolver soluções completas que atendem necessidades reais de negócio.',
      tecnologias: ['Python', 'Flask', 'MySQL', 'Bootstrap', 'JavaScript'],
      funcionalidades: [
        'Sistema de login e autenticação segura',
        'Cadastro de projetos e etapas',
        'Gerenciamento de equipes e permissões',
        'Dashboard com indicadores visuais',
        'Geração de relatórios em PDF'
      ],
      imagemUrl: '',
      demoUrl: '#',
      githubUrl: 'https://github.com/DiasNatan',
      destaque: true,
      ordem: 2,
      visivel: true
    },
    {
      id: '3',
      titulo: 'PartyTime - Site de Aniversário',
      descricao: 'Site temático e interativo para convite e organização de festa de aniversário.',
      descricaoCompleta: 'PartyTime foi desenvolvido como um convite digital interativo e sistema de confirmação de presença para uma festa de aniversário. O projeto demonstra criatividade no design e capacidade de criar experiências envolventes.\n\nO site conta com animações suaves, formulário de confirmação integrado ao banco de dados, galeria de fotos e informações sobre o evento.',
      tecnologias: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL'],
      funcionalidades: [
        'Design temático personalizado',
        'Formulário de confirmação de presença',
        'Galeria de fotos animada',
        'Contador regressivo para o evento',
        'Animações e efeitos interativos'
      ],
      imagemUrl: '',
      demoUrl: '#',
      githubUrl: 'https://github.com/DiasNatan',
      destaque: false,
      ordem: 3,
      visivel: true
    },
    {
      id: '4',
      titulo: 'SecretFriend - Amigo Secreto Digital',
      descricao: 'Aplicação web para organizar e sortear amigo secreto de forma automatizada e segura.',
      descricaoCompleta: 'SecretFriend é uma solução completa para organizar amigo secreto online. O sistema permite que o organizador cadastre participantes, defina valor do presente e realize o sorteio automático.\n\nCada participante recebe um link exclusivo para descobrir quem tirou, sem que o organizador tenha acesso. O projeto demonstra lógica de programação e preocupação com privacidade.',
      tecnologias: ['JavaScript', 'Node.js', 'Express', 'MongoDB'],
      funcionalidades: [
        'Cadastro de participantes',
        'Sorteio automático inteligente',
        'Links individuais seguros',
        'Sistema de notificações por email',
        'Histórico de sorteios realizados'
      ],
      imagemUrl: '',
      demoUrl: '#',
      githubUrl: 'https://github.com/DiasNatan',
      destaque: false,
      ordem: 4,
      visivel: true
    },
    {
      id: '5',
      titulo: 'TaskFlow - Gerenciador de Tarefas',
      descricao: 'Sistema pessoal de gerenciamento de tarefas com categorias e controle de produtividade.',
      descricaoCompleta: 'TaskFlow é um gerenciador de tarefas desenvolvido para aumentar a produtividade pessoal e profissional. A aplicação permite criar tarefas, organizá-las por categorias, definir prazos e acompanhar o progresso através de dashboards visuais.\n\nCom sistema de login individual, cada usuário tem seu próprio espaço para gerenciar atividades.',
      tecnologias: ['React', 'Node.js', 'PostgreSQL', 'JWT', 'Chart.js'],
      funcionalidades: [
        'Autenticação com JWT',
        'CRUD completo de tarefas',
        'Categorização e tags',
        'Dashboard visual com gráficos',
        'Filtros e buscas avançadas'
      ],
      imagemUrl: '',
      demoUrl: '#',
      githubUrl: 'https://github.com/DiasNatan',
      destaque: false,
      ordem: 5,
      visivel: true
    }
  ];
}

console.log('✅ Projetos.js carregado');