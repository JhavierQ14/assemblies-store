document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('address-form');
  if (!form) return;
  const address = JSON.parse(localStorage.getItem('user_address') || '{}');
  ['flat','street','city','state','country','pin_code','additional'].forEach(k => {
    const el = form.querySelector(`[name="${k}"]`);
    if (el && address[k]) el.value = address[k];
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const newAddr = {};
    ['flat','street','city','state','country','pin_code','additional'].forEach(k => {
      const el = form.querySelector(`[name="${k}"]`);
      if (el) newAddr[k] = el.value;
    });
    localStorage.setItem('user_address', JSON.stringify(newAddr));
    const msg = document.createElement('div'); msg.className='saved'; msg.textContent='Dirección guardada.'; document.body.appendChild(msg);
    setTimeout(()=> { msg.remove(); window.location.href='profile.html'; }, 900);
  });
});
