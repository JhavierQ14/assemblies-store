// animated-bg.js
// Genera componentes de computadora animados en el fondo

const components = [
  {
    name: 'laptop',
    svg: `<svg width="54" height="54" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="11" rx="2" fill="#232b39" stroke="#fed330" stroke-width="1.5"/><rect x="5" y="7" width="14" height="7" rx="1" fill="#fff"/><rect x="2" y="17" width="20" height="2" rx="1" fill="#fed330"/><rect x="4" y="18" width="16" height="1" rx="0.5" fill="#232b39"/></svg>`
  },
  {
    name: 'desktop',
    svg: `<svg width="54" height="54" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="11" rx="2" fill="#232b39" stroke="#fed330" stroke-width="1.5"/><rect x="6" y="7" width="12" height="7" rx="1" fill="#fff"/><rect x="9" y="18" width="6" height="2" rx="1" fill="#fed330"/><rect x="10" y="20" width="4" height="1" rx="0.5" fill="#232b39"/></svg>`
  },
  {
    name: 'keyboard',
    svg: `<svg width="54" height="54" viewBox="0 0 24 24" fill="none"><rect x="3" y="8" width="18" height="7" rx="2" fill="#232b39" stroke="#fed330" stroke-width="1.5"/><rect x="5" y="10" width="2" height="2" rx="0.5" fill="#fff"/><rect x="8" y="10" width="2" height="2" rx="0.5" fill="#fff"/><rect x="11" y="10" width="2" height="2" rx="0.5" fill="#fff"/><rect x="14" y="10" width="2" height="2" rx="0.5" fill="#fff"/><rect x="17" y="10" width="2" height="2" rx="0.5" fill="#fff"/></svg>`
  },
  {
    name: 'mouse',
    svg: `<svg width="40" height="54" viewBox="0 0 24 24" fill="none"><rect x="7" y="3" width="10" height="18" rx="5" fill="#232b39" stroke="#fed330" stroke-width="1.5"/><rect x="11" y="3" width="2" height="6" rx="1" fill="#fed330"/></svg>`
  },
  {
    name: 'monitor',
    svg: `<svg width="54" height="54" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="10" rx="2" fill="#232b39" stroke="#fed330" stroke-width="1.5"/><rect x="6" y="7" width="12" height="6" rx="1" fill="#fff"/><rect x="10" y="17" width="4" height="2" rx="1" fill="#fed330"/></svg>`
  },
  {
    name: 'ram',
    svg: `<svg width="54" height="54" viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="16" height="4" rx="1" fill="#232b39" stroke="#fed330" stroke-width="1.5"/><rect x="6" y="12" width="2" height="1" rx="0.5" fill="#fff"/><rect x="10" y="12" width="2" height="1" rx="0.5" fill="#fff"/><rect x="14" y="12" width="2" height="1" rx="0.5" fill="#fff"/></svg>`
  },
  {
    name: 'tablet',
    svg: `<svg width="44" height="54" viewBox="0 0 24 24" fill="none"><rect x="6" y="3" width="12" height="18" rx="2" fill="#232b39" stroke="#fed330" stroke-width="1.5"/><rect x="8" y="5" width="8" height="14" rx="1" fill="#fff"/><circle cx="12" cy="19" r="1" fill="#fed330"/></svg>`
  },
  {
    name: 'smartphone',
    svg: `<svg width="32" height="54" viewBox="0 0 24 24" fill="none"><rect x="7" y="3" width="10" height="18" rx="2" fill="#232b39" stroke="#fed330" stroke-width="1.5"/><rect x="9" y="5" width="6" height="14" rx="1" fill="#fff"/><circle cx="12" cy="19" r="1" fill="#fed330"/></svg>`
  },
  {
    name: 'printer',
    svg: `<svg width="54" height="44" viewBox="0 0 24 24" fill="none"><rect x="5" y="8" width="14" height="8" rx="2" fill="#232b39" stroke="#fed330" stroke-width="1.5"/><rect x="7" y="10" width="10" height="4" rx="1" fill="#fff"/><rect x="6" y="16" width="12" height="3" rx="1" fill="#fed330"/></svg>`
  },
  {
    name: 'usb',
    svg: `<svg width="32" height="54" viewBox="0 0 24 24" fill="none"><rect x="10" y="3" width="4" height="10" rx="1" fill="#fed330" stroke="#23395d" stroke-width="1.5"/><rect x="8" y="13" width="8" height="6" rx="2" fill="#232b39" stroke="#fed330" stroke-width="1.5"/></svg>`
  },
  {
    name: 'headphones',
    svg: `<svg width="54" height="54" viewBox="0 0 24 24" fill="none"><path d="M4 16v-2a8 8 0 0 1 16 0v2" stroke="#fed330" stroke-width="1.5" fill="none"/><rect x="3" y="16" width="4" height="5" rx="2" fill="#232b39" stroke="#fed330" stroke-width="1.5"/><rect x="17" y="16" width="4" height="5" rx="2" fill="#232b39" stroke="#fed330" stroke-width="1.5"/></svg>`
  },
  {
    name: 'camera',
    svg: `<svg width="54" height="44" viewBox="0 0 24 24" fill="none"><rect x="4" y="8" width="16" height="10" rx="3" fill="#232b39" stroke="#fed330" stroke-width="1.5"/><circle cx="12" cy="13" r="3" fill="#fff" stroke="#23395d" stroke-width="1.5"/><rect x="9" y="6" width="6" height="3" rx="1" fill="#fed330"/></svg>`
  }
];

function randomBetween(a, b) {
  return Math.random() * (b - a) + a;
}

function createComponent() {
  const comp = components[Math.floor(Math.random() * components.length)];
  const div = document.createElement('div');
  div.className = 'bg-component';
  div.innerHTML = comp.svg.replace(/#fed330/gi, '#4fc3f7'); // Cambia amarillo por azul suave
  // Posición y tamaño aleatorio (dentro de límites para no salir de pantalla)
  div.style.left = randomBetween(5, 80) + 'vw';
  div.style.top = randomBetween(8, 75) + 'vh';
  div.style.setProperty('--scale', randomBetween(0.8, 1.2));
  div.style.zIndex = 1;
  // Animación de giro más lenta
  div.style.animationDuration = randomBetween(18, 26) + 's';
  document.querySelector('.animated-bg').appendChild(div);
  animateComponent(div);
}

function animateComponent(div) {
  let angle = randomBetween(0, 360);
  let radius = randomBetween(4, 10); // radio pequeño para que no salgan
  let speed = randomBetween(0.08, 0.16); // velocidad más lenta
  const centerX = parseFloat(div.style.left);
  const centerY = parseFloat(div.style.top);
  function move() {
    angle += speed;
    const x = Math.max(2, Math.min(98, centerX + Math.cos(angle * Math.PI / 180) * radius));
    const y = Math.max(4, Math.min(96, centerY + Math.sin(angle * Math.PI / 180) * radius));
    div.style.left = x + 'vw';
    div.style.top = y + 'vh';
    requestAnimationFrame(move);
  }
  move();
}

document.addEventListener('DOMContentLoaded', function() {
  // Generar más componentes (por ejemplo, 22)
  for (let i = 0; i < 22; i++) {
    createComponent();
  }
});
