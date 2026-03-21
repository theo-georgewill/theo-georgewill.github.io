import { observeReveal } from './ui.js';

const CACHE_KEY = 'tg_portfolio_repos';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const LANG_COLORS = {
  JavaScript:'#f1e05a', TypeScript:'#3178c6', PHP:'#4f5d95',
  Python:'#3572A5', CSS:'#563d7c', HTML:'#e34c26',
  Vue:'#41b883', Shell:'#89e051', Go:'#00ADD8', Blade:'#f05340'
};

const ARROW = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    return (Date.now() - ts < CACHE_TTL) ? data : null;
  } catch { return null; }
}

function setCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d < 1)  return 'today';
  if (d < 7)  return `${d}d ago`;
  if (d < 30) return `${Math.floor(d/7)}w ago`;
  if (d < 365) return `${Math.floor(d/30)}mo ago`;
  return `${Math.floor(d/365)}y ago`;
}

function renderProjects(repos) {
  const grid = document.getElementById('projects-grid');
  const portfolio = repos.filter(r => r.topics && r.topics.includes('portfolio'));

  if (!portfolio.length) {
    grid.innerHTML = `
      <div class="md:col-span-3 text-center py-16 border rounded-[18px] t-surface3 t-border">
        <p class="t-text2 mb-2 text-[15px]">No repos tagged with <code class="text-accent">portfolio</code> topic yet.</p>
        <p class="t-text3 text-[13px]">Go to each repo on GitHub → ⚙️ About → Topics → add <strong>portfolio</strong></p>
      </div>`;
    return;
  }

  grid.innerHTML = portfolio.map(r => {
    const featured  = r.topics.includes('featured');
    const colSpan   = featured ? 'md:col-span-2' : '';
    const lang      = r.language || 'Code';
    const langColor = LANG_COLORS[lang] || '#6e6e73';
    const desc      = r.description || 'No description provided.';
    const stars     = r.stargazers_count;
    const exclude   = new Set(['portfolio','featured']);
    const chips     = (r.topics||[]).filter(t=>!exclude.has(t))
      .map(t=>`<span class="text-[11px] font-medium px-[10px] py-1 rounded-full border t-surface2 t-border t-text3">${t}</span>`).join('');
    const name      = r.name.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase());
    const initials  = name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
    const starsHtml = stars > 0 ? `<span class="text-[12px] t-text3 flex items-center gap-1" aria-label="${stars} stars">★ ${stars}</span>` : '';
    const featuredBg = featured ? 'background:linear-gradient(135deg,#0d1f38 0%,#0a1628 100%);border-color:rgba(41,151,255,0.2)' : 'background:var(--surface3);border-color:var(--border)';

    return `
    <article class="relative ${colSpan} border rounded-[18px] p-8 flex flex-col card-shine overflow-hidden hover:-translate-y-1 transition-transform reveal" style="${featuredBg}">
      <div class="w-[52px] h-[52px] rounded-2xl flex items-center justify-center font-bold t-text mb-5 flex-shrink-0"
          style="background:var(--surface2);font-size:16px" aria-hidden="true">${initials}</div>
      <h3 class="text-[17px] font-semibold mb-2 t-text">${name}</h3>
      <p class="text-[14px] t-text2 leading-relaxed mb-4 project-desc-clamp">${desc}</p>
      <div class="flex flex-wrap gap-[6px] mb-5">${chips}</div>
      <div class="flex items-center justify-between mt-auto">
        <a href="${r.html_url}" target="_blank" rel="noopener"
          class="inline-flex items-center gap-[6px] text-[13px] font-medium text-accent hover:opacity-80 transition-opacity whitespace-nowrap"
          aria-label="View ${name} on GitHub">
          View on GitHub ${ARROW}
        </a>
        <div class="flex items-center gap-3">
          <span class="text-[12px] t-text3 flex items-center gap-[5px]">
            <span class="w-[10px] h-[10px] rounded-full inline-block" style="background:${langColor}" aria-hidden="true"></span>
            ${lang}
          </span>
        </div>
      </div>
    </article>`;
  }).join('');

  grid.querySelectorAll('.reveal').forEach(el => observeReveal(el));
}

async function loadProjects(forceRefresh = false) {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = Array(3).fill(`
    <div class="border rounded-[18px] p-8 animate-pulse t-surface3 t-border">
      <div class="w-[52px] h-[52px] rounded-2xl mb-5 t-surface2"></div>
      <div class="h-4 rounded mb-3 w-2/3 t-surface2"></div>
      <div class="h-3 rounded mb-2 t-surface2"></div>
      <div class="h-3 rounded mb-2 w-5/6 t-surface2"></div>
      <div class="h-3 rounded w-4/6 t-surface2"></div>
    </div>`).join('');

  try {
    let repos = forceRefresh ? null : getCached();
    if (!repos) {
      const res = await fetch('https://api.github.com/users/theo-georgewill/repos?per_page=100&sort=pushed', {
        headers: { 'Accept': 'application/vnd.github.mercy-preview+json' }
      });
      if (!res.ok) throw new Error(`GitHub ${res.status}`);
      repos = await res.json();
      setCache(repos);
    }
    renderProjects(repos);
  } catch (e) {
    grid.innerHTML = `
      <div class="md:col-span-3 text-center py-12 border rounded-[18px] t-surface3 t-border">
        <p class="t-text2 mb-4">Couldn't load projects right now.</p>
        <a href="https://github.com/theo-georgewill" target="_blank" rel="noopener"
          class="inline-flex items-center gap-2 text-[13px] font-medium text-accent">
          View all repos on GitHub ${ARROW}
        </a>
      </div>`;
  }
}

function refreshProjects() {
  localStorage.removeItem(CACHE_KEY);
  loadProjects(true);
}

export { loadProjects, refreshProjects };