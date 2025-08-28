import { signupApi } from '../../../services/auth/signupService.js';
import { saveTokens, saveUserProfile } from '../../../js/auth-storage.js';

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.auth-form');
  if (!form) return;

  const imageFileInput = document.getElementById('imageFile');
  const profilePreview = document.getElementById('profilePreview');
  const hiddenImageField = form.elements['imagePerfil'];
  const uploadBtn = document.getElementById('uploadBtn');
  if (imageFileInput && profilePreview && hiddenImageField) {
    const openPicker = () => imageFileInput.click();
    profilePreview.addEventListener('click', openPicker);
    profilePreview.addEventListener('keypress', function(e){ if (e.key === 'Enter' || e.key === ' ') openPicker(); });
    if (uploadBtn) uploadBtn.addEventListener('click', openPicker);

    imageFileInput.addEventListener('change', function() {
      const file = this.files && this.files[0];
      if (!file) {
        profilePreview.src = '../../../assets/images/user.png';
        hiddenImageField.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = function(evt) {
        profilePreview.src = evt.target.result;
        hiddenImageField.value = evt.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Password validation in real time
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const requirements = {
    length: document.getElementById('length'),
    uppercase: document.getElementById('uppercase'),
    lowercase: document.getElementById('lowercase'),
    number: document.getElementById('number')
  };

  function validatePasswordRequirements(password) {
    if (requirements.length) {
      if (password.length >= 8) {
        requirements.length.classList.add('valid');
      } else {
        requirements.length.classList.remove('valid');
      }
    }
    
    if (requirements.uppercase) {
      if (/[A-Z]/.test(password)) {
        requirements.uppercase.classList.add('valid');
      } else {
        requirements.uppercase.classList.remove('valid');
      }
    }
    
    if (requirements.lowercase) {
      if (/[a-z]/.test(password)) {
        requirements.lowercase.classList.add('valid');
      } else {
        requirements.lowercase.classList.remove('valid');
      }
    }
    
    if (requirements.number) {
      if (/\d/.test(password)) {
        requirements.number.classList.add('valid');
      } else {
        requirements.number.classList.remove('valid');
      }
    }
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', function() {
      validatePasswordRequirements(this.value);
    });
  }

  if (confirmPasswordInput && passwordInput) {
    confirmPasswordInput.addEventListener('input', function() {
      if (this.value && passwordInput.value && this.value !== passwordInput.value) {
        this.style.borderColor = 'var(--error)';
      } else {
        this.style.borderColor = '';
      }
    });
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const names = form.elements['names'].value.trim();
    const surnames = form.elements['surnames'].value.trim();
    const email = form.elements['email'].value.trim();
    const pass = form.elements['pass'].value;
    const confirmPass = form.elements['confirm_pass'].value;
    const phone = form.elements['phone']?.value.trim() || '';
    const imagePerfil = form.elements['imagePerfil']?.value.trim() || '';

    if (!names || !surnames || !email || !pass || !confirmPass) {
      showRegisterAlert('Completa todos los campos obligatorios.', 'error');
      return;
    }
    if (pass.length < 6) {
      showRegisterAlert('La contraseña debe tener al menos 6 caracteres.', 'error');
      return;
    }
    if (pass !== confirmPass) {
      showRegisterAlert('Las contraseñas no coinciden.', 'error');
      return;
    }

    try {
      const file = imageFileInput && imageFileInput.files && imageFileInput.files[0];
      let result;
      if (file) {
        const fd = new FormData();
        fd.append('email', email);
        fd.append('password', pass);
        fd.append('names', names);
        fd.append('surnames', surnames);
        if (phone) fd.append('phone', phone);
        fd.append('imagePerfil', file, file.name);
        result = await signupApi(fd);
      } else {
        const payload = { email, password: pass, names, surnames, imagePerfil, phone };
        result = await signupApi(payload);
      }
      console.log('signup result:', result);
      const registeredEmail = result?.data?.email || result?.data?.data?.email || result?.email || email;
      showRegisterAlert('¡Registro exitoso! Revisa tu correo y confirma con el código OTP.', 'success');
  const redirectUrl = `../verify_otp/verify_otp.html?email=${encodeURIComponent(registeredEmail)}`;
      setTimeout(() => { window.location.assign(redirectUrl); }, 1200);
    } catch (err) {
      if (err && err.status === 409) {
        showRegisterAlert('Ya existe una cuenta con este correo.', 'error');
      } else {
        showRegisterAlert(err.message || 'Error en el registro', 'error');
      }
    }
  });

  // Social login buttons (placeholder functionality)
  const socialButtons = document.querySelectorAll('.social-btn');
  socialButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const provider = this.classList.contains('google') ? 'Google' : 
                     this.classList.contains('facebook') ? 'Facebook' : 'Microsoft';
      showRegisterAlert(`Registro con ${provider} próximamente disponible`, 'warning');
    });
  });
});

function showRegisterAlert(msg, type) {
  let alertDiv = document.createElement('div');
  alertDiv.className = 'login-alert ' + type;
  alertDiv.textContent = msg;
  document.body.appendChild(alertDiv);
  setTimeout(() => { alertDiv.classList.add('show'); }, 10);
  setTimeout(() => { alertDiv.classList.remove('show'); setTimeout(() => alertDiv.remove(), 400); }, 1500);
}
