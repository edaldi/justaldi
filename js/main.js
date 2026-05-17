/**
 * main.js — Shared utilities: nav, scroll animations, toast, footer
 */

/* ── NAV ───────────────────────────────────────── */
function buildNav(activePage) {
  const pages = [
    { label: 'Thoughts',   href: 'thoughts.html',   key: 'thoughts'   },
    { label: 'Work',       href: 'portfolio.html',  key: 'portfolio'  },
    { label: 'Experience', href: 'experience.html', key: 'experience' },
    { label: 'About',      href: 'about.html',      key: 'about'      },
  ];

  function render() {
    // Nav name comes from profile asynchronously
    CMS.getProfile().then(function(profile) {
      const nav = document.getElementById('main-nav');
      if (!nav) return;
      nav.innerHTML =
        '<a href="index.html" class="nav-logo">' + profile.name.split(' ')[0] + '<span>.</span></a>' +
        '<button class="nav-mobile-toggle" aria-label="Menu" id="nav-toggle">&#9776;</button>' +
        '<ul class="nav-links" id="nav-links">' +
        pages.map(function(p) {
          return '<li><a href="' + p.href + '" class="' + (p.key === activePage ? 'active' : '') + '">' + p.label + '</a></li>';
        }).join('') +
        '</ul>';
      document.getElementById('nav-toggle').addEventListener('click', function() {
        document.getElementById('nav-links').classList.toggle('open');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
}

/* ── FOOTER ─────────────────────────────────────── */
// Can be called with a profile object (avoids extra fetch) or without
function buildFooter(profile) {
  function render(p) {
    const footer = document.getElementById('main-footer');
    if (!footer) return;
    footer.innerHTML =
      '<span class="footer-note">&copy; ' + new Date().getFullYear() + ' &middot; All rights reserved</span>' +
      '<span class="footer-name">' + p.name + '</span>';
  }
  if (profile) {
    render(profile);
  } else {
    CMS.getProfile().then(render);
  }
}

/* ── SCROLL FADE-IN ─────────────────────────────── */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in:not(.observed)');
  if (!els.length) return;
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const siblings = Array.from(
          entry.target.parentElement.querySelectorAll('.fade-in:not(.visible)')
        );
        const idx = siblings.indexOf(entry.target);
        setTimeout(function(){ entry.target.classList.add('visible'); }, idx * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(function(el) { el.classList.add('observed'); observer.observe(el); });
}

/* ── TOAST ──────────────────────────────────────── */
function showToast(msg, type) {
  type = type || 'success';
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast ' + type;
  setTimeout(function(){ toast.classList.add('show'); }, 10);
  setTimeout(function(){ toast.classList.remove('show'); }, 2800);
}

/* ── DEFAULT INIT ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  initScrollAnimations();
});
