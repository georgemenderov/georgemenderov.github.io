/* ============================================================
   GEORGII MENDEROV — main.js
   ============================================================ */

'use strict';

/* ---- Clock in status bar ---- */
function updateClock() {
  const el = document.getElementById('clock-display');
  if (!el) return;
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  el.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
updateClock();
setInterval(updateClock, 1000);

/* ---- PLC I/O animation ---- */
const IO_BITS = 16;
(function initIO() {
  const row = document.getElementById('io-anim');
  if (!row) return;
  for (let i = 0; i < IO_BITS; i++) {
    const bit = document.createElement('span');
    bit.className = 'io-bit';
    row.appendChild(bit);
  }
  // random "PLC running" pattern
  function tick() {
    const bits = row.querySelectorAll('.io-bit');
    bits.forEach(b => {
      if (Math.random() < 0.15) b.classList.toggle('on');
    });
  }
  tick();
  setInterval(tick, 400);
})();

/* ---- Active nav on scroll ---- */
(function initNav() {
  const sections = document.querySelectorAll('main section[id], header');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();

/* ---- Scroll-reveal for timeline and project cards ---- */
(function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger by position in NodeList
        const delay = Array.from(items).indexOf(entry.target) * 60;
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -80px 0px' });
  items.forEach(el => observer.observe(el));
})();

/* ---- Terminal typewriter ---- */
(function initTerminal() {
  const lines = [
    {
      el: 't-ping',
      texts: [
        'PING george.menderov@gmail.com',
        'Reply: 26 years experience confirmed.',
        'Packets: 3 sent, 3 received. Loss: 0%.',
      ]
    },
    {
      el: 't-skills',
      texts: [
        'TIA Portal  S7-1500  PROFINET',
        'CI/CD-OT  Safety Integrated',
        'Intralogistics  SINAMICS S120',
      ]
    },
    {
      el: 't-status',
      texts: ['STATUS: AVAILABLE FOR PROJECTS ✓']
    }
  ];

  let lineIdx = 0;
  let textIdx = 0;
  let charIdx = 0;
  let activeEl = null;

  function nextTarget() {
    if (lineIdx >= lines.length) return false;
    const group = lines[lineIdx];
    if (textIdx >= group.texts.length) {
      lineIdx++;
      textIdx = 0;
      return nextTarget();
    }
    activeEl = document.getElementById(group.el);
    if (!activeEl) { lineIdx++; textIdx = 0; return nextTarget(); }
    charIdx = 0;
    return true;
  }

  function type() {
    if (!activeEl) {
      if (!nextTarget()) return;
    }
    const targetText = lines[lineIdx]?.texts[textIdx] || '';
    if (charIdx < targetText.length) {
      activeEl.textContent += targetText[charIdx++];
      setTimeout(type, 28 + Math.random() * 20);
    } else {
      // line done
      textIdx++;
      if (textIdx < lines[lineIdx].texts.length) {
        // next line in group: add line break
        activeEl.textContent += '\n';
        setTimeout(type, 180);
      } else {
        lineIdx++;
        textIdx = 0;
        activeEl = null;
        setTimeout(type, 400);
      }
    }
  }

  // start after a small delay
  setTimeout(() => {
    if (nextTarget()) type();
  }, 1200);
})();

/* ---- Smooth nav scroll offset (sticky nav height) ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.querySelector('.main-nav')?.offsetHeight || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
