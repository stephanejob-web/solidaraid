/* ── Dark mode ── */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggle = document.getElementById('dark-toggle');
  if (toggle) toggle.classList.toggle('on', theme === 'dark');
  const quick = document.getElementById('theme-quick-btn');
  if (quick) quick.textContent = theme === 'dark' ? '☀️' : '🌙';
  const homeBtn = document.getElementById('home-theme-btn');
  if (homeBtn) homeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  try { localStorage.setItem('humeo-theme', theme); } catch (e) {}
}

function toggleDarkMode() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
}

function initTheme() {
  let stored = null;
  try { stored = localStorage.getItem('humeo-theme'); } catch (e) {}
  if (stored === 'dark' || stored === 'light') { applyTheme(stored); return; }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}
