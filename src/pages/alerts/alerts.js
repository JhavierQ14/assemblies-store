function showAlert(message, type = 'info', timeout = 2000) {
  let container = document.getElementById('global-alerts');
  if (!container) {
    container = document.createElement('div');
    container.id = 'global-alerts';
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = 9999;
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `alert ${type}`;
  el.textContent = message;
  el.style.marginBottom = '8px';
  container.appendChild(el);
  setTimeout(() => el.remove(), timeout);
}
window.showAlert = showAlert;
