# 💼 Portfólio Profissional - Natan Dias

Portfólio pessoal desenvolvido para apresentar minha transição de carreira da área administrativa para tecnologia, destacando projetos, experiências e competências.

## 🚀 Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna (Grid, Flexbox, Custom Properties)
- **JavaScript (Vanilla)** - Interatividade e animações

### Backend / Database
- **Firebase Authentication** - Sistema de login do painel admin
- **Firebase Firestore** - Banco de dados NoSQL em tempo real
- **Firebase Storage** - Armazenamento de imagens e documentos

### Deploy & Versionamento
- **GitHub** - Versionamento de código
- **Netlify** - Hospedagem e CI/CD automático

## 📂 Estrutura do Projeto

```
portfolio-natan/
├── index.html              # Landing page
├── curriculo.html          # Timeline (formação + experiências)
├── projetos.html           # Portfólio de projetos
├── competencias.html       # Skills técnicas e administrativas
├── contato.html            # Formulário de contato
├── admin.html              # Painel administrativo
│
├── css/
│   ├── reset.css           # Normalização CSS
│   ├── variables.css       # Variáveis globais
│   ├── global.css          # Estilos globais
│   ├── navbar.css          # Menu de navegação
│   ├── footer.css          # Rodapé
│   ├── responsive.css      # Media queries
│   ├── pages/              # Estilos específicos por página
│   └── components/         # Componentes reutilizáveis
│
├── js/
│   ├── firebase-config.js  # Configuração Firebase
│   ├── navbar.js           # Lógica do menu
│   ├── animations.js       # Animações ao scroll
│   ├── utils.js            # Funções utilitárias
│   ├── pages/              # Scripts específicos por página
│   └── services/           # Serviços (auth, database)
│
└── assets/
    ├── images/             # Imagens do site
    └── documents/          # PDF do currículo
```

## 🔥 Estrutura do Firebase

### Collections Firestore

#### `timeline`
```javascript
{
  tipo: "formacao" | "experiencia" | "curso",
  titulo: String,
  instituicao: String,
  cargo: String (opcional),
  dataInicio: Timestamp,
  dataFim: Timestamp (opcional),
  emAndamento: Boolean,
  descricao: String,
  atividades: Array<String>,
  logoUrl: String,
  linkInstituicao: String,
  ordem: Number,
  visivel: Boolean
}
```

#### `projetos`
```javascript
{
  titulo: String,
  descricao: String,
  descricaoCompleta: String,
  tecnologias: Array<String>,
  funcionalidades: Array<String>,
  imagemUrl: String,
  demoUrl: String,
  githubUrl: String,
  destaque: Boolean,
  ordem: Number,
  visivel: Boolean
}
```

#### `configuracoes`
```javascript
{
  headline: String,
  intro: String,
  sobreMim: String,
  fotoPerfil: String,
  curriculo: String,
  contatoEmail: String,
  contatoWhatsapp: String,
  linkedinUrl: String,
  githubUrl: String
}
```

## 🛠️ Como Executar Localmente

### Pré-requisitos
- Laragon ou XAMPP instalado
- Navegador moderno
- Conta Firebase (gratuita)

### Passo a passo

1. **Clone o repositório**
```bash
git clone https://github.com/SEU-USUARIO/portfolio-natan.git
cd portfolio-natan
```

2. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com)
   - Ative Authentication, Firestore e Storage
   - Copie as credenciais para `js/firebase-config.js`

3. **Inicie o servidor local**
   - Abra o Laragon
   - Acesse: `http://portfolio-natan.test` ou `http://localhost/portfolio-natan`

4. **Crie o primeiro usuário admin**
   - Acesse `admin.html`
   - Registre-se com seu email
   - Adicione manualmente na collection `admin_users` do Firestore

## 🌐 Deploy no Netlify

1. **Push para GitHub**
```bash
git add .
git commit -m "Deploy inicial"
git push origin main
```

2. **Conecte no Netlify**
   - Acesse [Netlify](https://netlify.com)
   - "New site from Git"
   - Selecione o repositório
   - Deploy automático!

## 🎨 Funcionalidades

### Visitantes
- ✅ Visualizar portfólio completo
- ✅ Navegar pela timeline de experiências
- ✅ Ver projetos com detalhes técnicos
- ✅ Download do currículo em PDF
- ✅ Entrar em contato via formulário

### Admin (autenticado)
- ✅ Adicionar/editar/excluir itens da timeline
- ✅ Gerenciar projetos do portfólio
- ✅ Atualizar textos do site
- ✅ Upload de imagens e documentos
- ✅ Reordenar itens (drag & drop)

## 📱 Responsividade

- ✅ Mobile First
- ✅ Breakpoints: 640px, 768px, 1024px, 1280px
- ✅ Menu hamburguer no mobile
- ✅ Imagens otimizadas para cada dispositivo

## 🔐 Segurança

- ✅ Firebase Security Rules configuradas
- ✅ Autenticação obrigatória para admin
- ✅ Validação de inputs
- ✅ Proteção contra XSS
- ✅ HTTPS obrigatório (Netlify)

## 📈 Performance

- ✅ Lazy loading de imagens
- ✅ CSS minificado em produção
- ✅ Animações otimizadas (GPU)
- ✅ Requisições assíncronas ao Firestore

## 🎯 Próximas Funcionalidades

- [ ] Modo claro/escuro
- [ ] Internacionalização (PT/EN)
- [ ] Blog integrado
- [ ] Analytics de visitantes
- [ ] Sistema de mensagens via Firebase
- [ ] Migração para PHP + MySQL (Fase 2)

## 👤 Autor

**Natan Dias do Nascimento**
- Email: natan.said@gmail.com
- LinkedIn: [linkedin.com/in/natan-dias-283765190](https://linkedin.com/in/natan-dias-283765190)
- GitHub: [github.com/SEU-USUARIO](https://github.com/SEU-USUARIO)
- WhatsApp: (83) 9 9956-1500

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

---

⭐ Se este projeto te ajudou, deixe uma estrela no GitHub!

**Desenvolvido com 💙 por Natan Dias**