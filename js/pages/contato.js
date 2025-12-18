
// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initContatoPage();
});

function initContatoPage() {
  // Inicializar animações
  initScrollAnimations();
  
  // Inicializar formulário
  initContactForm();
  
  console.log('✅ Página de contato inicializada');
}

// ============================================
// FORMULÁRIO DE CONTATO
// ============================================

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', handleFormSubmit);
  
  // Máscaras de input
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', formatPhoneInput);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitButton = form.querySelector('.form-submit');
  const messageElement = document.getElementById('form-message');
  
  // Obter dados do formulário
  const formData = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    subject: form.subject.value,
    message: form.message.value,
    timestamp: new Date().toISOString()
  };
  
  // Validar campos
  if (!validateForm(formData)) {
    showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
    return;
  }
  
  // Desabilitar botão durante envio
  submitButton.disabled = true;
  submitButton.innerHTML = `
    <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
    </svg>
    Enviando...
  `;
  
  try {
    // Aqui você pode integrar com um backend ou serviço de email
    // Por enquanto, vamos simular o envio
    await simulateFormSubmission(formData);
    
    // Sucesso
    showMessage('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
    form.reset();
    
    // Log para console (em produção, enviar para backend)
    console.log('📧 Formulário enviado:', formData);
    
  } catch (error) {
    console.error('Erro ao enviar formulário:', error);
    showMessage('Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato diretamente via WhatsApp ou Email.', 'error');
  } finally {
    // Restaurar botão
    submitButton.disabled = false;
    submitButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
      Enviar Mensagem
    `;
  }
}

// ============================================
// VALIDAÇÃO
// ============================================

function validateForm(data) {
  // Validar campos obrigatórios
  if (!data.name || data.name.trim().length < 3) {
    return false;
  }
  
  if (!data.email || !validateEmail(data.email)) {
    return false;
  }
  
  if (!data.subject) {
    return false;
  }
  
  if (!data.message || data.message.trim().length < 10) {
    return false;
  }
  
  return true;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ============================================
// MÁSCARAS DE INPUT
// ============================================

function formatPhoneInput(e) {
  let value = e.target.value.replace(/\D/g, '');
  
  // Limitar a 11 dígitos
  value = value.substring(0, 11);
  
  // Aplicar máscara
  if (value.length <= 10) {
    // Formato: (00) 0000-0000
    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
  } else {
    // Formato: (00) 0 0000-0000
    value = value.replace(/^(\d{2})(\d{1})(\d{4})(\d{0,4}).*/, '($1) $2 $3-$4');
  }
  
  e.target.value = value;
}

// ============================================
// MENSAGENS
// ============================================

function showMessage(message, type) {
  const messageElement = document.getElementById('form-message');
  if (!messageElement) return;
  
  messageElement.textContent = message;
  messageElement.className = `form-message ${type}`;
  messageElement.style.display = 'block';
  
  // Rolar até a mensagem
  messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Esconder após 10 segundos
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 10000);
}

// ============================================
// SIMULAÇÃO DE ENVIO
// ============================================

function simulateFormSubmission(data) {
  return new Promise((resolve, reject) => {
    // Simular delay de rede
    setTimeout(() => {
      // Sucesso (em produção, enviar para backend real)
      resolve(data);
      
      // Para realmente enviar, você pode usar:
      // - EmailJS (https://www.emailjs.com/)
      // - Formspree (https://formspree.io/)
      // - Seu próprio backend
      // - Firebase Functions
      
    }, 2000);
  });
}

// ============================================
// INTEGRAÇÃO COM EMAILJS (OPCIONAL)
// ============================================

/*
// Descomente e configure se quiser usar EmailJS

async function sendEmailViaEmailJS(data) {
  // 1. Criar conta em https://www.emailjs.com/
  // 2. Obter Service ID, Template ID e Public Key
  // 3. Adicionar script no HTML: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
  // 4. Inicializar: emailjs.init('YOUR_PUBLIC_KEY')
  
  try {
    const response = await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message
      }
    );
    
    return response;
  } catch (error) {
    throw error;
  }
}
*/

// ============================================
// ANALYTICS (OPCIONAL)
// ============================================

function trackFormSubmission(subject) {
  // Se você tiver Google Analytics ou similar
  if (typeof gtag !== 'undefined') {
    gtag('event', 'form_submission', {
      'event_category': 'Contact',
      'event_label': subject
    });
  }
  
  console.log('📊 Form submission tracked:', subject);
}

console.log('✅ Contato.js carregado');