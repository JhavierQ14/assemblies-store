import { sendOtp, verifyOtp, resendOtp } from '../../../services/auth/otpService.js';
import { saveTokens, saveUserProfile } from '../../../js/auth-storage.js';

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.otp-form');
  const resendLink = document.getElementById('resendLink');
  const urlParams = new URLSearchParams(window.location.search);
  const emailFromQuery = urlParams.get('email') || '';
  const emailInput = form.querySelector('input[name="email"]');
  const otpInputs = Array.from(form.querySelectorAll('.otp-input'));
  const timerElement = document.getElementById('timer');
  const OTP_AUTO_SEND_TTL = 5 * 60 * 1000; // 5 minutes
  let timerInterval;

  // Timer functionality
  function startTimer(duration = 600) { // 10 minutes in seconds
    let timer = duration;
    
    timerInterval = setInterval(function () {
      const minutes = parseInt(timer / 60, 10);
      const seconds = parseInt(timer % 60, 10);
      
      const displayMinutes = minutes < 10 ? "0" + minutes : minutes;
      const displaySeconds = seconds < 10 ? "0" + seconds : seconds;
      
      if (timerElement) {
        timerElement.textContent = displayMinutes + ":" + displaySeconds;
      }
      
      if (--timer < 0) {
        clearInterval(timerInterval);
        if (timerElement) {
          timerElement.textContent = "00:00";
          timerElement.style.color = 'var(--error)';
        }
        showOtpAlert('El código ha expirado. Solicita uno nuevo.', 'warning');
      }
    }, 1000);
  }

  // Start timer when page loads
  if (emailFromQuery) {
    startTimer();
  }

  if (emailFromQuery) {
    emailInput.value = decodeURIComponent(emailFromQuery);
  }

  function markOtpSent(email) {
    try { sessionStorage.setItem(`otp_sent_${email}`, String(Date.now())); } catch (e) { }
  }
  function wasOtpAutoSentRecent(email) {
    try { const v = sessionStorage.getItem(`otp_sent_${email}`); if (!v) return false; return (Date.now() - Number(v)) < OTP_AUTO_SEND_TTL; } catch (e) { return false; }
  }

  if (otpInputs.length) otpInputs[0].focus();
  function getOtpValue() { return otpInputs.map(i => i.value.trim()).join(''); }

  otpInputs.forEach((input, idx) => {
    input.addEventListener('paste', function(e) {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
      const digits = paste.replace(/\D/g, '').slice(0, otpInputs.length);
      if (!digits) return;
      for (let i = 0; i < digits.length; i++) {
        const target = otpInputs[idx + i]; if (!target) break; target.value = digits[i];
      }
      const next = otpInputs.find(i => !i.value) || otpInputs[otpInputs.length - 1]; next.focus();
    });
    input.addEventListener('input', function(e) {
      const val = input.value || '';
      
      // Add visual feedback
      if (val) {
        input.classList.add('filled');
      } else {
        input.classList.remove('filled');
      }
      
      if (val.length > 1) {
        const digits = val.replace(/\D/g, '').slice(0, otpInputs.length - idx);
        for (let i = 0; i < digits.length; i++) { 
          const target = otpInputs[idx + i]; 
          if (!target) break; 
          target.value = digits[i];
          target.classList.add('filled');
        }
        const next = otpInputs.find(i => !i.value) || otpInputs[otpInputs.length - 1]; next.focus(); return;
      }
      if (val && idx < otpInputs.length - 1) { otpInputs[idx + 1].focus(); }
    });
    input.addEventListener('keydown', function(e) {
      const key = e.key;
      if (key === 'Backspace') { 
        if (!input.value && idx > 0) { 
          e.preventDefault(); 
          otpInputs[idx - 1].focus(); 
          otpInputs[idx - 1].value = ''; 
          otpInputs[idx - 1].classList.remove('filled');
        } else if (input.value) {
          input.classList.remove('filled');
        }
        return; 
      }
      if (key === 'ArrowLeft' && idx > 0) { e.preventDefault(); otpInputs[idx - 1].focus(); return; }
      if (key === 'ArrowRight' && idx < otpInputs.length - 1) { e.preventDefault(); otpInputs[idx + 1].focus(); return; }
      if (key.length === 1 && /\D/.test(key)) { e.preventDefault(); return; }
    });
  });

  async function doSendOtp(targetEmail) {
    try {
      const res = await sendOtp(targetEmail);
      if (res && res.code) { showOtpAlert(`Código enviado (dev): ${res.code}`, 'success'); } else { showOtpAlert('Código de verificación enviado.', 'success'); }
      markOtpSent(targetEmail);
    } catch (err) {
      showOtpAlert(err.message || 'Error al enviar código', 'error');
    }
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = form.elements['email'].value.trim();
    const otp = getOtpValue();
    if (!email && otp.length === 0) { showOtpAlert('No se encontró correo ni código. Regresa al registro o solicita el código.', 'error'); return; }
    if (!email) { showOtpAlert('Correo no disponible. Regresa al registro para solicitar un nuevo código.', 'error'); return; }
    if (otp.length !== otpInputs.length) { showOtpAlert('Introduce el código de 6 dígitos completo antes de verificar.', 'error'); return; }
    try {
      const result = await verifyOtp(email, otp);
      if (result && result.data && (result.data.tokens || result.data.access_token || result.data.refresh_token)) {
        try { const tokens = result.data.tokens || { access_token: result.data.access_token, refresh_token: result.data.refresh_token }; saveTokens(tokens); if (result.data.user) saveUserProfile(result.data.user); } catch (e) { console.warn('Could not persist auth state', e); }
        showOtpAlert('Cuenta verificada. Redirigiendo a inicio...', 'success');
  setTimeout(() => { window.location.href = '../login/login.html'; }, 800);
        return;
      }
      showOtpAlert('Cuenta verificada. Redirigiendo al login...', 'success');
  setTimeout(() => { window.location.href = '../login/login.html'; }, 1200);
    } catch (err) {
      showOtpAlert(err.message || 'Código inválido', 'error');
    }
  });

  const resendModal = document.getElementById('resendModal');
  const resendEmailInput = document.getElementById('resendEmail');
  const confirmResendBtn = document.getElementById('confirmResend');
  const cancelResendBtn = document.getElementById('cancelResend');
  const closeModalBtn = document.getElementById('closeModal');
  const changeEmailBtn = document.querySelector('.change-email-btn');
  const modalOverlay = resendModal?.querySelector('.modal-overlay');

  resendLink && resendLink.addEventListener('click', function(e) { e.preventDefault(); const currentEmail = emailInput.value.trim(); resendEmailInput.value = currentEmail || ''; resendModal.classList.remove('hidden'); resendEmailInput.focus(); });
  
  // Change email button functionality
  changeEmailBtn && changeEmailBtn.addEventListener('click', function(e) { 
    e.preventDefault(); 
    const currentEmail = emailInput.value.trim(); 
    resendEmailInput.value = currentEmail || ''; 
    resendModal.classList.remove('hidden'); 
    resendEmailInput.focus(); 
  });
  
  // Close modal events
  cancelResendBtn && cancelResendBtn.addEventListener('click', function(e) { e.preventDefault(); resendModal.classList.add('hidden'); });
  closeModalBtn && closeModalBtn.addEventListener('click', function(e) { e.preventDefault(); resendModal.classList.add('hidden'); });
  modalOverlay && modalOverlay.addEventListener('click', function(e) { e.preventDefault(); resendModal.classList.add('hidden'); });
  
  confirmResendBtn && confirmResendBtn.addEventListener('click', async function(e) {
    e.preventDefault(); const email = (resendEmailInput.value || '').trim(); if (!email) return showOtpAlert('Introduce un correo válido.', 'error');
    try {
      const res = await resendOtp(email);
      if (res && res.code) showOtpAlert(`OTP reenviado (dev): ${res.code}`, 'success'); else showOtpAlert('OTP reenviado correctamente', 'success');
      resendModal.classList.add('hidden'); 
      try { 
        emailInput.value = email; 
        otpInputs.forEach(i => {
          i.value = '';
          i.classList.remove('filled');
        }); 
        if (otpInputs.length) otpInputs[0].focus(); 
        
        // Restart timer
        if (timerInterval) clearInterval(timerInterval);
        if (timerElement) timerElement.style.color = '';
        startTimer();
      } catch (e) {}
      markOtpSent(email);
  setTimeout(() => { window.location.href = `../verify_otp/verify_otp.html?email=${encodeURIComponent(email)}`; }, 900);
    } catch (err) { showOtpAlert(err.message || 'Error reenviando OTP', 'error'); }
  });

  if (emailFromQuery && !wasOtpAutoSentRecent(decodeURIComponent(emailFromQuery))) { doSendOtp(decodeURIComponent(emailFromQuery)); }
});

function showOtpAlert(msg, type) {
  let alertDiv = document.createElement('div');
  alertDiv.className = 'login-alert ' + type;
  alertDiv.textContent = msg;
  document.body.appendChild(alertDiv);
  setTimeout(() => { alertDiv.classList.add('show'); }, 10);
  setTimeout(() => { alertDiv.classList.remove('show'); setTimeout(() => alertDiv.remove(), 400); }, 1800);
}
