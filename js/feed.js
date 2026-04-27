/* ── Chips de filtrage ── */
function toggleChip(el) {
  document.querySelectorAll('.chips-scroll .chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  const filter = el.dataset.filter || 'all';
  let visible = 0;
  document.querySelectorAll('#screen-home .alert-card').forEach(card => {
    const cats = card.dataset.categories ? card.dataset.categories.split(' ') : [card.dataset.category];
    const match = filter === 'all' || cats.includes(filter);
    card.classList.toggle('filtered-out', !match);
    if (match) visible++;
  });
  const empty = document.getElementById('feed-empty-state');
  if (empty) empty.classList.toggle('visible', visible === 0);
}

/* ── Amélioration des cartes du feed ── */
function enhanceFeedCards() {
  const list = document.getElementById('feed-list');
  if (!list) return;
  const cards = Array.from(list.querySelectorAll('.alert-card'));
  cards.forEach(card => {
    const id   = card.dataset.alertId;
    const data = id ? alertsData[id] : null;
    let urgency = data && data.urgency;
    if (!urgency) {
      if (card.querySelector('.badge-high'))   urgency = 'high';
      else if (card.querySelector('.badge-medium')) urgency = 'medium';
      else urgency = 'low';
    }
    card.dataset.urgency = urgency;
    let status = data && data.initialState;
    if (!status) {
      if (card.querySelector('.badge-done'))          status = 'done';
      else if (card.querySelector('.card-status-banner')) status = 'other';
      else status = 'open';
    }
    card.dataset.status = status;
    if (id) {
      const meta = card.querySelector('.alert-card-meta');
      if (meta && !meta.querySelector('.card-chat-btn')) {
        const btn = document.createElement('button');
        btn.className = 'card-chat-btn';
        btn.innerHTML = '💬 Chat';
        btn.onclick = (e) => { e.stopPropagation(); openAlertChatFromCard(id); };
        meta.appendChild(btn);
      }
    }
    if (data && Array.isArray(data.participants) && data.participants.length) {
      const meta = card.querySelector('.alert-card-meta');
      if (meta && !meta.querySelector('.participants-strip')) {
        const old = meta.querySelector('span[style*="--primary"]');
        if (old && /réponse/i.test(old.textContent)) old.remove();
        const strip = document.createElement('div');
        strip.className = 'participants-strip';
        const shown = data.participants.slice(0, 3);
        const extra = data.participants.length - shown.length;
        strip.innerHTML = shown.map(p =>
          `<div class="avatar-mini ${p.color}" title="${p.name}">${p.avatar}</div>`
        ).join('') + (extra > 0 ? `<span class="more-count">+${extra}</span>` : '');
        meta.appendChild(strip);
      }
    }
  });
  const sOrder = { open: 0, other: 1, me: 2, done: 3 };
  const uOrder = { high: 0, medium: 1, low: 2 };
  cards.sort((a, b) => {
    const sa = sOrder[a.dataset.status] ?? 4;
    const sb = sOrder[b.dataset.status] ?? 4;
    if (sa !== sb) return sa - sb;
    return (uOrder[a.dataset.urgency] ?? 3) - (uOrder[b.dataset.urgency] ?? 3);
  });
  cards.forEach(c => list.appendChild(c));
}

/* ── Compteurs des chips ── */
function updateChipCounts() {
  const allCards = document.querySelectorAll('#screen-home .alert-card[data-alert-id]');
  const total = allCards.length;
  document.querySelectorAll('.chips-scroll .chip[data-filter]').forEach(chip => {
    const filter = chip.dataset.filter;
    let count = 0;
    allCards.forEach(card => {
      if (filter === 'all') { count++; return; }
      const cats = card.dataset.categories ? card.dataset.categories.split(' ') : [card.dataset.category];
      if (cats.includes(filter)) count++;
    });
    const badge = chip.querySelector('.chip-count');
    if (badge) badge.textContent = count;
  });
  const label = `${total} personne${total > 1 ? 's' : ''} dans le besoin`;
  const el1 = document.getElementById('radius-bar-count');
  const el2 = document.getElementById('radius-count-text');
  const el3 = document.getElementById('hero-count');
  if (el1) el1.textContent = label;
  if (el2) el2.textContent = label;
  if (el3) el3.textContent = total + ' personne' + (total > 1 ? 's' : '');
}
