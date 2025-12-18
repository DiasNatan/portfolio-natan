// ============================================
// VARIÁVEIS GLOBAIS
// ============================================

let currentUser = null;
let timelineData = [];
let projectsData = [];

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initAdminPanel();
});

function initAdminPanel() {
  // Verificar autenticação
  checkAuth();
  
  // Inicializar listeners
  initLoginForm();
  initNavigation();
  initLogout();
  
  console.log('✅ Painel admin inicializado');
}

// ============================================
// AUTENTICAÇÃO
// ============================================

function checkAuth() {
  if (!window.firebaseAuth) {
    console.error('❌ Firebase Auth não disponível');
    return;
  }
  
  // Observar mudanças de autenticação
  window.firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      currentUser = user;
      showDashboard();
      loadDashboardData();
    } else {
      currentUser = null;
      showLoginScreen();
    }
  });
}

function showLoginScreen() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('admin-dashboard').style.display = 'none';
}

function showDashboard() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-dashboard').style.display = 'grid';
  
  // Atualizar informações do usuário
  if (currentUser) {
    document.getElementById('user-name').textContent = currentUser.displayName || 'Admin';
    document.getElementById('user-email').textContent = currentUser.email;
  }
}

function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error');
    const submitButton = form.querySelector('.btn-login');
    
    // Desabilitar botão
    submitButton.disabled = true;
    submitButton.innerHTML = '<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Entrando...';
    errorElement.style.display = 'none';
    
    try {
      await window.firebaseAuth.signInWithEmailAndPassword(email, password);
      // Sucesso - o onAuthStateChanged cuidará do resto
    } catch (error) {
      console.error('Erro no login:', error);
      let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.';
      }
      
      errorElement.textContent = errorMessage;
      errorElement.style.display = 'block';
      
      // Restaurar botão
      submitButton.disabled = false;
      submitButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          <polyline points="10 17 15 12 10 7"></polyline>
          <line x1="15" y1="12" x2="3" y2="12"></line>
        </svg>
        Entrar
      `;
    }
  });
}

function initLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (!logoutBtn) return;
  
  logoutBtn.addEventListener('click', async () => {
    try {
      await window.firebaseAuth.signOut();
      console.log('✅ Logout realizado');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  });
}

// ============================================
// NAVEGAÇÃO ENTRE SEÇÕES
// ============================================

function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const section = item.getAttribute('data-section');
      switchSection(section);
      
      // Atualizar item ativo
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

function switchSection(sectionName) {
  // Esconder todas as seções
  document.querySelectorAll('.admin-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Mostrar seção selecionada
  const targetSection = document.getElementById(`section-${sectionName}`);
  if (targetSection) {
    targetSection.classList.add('active');
    
    // Carregar dados da seção se necessário
    if (sectionName === 'timeline' && timelineData.length === 0) {
      loadTimelineData();
    } else if (sectionName === 'projects' && projectsData.length === 0) {
      loadProjectsData();
    }
  }
}

// ============================================
// CARREGAR DADOS DO DASHBOARD
// ============================================

async function loadDashboardData() {
  try {
    // Carregar estatísticas
    const timelineSnapshot = await window.firebaseDb.collection('timeline').get();
    const projectsSnapshot = await window.firebaseDb.collection('projetos').get();
    
    document.getElementById('stat-timeline').textContent = timelineSnapshot.size;
    document.getElementById('stat-projects').textContent = projectsSnapshot.size;
    document.getElementById('stat-last-update').textContent = 'Hoje';
    
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
  }
}

// ============================================
// GERENCIAR TIMELINE
// ============================================

async function loadTimelineData() {
  const listElement = document.getElementById('timeline-list');
  listElement.innerHTML = '<div class="loading">Carregando timeline...</div>';
  
  try {
    const snapshot = await window.firebaseDb
      .collection('timeline')
      .orderBy('dataInicio', 'desc')
      .get();
    
    timelineData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    renderTimelineList();
    
  } catch (error) {
    console.error('Erro ao carregar timeline:', error);
    listElement.innerHTML = '<div class="loading">Erro ao carregar dados</div>';
  }
}

function renderTimelineList() {
  const listElement = document.getElementById('timeline-list');
  
  if (timelineData.length === 0) {
    listElement.innerHTML = '<div class="loading">Nenhum item cadastrado</div>';
    return;
  }
  
  listElement.innerHTML = timelineData.map(item => `
    <div class="item-card">
      <h3>${item.titulo}</h3>
      <p>${item.instituicao}</p>
      <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
        <button class="btn-secondary" onclick="editTimelineItem('${item.id}')">Editar</button>
        <button class="btn-secondary" onclick="deleteTimelineItem('${item.id}')">Excluir</button>
      </div>
    </div>
  `).join('');
}

function showTimelineForm() {
  const formContainer = document.getElementById('timeline-form');
  formContainer.style.display = 'block';
  formContainer.scrollIntoView({ behavior: 'smooth' });
}

async function deleteTimelineItem(id) {
  if (!confirm('Tem certeza que deseja excluir este item?')) return;
  
  try {
    await window.firebaseDb.collection('timeline').doc(id).delete();
    await loadTimelineData();
    alert('Item excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir:', error);
    alert('Erro ao excluir item');
  }
}

// ============================================
// GERENCIAR PROJETOS
// ============================================

async function loadProjectsData() {
  const listElement = document.getElementById('projects-list');
  listElement.innerHTML = '<div class="loading">Carregando projetos...</div>';
  
  try {
    const snapshot = await window.firebaseDb
      .collection('projetos')
      .orderBy('ordem', 'asc')
      .get();
    
    projectsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    renderProjectsList();
    
  } catch (error) {
    console.error('Erro ao carregar projetos:', error);
    listElement.innerHTML = '<div class="loading">Erro ao carregar dados</div>';
  }
}

function renderProjectsList() {
  const listElement = document.getElementById('projects-list');
  
  if (projectsData.length === 0) {
    listElement.innerHTML = '<div class="loading">Nenhum projeto cadastrado</div>';
    return;
  }
  
  listElement.innerHTML = projectsData.map(project => `
    <div class="item-card">
      <h3>${project.titulo}</h3>
      <p>${project.descricao}</p>
      <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
        <button class="btn-secondary" onclick="editProject('${project.id}')">Editar</button>
        <button class="btn-secondary" onclick="deleteProject('${project.id}')">Excluir</button>
      </div>
    </div>
  `).join('');
}

function showProjectForm() {
  const formContainer = document.getElementById('project-form');
  formContainer.style.display = 'block';
  formContainer.scrollIntoView({ behavior: 'smooth' });
}

async function deleteProject(id) {
  if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
  
  try {
    await window.firebaseDb.collection('projetos').doc(id).delete();
    await loadProjectsData();
    alert('Projeto excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir:', error);
    alert('Erro ao excluir projeto');
  }
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

// Expor funções globalmente para onclick
window.switchSection = switchSection;
window.showTimelineForm = showTimelineForm;
window.showProjectForm = showProjectForm;
window.deleteTimelineItem = deleteTimelineItem;
window.deleteProject = deleteProject;

console.log('✅ Admin.js carregado');

// ============================================
// INSTRUÇÕES DE USO
// ============================================

console.log(`
%c🔐 PAINEL ADMIN - INSTRUÇÕES

%c1. CRIAR PRIMEIRO USUÁRIO ADMIN:
   - Acesse o Firebase Console
   - Vá em Authentication
   - Adicione um usuário manualmente com seu email e senha

%c2. FAZER LOGIN:
   - Use o email e senha criados no Firebase

%c3. GERENCIAR CONTEÚDO:
   - Dashboard: visão geral
   - Timeline: adicionar/editar experiências
   - Projetos: gerenciar portfólio
   - Configurações: atualizar textos do site

%c4. NOTA IMPORTANTE:
   Este painel está usando Firebase.
   Para funcionalidades completas de formulários,
   você precisará implementar as funções de
   adicionar/editar no Firebase.
`, 
'color: #3b82f6; font-size: 16px; font-weight: bold',
'color: #10b981; font-weight: bold',
'color: #8b5cf6; font-weight: bold',
'color: #f59e0b; font-weight: bold',
'color: #ef4444; font-weight: bold'
);