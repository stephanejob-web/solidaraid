/* ── Toast ── */
function showToast(msg, duration) {
  const phone = document.getElementById('phone');
  const old = phone.querySelector('.global-toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.className = 'global-toast';
  t.textContent = msg;
  t.style.cssText = 'position:absolute;bottom:80px;left:50%;transform:translateX(-50%);background:#212121;color:white;font-size:13px;font-weight:600;padding:10px 18px;border-radius:20px;z-index:9999;white-space:nowrap;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.3);';
  phone.appendChild(t);
  setTimeout(() => t && t.remove(), duration || 2500);
}

/* ── Sheets ── */
function _overlayId(id) {
  const key = id.startsWith('sheet-') ? id.slice(6) : id;
  return 'sheet-overlay-' + key;
}

function openSheet(id) {
  const overlay = document.getElementById(_overlayId(id));
  const sheet   = document.getElementById(id);
  if (!overlay || !sheet) { console.warn('openSheet: not found →', id, _overlayId(id)); return; }
  overlay.classList.add('open');
  setTimeout(() => sheet.classList.add('open'), 10);
  if (id === 'sheet-help' && currentAlertId && alertsData[currentAlertId]) {
    const a = alertsData[currentAlertId];
    const sub = document.getElementById('sheet-help-subtitle');
    if (sub) sub.textContent = `${a.icon} ${a.title} — ${a.location}`;
    selectedMeetMode = null;
    document.getElementById('help-step-1').style.display = 'block';
    document.getElementById('help-step-2').style.display = 'none';
    ['move','place'].forEach(m => { const el = document.getElementById('mode-'+m); if (el) el.classList.remove('selected'); });
    const nb = document.getElementById('help-mode-next-btn');
    if (nb) { nb.style.opacity = '.4'; nb.style.pointerEvents = 'none'; }
  }
  if (id === 'sheet-active-helps') renderActiveHelpsList();
}

function closeSheet(id) {
  const sheet   = document.getElementById(id);
  const overlay = document.getElementById(_overlayId(id));
  if (sheet)   sheet.classList.remove('open');
  if (overlay) setTimeout(() => overlay.classList.remove('open'), 300);
}

function closeAllSheets() {
  document.querySelectorAll('.sheet-overlay.open').forEach(o => {
    const id = o.id.replace('sheet-overlay-', '');
    o.classList.remove('open');
    const s = document.getElementById(id);
    if (s) s.classList.remove('open');
  });
}

/* ── Utilitaires ── */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function toggleResolvedCards() {
  const container = document.getElementById('resolved-cards');
  const toggle = document.getElementById('show-resolved-toggle');
  if (!container || !toggle) return;
  const isHidden = container.style.display === 'none';
  container.style.display = isHidden ? '' : 'none';
  toggle.querySelector('span').textContent = isHidden
    ? 'Masquer les résolus ↑'
    : 'Voir 1 signalement résolu ↓';
}

function markAllNotifsRead() {
  document.querySelectorAll('#screen-notif .notif-item.unread').forEach(item => {
    item.classList.remove('unread');
    const dot = item.querySelector('.notif-dot');
    if (dot) dot.classList.add('read');
  });
  showToast('✅ Toutes les notifications marquées comme lues');
}
