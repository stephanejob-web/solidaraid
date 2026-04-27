/* ── Mes aides ── */
function renderMesAides() {
  const urgBadge = {
    high:   '<span class="badge badge-high">🔴 Urgent</span>',
    medium: '<span class="badge badge-medium">🟡 Modéré</span>',
    low:    '<span class="badge badge-low">🟢 Faible</span>'
  };

  /* Section "Mes signalements" */
  const sigSection   = document.getElementById('mes-signalements-section');
  const sigContainer = document.getElementById('mes-signalements-en-cours');
  if (sigSection && sigContainer) {
    const mySignalements = Object.entries(alertsData).filter(([, a]) => a.createdByMe && a.initialState !== 'done');
    if (mySignalements.length > 0) {
      sigSection.style.display = '';
      sigContainer.innerHTML = mySignalements.map(([id, a]) =>
        `<div class="card" style="cursor:pointer;margin-bottom:10px;" onclick="openAlert('${id}')">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:26px;">${a.icon || '🆘'}</span>
              <div>
                <div style="font-weight:700;font-size:14px;">${a.title}</div>
                <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${a.location || 'Position actuelle'}</div>
              </div>
            </div>
            ${urgBadge[a.urgency] || ''}
          </div>
          <div style="display:flex;align-items:center;gap:8px;padding-top:10px;border-top:1px solid var(--border-light);">
            <span class="badge badge-open" style="font-size:11px;">Ouvert</span>
            <span style="font-size:12px;color:var(--text-muted);margin-left:auto;">⏱ ${a.time || "À l'instant"}</span>
            <button class="card-chat-btn" onclick="event.stopPropagation();openAlertChatFromCard('${id}')">💬 Chat</button>
          </div>
        </div>`
      ).join('');
    } else {
      sigSection.style.display = 'none';
    }
  }

  /* Section "Aides en cours" */
  const container = document.getElementById('mes-aides-en-cours');
  if (!container) return;
  const active = Object.entries(alertsData).filter(([, a]) => a.initialState === 'me');
  if (!active.length) {
    container.innerHTML = '<div style="text-align:center;padding:24px 0;color:var(--text-muted);font-size:14px;">Aucune aide en cours<br><span style="font-size:12px;">Explore le feed pour aider quelqu\'un 🙋</span></div>';
    return;
  }
  container.innerHTML = active.map(([id, a]) => {
    const signaler = a.signaler || 'Signaleur';
    const sAvatar  = a.signalerAvatar || 'S';
    const sColor   = a.signalerColor  || 'av-orange';
    return `<div class="card" style="cursor:pointer;margin-bottom:10px;" onclick="openAlert('${id}')">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:26px;">${a.icon || '🆘'}</span>
          <div>
            <div style="font-weight:700;font-size:14px;">${a.title}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${a.location || ''}</div>
          </div>
        </div>
        <span class="badge badge-open">En cours</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;padding-top:10px;border-top:1px solid var(--border-light);">
        <div class="avatar ${sColor}" style="width:24px;height:24px;font-size:11px;">${sAvatar}</div>
        <span style="font-size:12px;color:var(--text-muted);flex:1;">${signaler}</span>
        <button class="card-chat-btn" onclick="event.stopPropagation();openAlertChatFromCard('${id}')">💬 Chat</button>
      </div>
    </div>`;
  }).join('');
}

function updateAidesBadge() {
  const badge = document.getElementById('nav-aides-badge');
  if (!badge) return;
  const count = Object.values(alertsData).filter(a => a.initialState === 'me').length
              + Object.values(alertsData).filter(a => a.createdByMe && a.initialState === 'open').length;
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

function renderMyAlerts() {
  const container = document.getElementById('my-alerts-dynamic');
  if (!container) return;
  const urgBadge = {
    high:   '<span class="badge badge-high">🔴</span>',
    medium: '<span class="badge badge-medium">🟡</span>',
    low:    '<span class="badge badge-low">🟢</span>'
  };
  const mine = Object.entries(alertsData).filter(([, a]) => a.createdByMe && a.initialState !== 'done');
  if (!mine.length) { container.innerHTML = ''; return; }
  container.innerHTML = mine.map(([id, a]) =>
    `<div class="card" style="cursor:pointer;margin-bottom:12px;" onclick="openAlert('${id}')">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
        <span style="font-size:30px;">${a.icon || '🆘'}</span>
        <div style="flex:1;">
          <div style="font-weight:700;font-size:15px;">${a.title}</div>
          <div style="font-size:13px;color:var(--text-muted);">${a.location || 'Position actuelle'} — ${a.time || "À l'instant"}</div>
        </div>
        ${urgBadge[a.urgency] || ''}
      </div>
      <div style="background:var(--primary-light);border-radius:8px;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;">
        <div style="font-size:14px;font-weight:600;color:var(--primary);">✨ Publié à l'instant</div>
        <button class="card-chat-btn" onclick="event.stopPropagation();openAlertChatFromCard('${id}')">💬 Chat</button>
      </div>
    </div>`
  ).join('');
}

/* ── Aides en cours (bar accueil) ── */
function getActiveHelps() {
  return Object.entries(alertsData).filter(([, a]) => a.initialState === 'me');
}

function updateActiveHelpsBar() {
  const helps = getActiveHelps();
  const bar = document.getElementById('active-helps-bar');
  if (!bar) return;
  if (helps.length === 0) { bar.style.display = 'none'; return; }
  bar.style.display = 'flex';
  const lbl = document.getElementById('active-helps-label');
  if (lbl) lbl.textContent = helps.length === 1 ? '1 aide en cours' : `${helps.length} aides en cours`;
}

function renderActiveHelpsList() {
  const list = document.getElementById('active-helps-list');
  if (!list) return;
  const helps = getActiveHelps();
  if (helps.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:14px;">Aucune aide en cours.</div>';
    return;
  }
  list.innerHTML = helps.map(([id, a]) => `
    <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border-light);cursor:pointer;"
         onclick="closeSheet('sheet-active-helps');openAlert('${id}');setNav('nav-home')">
      <div style="width:44px;height:44px;border-radius:12px;background:var(--primary-light);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${a.icon}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:14px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${a.title}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">📍 ${a.location}</div>
        <div style="font-size:12px;color:var(--primary);font-weight:600;margin-top:3px;">🙋 Tu aides · ${a.time}</div>
      </div>
      <span style="font-size:20px;color:var(--primary);font-weight:700;flex-shrink:0;">›</span>
    </div>
  `).join('');
}
