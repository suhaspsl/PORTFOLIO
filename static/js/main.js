// Overlay logic for section popups
document.addEventListener('DOMContentLoaded', function () {

  const overlay = document.getElementById('overlay');
  const overlayContent = document.getElementById('overlayContent');
  const overlayClose = document.getElementById('overlayClose');

  // When any .section is hovered (or clicked on mobile), show overlay with cloned content
  const sections = document.querySelectorAll('.section');
  sections.forEach(sec => {
    // Show overlay on click (to support mobile)
    sec.addEventListener('click', function (e) {
      // Make sure clicks on links do not trigger overlay
      if (e.target.tagName.toLowerCase() === 'a') return;
      showOverlayForSection(sec);
    });

    // Optionally show slightly on hover (desktop)
    sec.addEventListener('mouseenter', () => {
      // subtle pop effect via CSS transform
      sec.style.transform = 'translateY(-6px) scale(1.005)';
    });
    sec.addEventListener('mouseleave', () => {
      sec.style.transform = '';
    });
  });

  overlayClose.addEventListener('click', hideOverlay);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) hideOverlay();
  });

  function showOverlayForSection(sec) {
    const clone = sec.cloneNode(true);
    clone.style.pointerEvents = 'auto';
    clone.classList.add('overlay-clone');
    overlayContent.innerHTML = ''; // clear
    overlayContent.appendChild(clone);
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
  }

  function hideOverlay() {
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
    overlayContent.innerHTML = '';
  }

  /////////////////////////
  // Projects stacking interaction
  /////////////////////////
  const stack = document.getElementById('projectsStack');
  if (stack) {
    const cards = Array.from(stack.querySelectorAll('.project-card'));
    // set indexes as attributes for initial CSS
    cards.forEach((c, i) => c.setAttribute('data-index', i));

    // Position cards in a nice overlap (center card on top).
    // We'll compute left offsets so they sit overlapping and add interactivity.
    function layoutCards() {
      const centerX = stack.clientWidth / 2;
      const spacing = 220; // horizontal offset between centers
      const mid = Math.floor(cards.length / 2);
      cards.forEach((card, i) => {
        const offset = (i - mid) * spacing;
        // absolute center positioning
        card.style.left = `calc(50% + ${offset}px)`;
        // rotate slightly
        const rot = (i - mid) * 6; // -6, 0, 6 deg ...
        const scale = i === mid ? 1 : 0.92;
        const z = i === mid ? 30 : (20 - Math.abs(i - mid));
        card.style.transform = `translateX(-50%) translateY(${Math.abs(i-mid)*6}px) rotate(${rot}deg) scale(${scale})`;
        card.style.zIndex = z;
        card.style.top = `${Math.abs(i-mid) * 8}px`;
      });
    }
    layoutCards();
    window.addEventListener('resize', layoutCards);

    // Hover/focus: bring to front and enlarge slightly + show overlay details
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        cards.forEach(c => c.style.filter = 'blur(1px)');
        card.style.transform += ' translateZ(40px) scale(1.03)';
        card.style.filter = 'none';
        card.style.zIndex = 99;
      });
      card.addEventListener('mouseleave', () => {
        cards.forEach(c => c.style.filter = '');
        layoutCards();
      });

      // click to open overlay detail
      card.addEventListener('click', () => {
        const clone = card.cloneNode(true);
        // expand clone
        clone.style.transform = 'translateX(-50%) scale(1.02) rotate(0)';
        overlayContent.innerHTML = '';
        const big = document.createElement('div');
        big.className = 'project-overlay-detail';
        big.appendChild(clone);

        // add more details (button)
        const more = document.createElement('div');
        more.style.marginTop = '18px';
        const title = card.querySelector('h4') ? card.querySelector('h4').innerText : 'Project';
        const p = card.querySelector('p') ? card.querySelector('p').innerText : '';
        more.innerHTML = `<h2 style="margin:0 0 8px">${title}</h2><p style="color:#9fb7d8">${p}</p><a class="btn" href="${card.querySelector('.btn')?card.querySelector('.btn').href:'#'}">Open Project</a>`;
        big.appendChild(more);

        overlayContent.appendChild(big);
        overlay.classList.remove('hidden');
        overlay.setAttribute('aria-hidden', 'false');
      });

      // keyboard accessible
      card.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') card.click();
      });
    });

    // subtle parallax while user scrolls within the projects section
    stack.addEventListener('wheel', (ev) => {
      // convert wheel delta into small rotation/translate changes for cards
      const delta = Math.sign(ev.deltaY) * 8;
      cards.forEach((card, i) => {
        const prev = card._offset||0;
        const next = prev + delta * (1 - Math.abs(i - Math.floor(cards.length/2))*0.25);
        card._offset = Math.max(Math.min(next, 40), -40);
        card.style.transform = card.style.transform.replace(/translateY\([^)]+\)/, `translateY(${(Math.abs(i - Math.floor(cards.length/2))*6 + card._offset)}px)`);
      });
      // prevent page scroll when over the stack
      ev.preventDefault();
    }, { passive: false });
  }
});
