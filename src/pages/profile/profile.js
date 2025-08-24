document.addEventListener('DOMContentLoaded', function () {
  const avatarInput = document.getElementById('avatar-input');
  const avatarImg = document.getElementById('profile-avatar');
  const nameField = document.getElementById('profile-name');
  const emailField = document.getElementById('profile-email');
  const phoneField = document.getElementById('profile-phone');
  const saveBtn = document.getElementById('save-profile');
  const user = JSON.parse(localStorage.getItem('user_profile') || '{}');
  if (avatarImg && user.avatar) avatarImg.src = user.avatar;
  if (nameField) nameField.value = user.name || '';
  if (emailField) emailField.value = user.email || '';
  if (phoneField) phoneField.value = user.phone || '';
  if (avatarInput) {
    avatarInput.addEventListener('change', function () {
      const file = this.files && this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        const url = e.target.result;
        if (avatarImg) avatarImg.src = url;
        const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
        profile.avatar = url;
        localStorage.setItem('user_profile', JSON.stringify(profile));
      };
      reader.readAsDataURL(file);
    });
  }
  if (saveBtn) {
    saveBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      profile.name = nameField ? nameField.value : profile.name;
      profile.email = emailField ? emailField.value : profile.email;
      profile.phone = phoneField ? phoneField.value : profile.phone;
      localStorage.setItem('user_profile', JSON.stringify(profile));
      const msg = document.createElement('div');
      msg.className = 'save-msg';
      msg.textContent = 'Perfil actualizado.';
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 1200);
    });
  }
});
