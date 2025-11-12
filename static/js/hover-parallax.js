// hover-parallax.js — updated for smoother staggered reveal + portrait parallax
(function () {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Reveal with stagger ----------
  try {
    const reveals = Array.from(document.querySelectorAll('.reveal'));
    if (reveals.length && 'IntersectionObserver' in window && !reduce) {
      const obs = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // find index for stagger (fallback: 0)
            const index = Math.max(0, reveals.indexOf(entry.target));
            setTimeout(() => entry.target.classList.add('is-visible'), index * 120);
            observer.unobserve(entry.target);
          }
        });
      }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

      reveals.forEach(r => obs.observe(r));
    } else {
      reveals.forEach(r => r.classList.add('is-visible'));
    }
  } catch (e) {
    console.error('reveal init error', e);
  }

  if (reduce) return;

  // ---------- Pointer parallax for portrait-outer wrappers ----------
  const wrappers = document.querySelectorAll('[data-parallax]');

  function handleMove(e, w) {
    const rect = w.getBoundingClientRect();
    const depth = Number(w.getAttribute('data-depth') || 14);
    const clientX = (e.clientX || (e.touches && e.touches[0].clientX));
    const clientY = (e.clientY || (e.touches && e.touches[0].clientY));
    if (clientX == null || clientY == null) return;

    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;

    const rotY = (x - 0.5) * depth * 0.2;
    const rotX = (0.5 - y) * depth * 0.14;

    w.style.transform = `perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;

    const img = w.querySelector('[data-layer]');
    if (img) {
      const tx = (x - 0.5) * depth * -0.45;
      const ty = (y - 0.5) * depth * -0.28;
      img.style.transform = `translate3d(${tx}px, ${ty}px, 32px) scale(1.02)`;
    }
  }

  function reset(w) {
    w.style.transform = '';
    const img = w.querySelector('[data-layer]');
    if (img) img.style.transform = '';
  }

  wrappers.forEach(w => {
    w.addEventListener('pointermove', e => handleMove(e, w));
    w.addEventListener('pointerenter', () => { w.style.transition = 'transform 160ms ease, box-shadow 180ms ease'; });
    w.addEventListener('pointerleave', () => { w.style.transition = 'transform 480ms cubic-bezier(.2,.9,.25,1)'; reset(w); });

    w.addEventListener('focus', () => { w.style.transform = 'translateY(-6px)'; });
    w.addEventListener('blur', () => { w.style.transform = ''; });

    w.addEventListener('touchstart', () => { w.style.transform = 'translateY(-6px)'; });
    w.addEventListener('touchend', () => { w.style.transform = ''; });
  });
})();
