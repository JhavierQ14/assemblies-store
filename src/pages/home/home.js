document.addEventListener('DOMContentLoaded', function() {
  // Animación de typing y Swiper inicial
  function animateTypingLoop(element, text, delay = 60, pause = 1200) {
    let charIndex = 0;
    let typing = true;
    let timeoutId;
    function type() {
      if (typing) {
        if (charIndex <= text.length) {
          element.textContent = text.substring(0, charIndex);
          charIndex++;
          timeoutId = setTimeout(type, delay);
        } else {
          typing = false;
          timeoutId = setTimeout(type, pause);
        }
      } else {
        if (charIndex >= 0) {
          element.textContent = text.substring(0, charIndex);
          charIndex--;
          timeoutId = setTimeout(type, delay);
        } else {
          typing = true;
          timeoutId = setTimeout(type, pause / 2);
        }
      }
    }
    type();
    return () => clearTimeout(timeoutId);
  }

  let cleanupTyping = [];
  function resetAllTyping() {
    cleanupTyping.forEach(fn => fn && fn());
    cleanupTyping = [];
    document.querySelectorAll('.animated-typing').forEach(el => el.textContent = '');
  }
  function handleSlideChange(swiper) {
    resetAllTyping();
    const activeSlide = swiper.slides[swiper.activeIndex];
    const typingEls = activeSlide.querySelectorAll('.animated-typing');
    if (typingEls.length > 1) {
      let firstDone = false;
      function animateSecond() {
        cleanupTyping[1] = animateTypingLoop(typingEls[1], typingEls[1].getAttribute('data-typing'), 60, 1200);
      }
      cleanupTyping[0] = animateTypingLoop(typingEls[0], typingEls[0].getAttribute('data-typing'), 60, 1200);
      let observer = new MutationObserver(() => {
        if (!firstDone && typingEls[0].textContent === typingEls[0].getAttribute('data-typing')) {
          firstDone = true; animateSecond(); observer.disconnect();
        }
      });
      observer.observe(typingEls[0], { childList: true });
    } else if (typingEls.length === 1) {
      cleanupTyping[0] = animateTypingLoop(typingEls[0], typingEls[0].getAttribute('data-typing'), 60, 1200);
    }
  }

  try {
    var swiper = new Swiper('.home-slider', {
      loop: true,
      grabCursor: true,
      effect: 'flip',
      pagination: { el: '.swiper-pagination', clickable: true },
      on: { init: function() { handleSlideChange(this); }, slideChange: function() { handleSlideChange(this); } }
    });
  } catch (e) {
    console.warn('Swiper init failed', e);
  }
});
