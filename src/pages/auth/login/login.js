import signinService from '../../../services/auth/signinService.js';
import { saveTokens, saveUserProfile } from '../../../js/auth-storage.js';

// Reuse original login.js logic but adjust relative imports paths when necessary

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.login-form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = form.elements['email'].value.trim();
    const pass = form.elements['pass'].value;

    try {
      const raw = await signinService.signinApi({ email, password: pass });
      const payload = (raw && raw.data) ? raw.data : raw || {};
      const tokens = payload.tokens || (payload.access_token ? { access_token: payload.access_token, refresh_token: payload.refresh_token } : null);
      if (tokens) {
        saveTokens(tokens);
        const userObj = payload.user || payload.userProfile || payload.user_profile || payload;
        try { saveUserProfile(userObj); } catch (e) { console.warn('saveUserProfile failed', e); }
  showLoginAlert('¡Ingreso exitoso! Redirigiendo...', 'success');
  setTimeout(() => window.location.href = '../../home/home.html', 900);
        return;
      }
  showLoginAlert('Error de autenticación.', 'error');
    } catch (err) {
      console.error('login error', err);
      showLoginAlert(err?.body?.message || err?.message || 'Error en el inicio de sesión', 'error');
    }
  return;
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
