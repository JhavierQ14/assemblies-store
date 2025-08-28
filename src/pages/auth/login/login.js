import signinService from '../../../services/auth/signinService.js';
import { saveTokens, saveUserProfile } from '../../../js/auth-storage.js';

// Reuse original login.js logic but adjust relative imports paths when necessary

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.auth-form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = form.elements['email'].value.trim();
    const pass = form.elements['pass'].value;

    try {
      const raw = await signinService.signinApi({ email, password: pass });
      const payload = (raw && raw.data) ? raw.data : raw || {};
      const tokens = payload.tokens;
      if (tokens) {
        saveTokens(tokens);
        const userObj = payload.user;
        if (userObj) {
          // Asegurarse de guardar el perfil completo incluyendo la estructura anidada
          try { 
            saveUserProfile({
              email: userObj.email,
              role: userObj.role,
              ...userObj.perfil
            }); 
          } catch (e) { 
            console.warn('saveUserProfile failed', e); 
          }
        }
        // Guardar additionalData.totalItemCart en localStorage si viene
        try {
          const totalItems = payload.additionalData && (payload.additionalData.totalItemCart ?? null);
          if (totalItems != null) {
            localStorage.setItem('totalItemCart', String(totalItems));
            // notificar a otros scripts en la misma página (por si no hay redirección inmediata)
            window.dispatchEvent(new CustomEvent('cart:update', { detail: { total: totalItems } }));
          }
        } catch (e) {
          console.warn('failed to save totalItemCart', e);
        }
        showLoginAlert('¡Ingreso exitoso! Redirigiendo...', 'success');
        setTimeout(() => window.location.href = 'http://localhost:5173/', 900);
        return;
      }
  showLoginAlert('Error de autenticación.', 'error');
    } catch (err) {
      console.error('login error', err);
      showLoginAlert(err?.body?.message || err?.message || 'Error en el inicio de sesión', 'error');
    }
  return;
  });

  // Social login buttons (placeholder functionality)
  const socialButtons = document.querySelectorAll('.social-btn');
  socialButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const provider = this.classList.contains('google') ? 'Google' : 
                     this.classList.contains('facebook') ? 'Facebook' : 'Microsoft';
      showLoginAlert(`Función de ${provider} próximamente disponible`, 'warning');
    });
  });
});

function showLoginAlert(msg, type) {
  let alertDiv = document.createElement('div');
  alertDiv.className = 'login-alert ' + type;
  alertDiv.textContent = msg;
  document.body.appendChild(alertDiv);
  setTimeout(() => { alertDiv.classList.add('show'); }, 10);
  setTimeout(() => { alertDiv.classList.remove('show'); setTimeout(() => alertDiv.remove(), 400); }, 1500);
}
