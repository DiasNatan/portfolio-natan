/**
 * firebase-config.js
 * Configuração e inicialização do Firebase
 * 
 * IMPORTANTE: Após criar seu projeto no Firebase Console:
 * 1. Vá em Project Settings > General
 * 2. Role até "Your apps" e clique em "Web app" (</>)
 * 3. Copie o objeto firebaseConfig e cole abaixo
 */

// Importar SDKs do Firebase (via CDN - adicionar no HTML)
// <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-storage-compat.js"></script>

// Configuração do Firebase
// Suas credenciais do Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyByUss5zEkl92T1PzI4Bj2xSLuQXSFdAbg",
  authDomain: "portfolio-natan.firebaseapp.com",
  projectId: "portfolio-natan",
  storageBucket: "portfolio-natan.firebasestorage.app",
  messagingSenderId: "195265705480",
  appId: "1:195265705480:web:4f1d9876be0b13da5243bd",
  measurementId: "G-EXKZ6YBD11"
};

// Inicializar Firebase
let app;
let auth;
let db;
let storage;

try {
  // Inicializar Firebase App
  app = firebase.initializeApp(firebaseConfig);
  
  // Inicializar serviços
  auth = firebase.auth();
  db = firebase.firestore();
  storage = firebase.storage();
  
  console.log('✅ Firebase inicializado com sucesso!');
  
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase:', error);
}

// Configurações do Firestore
db.settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

// Habilitar persistência offline
db.enablePersistence()
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('⚠️ Persistência não habilitada: múltiplas abas abertas');
    } else if (err.code === 'unimplemented') {
      console.warn('⚠️ Persistência não suportada neste navegador');
    }
  });

// Exportar para uso global
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseStorage = storage;

/**
 * EXEMPLO DE USO:
 * 
 * // Buscar dados da timeline
 * const timeline = await db.collection('timeline')
 *   .where('visivel', '==', true)
 *   .orderBy('dataInicio', 'desc')
 *   .get();
 * 
 * // Adicionar novo item
 * await db.collection('timeline').add({
 *   tipo: 'experiencia',
 *   titulo: 'Supervisor',
 *   // ... outros campos
 * });
 * 
 * // Autenticação
 * await auth.signInWithEmailAndPassword(email, password);
 * 
 * // Upload de arquivo
 * const ref = storage.ref('images/profile.jpg');
 * await ref.put(file);
 * const url = await ref.getDownloadURL();
 */