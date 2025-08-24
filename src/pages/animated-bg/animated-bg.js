document.addEventListener('DOMContentLoaded', function () {
  const holder = document.querySelector('.animated-bg-holder');
  if (!holder) return;
  if (holder.dataset.inited) return;
  holder.dataset.inited = '1';
  // Simple animated circles background
  for (let i = 0; i < 8; i++) {
    const el = document.createElement('div');
    el.className = 'bg-circle';
    el.style.left = Math.random() * 100 + '%';
    el.style.top = Math.random() * 100 + '%';
    el.style.width = (50 + Math.random() * 150) + 'px';
    el.style.height = el.style.width;
    el.style.opacity = 0.08 + Math.random() * 0.15;
    holder.appendChild(el);
    animate(el);
  }
  function animate(el) {
    const dx = (Math.random() - 0.5) * 200;
    const dy = (Math.random() - 0.5) * 200;
    const dur = 8000 + Math.random() * 8000;
    el.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${dx}px, ${dy}px)` }], { duration: dur, iterations: Infinity, direction: 'alternate' });
  }
});
