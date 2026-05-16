/**
 * main.js — Shared utilities: nav, scroll animations, toast
 */

/* ── NAV ───────────────────────────────────────── */
function buildNav(activePage) {
  // Determine base path (works for root and subdirectories)
  const isRoot = !window.location.pathname.includes('/pages/');
  const base   = isRoot ? '' : '../';

  const pages = [
    { label: 'Thoughts',   href: base + 'thoughts.html',   key: 'thoughts'   },
    { label: 'Work',       href: base + 'portfolio.html',  key: 'portfolio'  },
    { label: 'Experience', href: base + 'experience.html', key: 'experience' },
    { label: 'About',      href: base + 'about.html',      key: 'about'      },
  ];

  const profile = CMS.getProfile();

  const nav = document.getElementById('main-nav');
  if (!nav) return;

  nav.innerHTML = `
    <a href="${base}index.html" class="nav-logo">${profile.name.split(' ')[0]}<span>.</span></a>
    <button class="nav-mobile-toggle" aria-label="Menu" id="nav-toggle">☰</button>
    <ul class="nav-links" id="nav-links">
      ${pages.map(p => `
        <li><a href="${p.href}" class="${p.key === activePage ? 'active' : ''}">${p.label}</a></li>
      `).join('')}

    </ul>
  `;

  document.getElementById('nav-toggle').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('open');
  });
}

/* ── SCROLL FADE-IN ─────────────────────────────── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = Array.from(
          entry.target.parentElement.querySelectorAll('.fade-in:not(.visible)')
        );
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ── TOAST ──────────────────────────────────────── */
function showToast(msg, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ── FOOTER ─────────────────────────────────────── */
function buildFooter() {
  const profile = CMS.getProfile();
  const footer  = document.getElementById('main-footer');
  if (!footer) return;
  footer.innerHTML = `
    <span class="footer-note">© ${new Date().getFullYear()} · All rights reserved</span>
    <span class="footer-name">${profile.name}</span>
  `;
}

/* ── INIT on DOMContentLoaded ────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildFooter();
  initScrollAnimations();
});
