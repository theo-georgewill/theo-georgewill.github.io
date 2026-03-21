import { refreshProjects } from './github.js';
// ── Theme ──────────────────────────────────────────────────────────────────
    const html  = document.documentElement;
    const tBtn  = document.getElementById('theme-toggle');
    const tIcon = document.getElementById('theme-icon');
    const tLbl  = document.getElementById('theme-label');

    function applyTheme(t) {
      html.classList.toggle('dark',  t === 'dark');
      html.classList.toggle('light', t === 'light');
      tIcon.textContent = t === 'dark' ? '☀️' : '🌙';
      tLbl.textContent  = t === 'dark' ? 'Light' : 'Dark';
      localStorage.setItem('theme', t);
    }
    const saved = localStorage.getItem('theme');
    applyTheme(saved || (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'));
    tBtn.addEventListener('click', () => applyTheme(html.classList.contains('dark') ? 'light' : 'dark'));

    // ── Mobile menu ────────────────────────────────────────────────────────────
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    let menuOpen = false;

    function closeMobileMenu() {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    menuToggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('open', menuOpen);
      menuToggle.setAttribute('aria-expanded', String(menuOpen));
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });

    // ── Back to top ────────────────────────────────────────────────────────────
    const btt = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 400), { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ── Active nav highlight ───────────────────────────────────────────────────
    const sections  = ['hero','about','experience','projects','skills','contact'];
    const navLinks  = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === entry.target.id));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    // ── Scroll reveal ──────────────────────────────────────────────────────────
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ── Accordion ─────────────────────────────────────────────────────────────
    function toggleExp(item) {
      const body = item.querySelector('.exp-body');
      const btn  = item.querySelector('.toggle-btn');
      const open = body.classList.contains('open');
      document.querySelectorAll('.exp-body').forEach(b => b.classList.remove('open'));
      document.querySelectorAll('.toggle-btn').forEach(b => { b.style.transform = ''; b.setAttribute('aria-expanded','false'); });
      if (!open) { body.classList.add('open'); btn.style.transform = 'rotate(180deg)'; btn.setAttribute('aria-expanded','true'); }
    }
    document.querySelector('.exp-item')?.click();
  
    // ── Contact form → Google Sheets ───────────────────────────────────────────
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwhz2BgJoAOaOQXwZ01tcauT-zjF51Iz7uB1PKAGL0VYn_ANbxLHJ6by9lKF8m-m_qlZg/exec';
    const form      = document.getElementById('contactForm');
    const successEl = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');
    const submitTxt = document.getElementById('submitText');

    form.addEventListener('submit', async e => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitTxt.textContent = 'Sending...';
      try {
        await fetch(SCRIPT_URL, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name:    document.getElementById('name').value,
            email:   document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
          })
        });
        form.style.display = 'none';
        successEl.classList.remove('hidden');
      } catch {
        submitBtn.disabled = false;
        submitTxt.textContent = 'Send Message';
        alert('Something went wrong. Please email ttggwll@mail.com directly.');
      }
    });

    // ── Dynamic year ───────────────────────────────────────────────────────────
    document.getElementById('yr').textContent = new Date().getFullYear();

document.querySelectorAll('.exp-item').forEach(item => {
  item.addEventListener('click', () => toggleExp(item));
});
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});
document
  .getElementById('refresh-projects-btn')
  ?.addEventListener('click', refreshProjects);
export function observeReveal(el) {
  revealObserver.observe(el);
}