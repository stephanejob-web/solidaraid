/* ── Fiche signalement ── */
function openAlert(id) {
  currentAlertId = id;
  const a = alertsData[id];
  if (!a) { goTo('screen-alert-detail'); return; }
  if (a.initialState === 'other') alertTakenBy = 'other';
  else if (a.initialState === 'me') alertTakenBy = 'me';
  else alertTakenBy = null;

  const urgencyBadge = {
    high:   '<span class="badge badge-high">🔴 Urgent</span>',
    medium: '<span class="badge badge-medium">🟡 Modéré</span>',
    low:    '<span class="badge badge-low">🟢 Faible</span>'
  }[a.urgency] || '';
  const statusBadge = alertTakenBy === 'me'
    ? `<span class="badge" style="background:#E3F2FD;color:var(--secondary);">En cours — vous</span>`
    : alertTakenBy === 'other'
      ? `<span class="badge" style="background:var(--success-light);color:var(--success);">En cours</span>`
      : `<span class="badge badge-open">Ouvert</span>`;

  const needsHtml = (a.needsDetail && a.needsDetail.length)
    ? `<div style="background:var(--bg);border-radius:var(--radius-sm);padding:12px 14px;margin-bottom:14px;">
        <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">Ce dont il a besoin</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${a.needsDetail.map(n => `
            <div style="display:flex;align-items:flex-start;gap:10px;">
              <span style="font-size:20px;flex-shrink:0;">${n.icon}</span>
              <div>
                <div style="font-size:14px;font-weight:700;">${n.label}</div>
                ${n.detail ? `<div style="font-size:13px;color:var(--text-muted);margin-top:1px;">${n.detail}</div>` : ''}
              </div>
            </div>`).join('')}
        </div>
      </div>`
    : `<div style="display:flex;gap:10px;font-size:14px;margin-bottom:8px;"><span>🗂</span><span style="color:var(--text-muted);">${a.category}${a.items ? ' — ' + a.items : ''}</span></div>`;

  document.getElementById('alert-fiche').innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
      <div style="font-size:36px;flex-shrink:0;">${a.needsDetail && a.needsDetail.length > 1 ? a.needsDetail.slice(0,2).map(n=>n.icon).join('') : a.icon}</div>
      <div style="flex:1;">
        <div style="font-size:18px;font-weight:700;line-height:1.3;">${a.title}</div>
        <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;">${urgencyBadge}${statusBadge}</div>
      </div>
    </div>
    ${a.desc ? `<p style="font-size:15px;color:var(--text-muted);line-height:1.5;margin-bottom:14px;">${a.desc}</p>` : ''}
    ${needsHtml}
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div style="display:flex;gap:10px;font-size:14px;"><span>📍</span><span style="color:var(--text-muted);">${a.location} — ${a.distance}</span></div>
      <div style="display:flex;gap:10px;font-size:14px;"><span>⏱</span><span style="color:var(--text-muted);">${a.time}</span></div>
      <div style="display:flex;gap:10px;align-items:center;font-size:14px;"><span>👤</span>
        <div style="display:flex;align-items:center;gap:6px;cursor:pointer;" onclick="openOtherProfile('${a.signaler}','${a.signalerRating}','${a.signalerAvatar}','${a.signalerColor}')">
          <div class="avatar ${a.signalerColor}" style="width:24px;height:24px;font-size:12px;">${a.signalerAvatar}</div>
          <span style="color:var(--text-muted);">${a.signaler} • ⭐ ${a.signalerRating}</span>
          <span style="font-size:12px;color:var(--primary);font-weight:600;">Voir profil ›</span>
        </div>
      </div>
    </div>`;
  renderParticipants();
  renderHelpBar();
  goTo('screen-alert-detail');
}

function renderParticipants() {
  const section = document.getElementById('participants-section');
  if (!section) return;
  const a = currentAlertId ? alertsData[currentAlertId] : null;
  const list = (a && a.participants) ? [...a.participants] : [];
  if (!list.length) { section.innerHTML = ''; return; }
  const rows = list.map((p, idx) => `
    <div style="display:flex;align-items:flex-start;gap:10px;">
      <div class="avatar ${p.color}" style="width:36px;height:36px;font-size:14px;flex-shrink:0;">${p.avatar}</div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
          <span style="font-size:14px;font-weight:600;">${p.name}</span>
          <button onclick="if(requireAccount('accéder au chat')) return; openHelpChatFromAlert('${currentAlertId}',${idx})" style="font-size:12px;padding:3px 10px;background:var(--primary-light);color:var(--primary);border:1.5px solid var(--primary-mid);border-radius:20px;cursor:pointer;font-weight:600;white-space:nowrap;">💬 Chat</button>
        </div>
        <div style="font-size:12px;color:var(--text-muted);">${escapeHtml(p.status || '')}</div>
        ${p.message ? `<div style="font-size:13px;color:var(--text);font-style:italic;margin-top:4px;background:var(--bg);border-radius:8px;padding:6px 10px;">« ${escapeHtml(p.message)} »</div>` : ''}
      </div>
    </div>`).join('');
  section.innerHTML = `
    <div class="card" style="margin-bottom:12px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <div style="font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.6px;">
          👥 ${list.length} personne${list.length > 1 ? 's veulent' : ' veut'} aider
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:14px;">${rows}</div>
      <button class="btn btn-secondary" style="font-size:14px;gap:8px;" onclick="openGroupChat('${currentAlertId}')">
        💬 Discussion du groupe
      </button>
    </div>`;
}

/* ── Mise à jour de la carte feed ── */
function updateFeedCard(id, state) {
  const card = document.querySelector(`[data-alert-id="${id}"]`);
  if (!card) return;
  let banner = card.querySelector('.card-status-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.className = 'card-status-banner';
    banner.style.cssText = 'border-radius:8px;padding:7px 10px;margin-bottom:8px;display:flex;align-items:center;gap:8px;';
    const meta = card.querySelector('.alert-card-meta');
    if (meta) card.insertBefore(banner, meta);
  }
  if (state === 'me') {
    banner.style.background = '#E3F2FD';
    banner.innerHTML = `<span style="font-size:14px;">✅</span><span style="font-size:13px;font-weight:600;color:var(--secondary);">Pris en charge par ${currentUser.name} — en route</span>`;
  } else if (state === 'cancelled') {
    banner.remove();
  }
}

/* ── Résolution ── */
function resolveCurrentAlert() {
  if (currentAlertId && alertsData[currentAlertId]) {
    alertsData[currentAlertId].initialState = 'done';
  }
  const card = document.querySelector(`[data-alert-id="${currentAlertId}"]`);
  if (card) {
    card.style.opacity = '.75';
    card.dataset.status = 'done';
    card.querySelectorAll('.card-status-banner').forEach(b => b.remove());
    card.querySelectorAll('.badge-high,.badge-medium,.badge-low,.badge-open').forEach(b => {
      b.className = 'badge badge-done'; b.textContent = '✓ Résolu';
    });
  }
  closeSheet('sheet-resolve');
  goTo('screen-home');
  setTimeout(() => showToast('✅ Signalement marqué comme résolu'), 300);
}

/* ── Barre d'aide ── */
function resetHelpBar() {
  const id = currentAlertId;
  const a = id ? alertsData[id] : null;
  if (a) {
    if (a.initialState === 'other') alertTakenBy = 'other';
    else if (a.initialState === 'me') alertTakenBy = 'me';
    else alertTakenBy = null;
  } else {
    alertTakenBy = null;
  }
  renderHelpBar();
  document.querySelectorAll('.help-type-btn').forEach(b => b.classList.remove('selected'));
}

function renderHelpBar() {
  const bar = document.getElementById('help-bar');
  if (!bar) return;
  bar.style.padding = '12px 16px 20px';

  if (!alertTakenBy) {
    bar.innerHTML = `<button class="btn btn-primary" style="font-size:17px;border-radius:14px;" onclick="if(requireAccount('aider')) return; openSheet('sheet-help')">🙋 Je peux aider</button>`;

  } else if (alertTakenBy === 'me') {
    const aMe = currentAlertId ? alertsData[currentAlertId] : null;
    const myMsg = aMe && aMe.myHelpMessage ? aMe.myHelpMessage : '';
    const subtitle = myMsg ? myMsg : 'Disponible pour aider';
    bar.innerHTML = `
      <div class="taken-bar" style="background:var(--success-light);border-color:var(--success);align-items:flex-start;">
        <div class="taken-avatar" style="background:${currentUser.color};">${currentUser.avatar}</div>
        <div class="taken-info" style="min-width:0;">
          <strong>✅ ${currentUser.name} s'en occupe</strong>
          <span style="display:block;white-space:normal;${myMsg ? 'font-style:italic;color:var(--text);' : ''}">${myMsg ? '« ' + escapeHtml(myMsg) + ' »' : subtitle}</span>
        </div>
        <button class="btn btn-sm btn-secondary" style="white-space:nowrap;font-size:12px;flex-shrink:0;" onclick="cancelTaken()">Annuler</button>
      </div>
      <div style="display:flex;gap:8px;margin-top:10px;">
        <button class="btn btn-success" style="flex:1;font-size:14px;" onclick="openSheet('sheet-deliver')">📦 Remis</button>
        <button class="btn btn-secondary" style="font-size:14px;" onclick="openSheet('sheet-late')">⏰ Retard</button>
        <button class="btn btn-secondary" style="font-size:14px;" onclick="openPrivateChat('sophie');setNav('nav-msg')">💬</button>
      </div>
      <button class="btn" style="margin-top:8px;font-size:13px;background:var(--danger-light);color:var(--danger);border:1.5px solid var(--danger);" onclick="cancelTaken()">✕ Je ne peux plus venir</button>`;

  } else if (alertTakenBy === 'delivered') {
    bar.innerHTML = `
      <div style="background:#E8F5E9;border:1.5px solid var(--success);border-radius:var(--radius);padding:14px 16px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <span style="font-size:24px;">🙏</span>
          <div>
            <div style="font-weight:700;color:var(--success);font-size:15px;">Remise confirmée par vous</div>
            <div style="font-size:13px;color:var(--text-muted);">En attente de confirmation du signalant (24h)</div>
          </div>
        </div>
        <div style="background:white;border-radius:8px;padding:10px 12px;font-size:13px;color:var(--text-muted);display:flex;align-items:flex-start;gap:8px;">
          <span>ℹ️</span>
          <span>Julien M. sera notifié et peut confirmer la remise. Sans réponse de sa part, l'alerte sera <strong>résolue automatiquement dans 24h</strong>.</span>
        </div>
      </div>`;

  } else {
    const a = currentAlertId ? alertsData[currentAlertId] : null;
    const otherName = a && a.takenByOther ? a.takenByOther : "Quelqu'un";
    const otherEta  = a && a.takenByOtherEta ? a.takenByOtherEta : 'en route';
    bar.innerHTML = `
      <div class="taken-bar">
        <div class="taken-avatar" style="background:var(--secondary);">${otherName.charAt(0)}</div>
        <div class="taken-info">
          <strong>✋ Déjà pris en charge par ${otherName}</strong>
          <span>${otherEta}</span>
        </div>
      </div>
      <button class="btn btn-secondary" style="margin-top:10px;font-size:14px;" onclick="openSheet('sheet-help-backup')">
        Proposer en backup si besoin
      </button>`;
  }
}
