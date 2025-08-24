document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('update-profile-form');
  if (!form) return;
  const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
  ['name','email','phone'].forEach(k => {
    const el = form.querySelector(`[name="${k}"]`);
    if (el && profile[k]) el.value = profile[k];
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const newProfile = {};
    ['name','email','phone'].forEach(k => {
      const el = form.querySelector(`[name="${k}"]`);
      if (el) newProfile[k] = el.value;
    });
    const current = JSON.parse(localStorage.getItem('user_profile') || '{}');
    const merged = Object.assign({}, current, newProfile);
    localStorage.setItem('user_profile', JSON.stringify(merged));
    const msg = document.createElement('div'); msg.className='saved'; msg.textContent='Perfil actualizado.'; document.body.appendChild(msg);
    setTimeout(()=> { msg.remove(); window.location.href='profile.html'; }, 900);
  });
});
