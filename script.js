/* ╔══════════════════════════════════════════════════════════════════
   PlayGround interactions
   - Tab switching with sliding indicator
   - IntersectionObserver scroll reveal
   - Modal system (open / close / esc / backdrop)
   - Mouse-tracking 3D tilt on access cards
   ══════════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─────────────────────────────────────────────
     1. TAB NAVIGATION
     ───────────────────────────────────────────── */
  const tabs = document.querySelectorAll('.tab');
  const indicator = document.querySelector('.tabs__indicator');
  const panels = {
    access: document.getElementById('panel-access'),
    menu:   document.getElementById('panel-menu'),
    teams:  document.getElementById('panel-teams'),
  };

  function moveIndicator(activeTab) {
    const index = Array.from(tabs).indexOf(activeTab);
    if (indicator) {
      indicator.style.transform = `translateX(${index * 100}%)`;
    }
  }

  function activateTab(tab) {
    const target = tab.dataset.tab;

    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    moveIndicator(tab);

    Object.entries(panels).forEach(([key, panel]) => {
      if (!panel) return;
      if (key === target) {
        panel.hidden = false;
        panel.classList.add('is-active');
        // Re-trigger reveal animations inside this panel
        panel.querySelectorAll('.reveal').forEach(el => {
          el.classList.remove('is-visible');
        });
        requestAnimationFrame(() => {
          panel.querySelectorAll('.reveal').forEach(el => {
            observeReveal(el);
          });
        });
      } else {
        panel.hidden = true;
        panel.classList.remove('is-active');
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      // 팀즈 활용팁: external link in new tab, AND show panel
      if (tab.dataset.tab === 'teams') {
        window.open(
          'https://autoway.hyundai.net/board/H147/Lists/H14700022/DispForm.aspx?ID=511',
          '_blank',
          'noopener,noreferrer'
        );
      }
      activateTab(tab);
    });
  });

  // Initialize indicator on load
  requestAnimationFrame(() => {
    const active = document.querySelector('.tab.is-active');
    if (active) moveIndicator(active);
  });


  /* ─────────────────────────────────────────────
     2. SCROLL REVEAL (IntersectionObserver)
     ───────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px',
  });

  function observeReveal(el) {
    if (!el.classList.contains('is-visible')) {
      revealObserver.observe(el);
    }
  }

  document.querySelectorAll('.reveal').forEach(observeReveal);


  /* ─────────────────────────────────────────────
     3. MODAL SYSTEM
     ───────────────────────────────────────────── */
  const openers = document.querySelectorAll('[data-modal]');
  const modals = document.querySelectorAll('.modal');
  let lastFocused = null;

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    // focus the close button for accessibility
    const closeBtn = modal.querySelector('.modal__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    modal.classList.remove('is-open');
    setTimeout(() => { modal.hidden = true; }, 300);
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  openers.forEach(opener => {
    opener.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(opener.dataset.modal);
    });
  });

  modals.forEach(modal => {
    modal.querySelectorAll('[data-close]').forEach(el => {
      el.addEventListener('click', () => closeModal(modal));
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('is-open')) closeModal(modal);
      });
    }
  });


  /* ─────────────────────────────────────────────
     4. MOUSE-TRACK 3D TILT on ACCESS CARDS
     ───────────────────────────────────────────── */
  const accessCards = document.querySelectorAll('.access-card');
  const TILT_MAX = 5; // degrees

  accessCards.forEach(card => {
    let raf = null;

    card.addEventListener('mousemove', (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;  // 0..1
        const y = (e.clientY - rect.top) / rect.height;  // 0..1
        const rotY = (x - 0.5) * 2 * TILT_MAX;           // left/right
        const rotX = -(y - 0.5) * 2 * TILT_MAX;          // up/down

        card.style.transform =
          `translateY(-6px) perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });
    });

    card.addEventListener('mouseleave', () => {
      if (raf) cancelAnimationFrame(raf);
      card.style.transform = '';
    });
  });


  /* ─────────────────────────────────────────────
     5. SUBTLE PARALLAX on HERO LOGO
     ───────────────────────────────────────────── */
  const heroLogo = document.querySelector('.hero__logo');
  if (heroLogo) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < 500) {
            heroLogo.style.transform = `translateY(${y * 0.08}px) scale(${1 - y * 0.0003})`;
            heroLogo.style.opacity = String(Math.max(0, 1 - y * 0.0025));
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }


  /* ─────────────────────────────────────────────
     6. KEYBOARD NAV for TABS (arrow keys)
     ───────────────────────────────────────────── */
  document.querySelector('.tabs')?.addEventListener('keydown', (e) => {
    const arr = Array.from(tabs);
    const current = arr.findIndex(t => t.classList.contains('is-active'));
    let next = current;
    if (e.key === 'ArrowRight') next = (current + 1) % arr.length;
    else if (e.key === 'ArrowLeft') next = (current - 1 + arr.length) % arr.length;
    else return;
    e.preventDefault();
    arr[next].focus();
    activateTab(arr[next]);
  });
})();
