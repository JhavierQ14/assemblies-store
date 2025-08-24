document.addEventListener('DOMContentLoaded', function () {
  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;
  const targetDate = new Date(countdownEl.dataset.target || Date.now() + 24*3600*1000);
  function update() {
    const now = new Date();
    let diff = Math.max(0, targetDate - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);
    countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  update();
  setInterval(update, 1000);
});
