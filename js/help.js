/* ── Deadline & reminders ── */
function initDeadlineInput() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  const dateInput = document.getElementById('help-deadline-date');
  const timeInput = document.getElementById('help-deadline-time');
  if (dateInput) dateInput.value = now.toISOString().slice(0,10);
  if (timeInput) timeInput.value = now.toTimeString().slice(0,5);
}

function scheduleDeliveryReminder() {
  if (deliveryReminderTimer) clearTimeout(deliveryReminderTimer);
  const input = document.getElementById('help-deadline-time');
  if (!input || !input.value) return;
  const [h, m] = input.value.split(':').map(Number);
  const deadline = new Date();
  deadline.setHours(h, m, 0, 0);
  const delay = deadline - Date.now();
  if (delay <= 0) return;
  deliveryReminderTimer = setTimeout(() => {
    if (alertTakenBy === 'me') showToast("⏰ Il est l'heure — avez-vous remis l'aide ? Pensez à confirmer la remise.", 6000);
  }, delay);
}

/* ── Confirmation présence ── */
function schedulePresenceConfirm() {
  if (selectedMeetMode !== 'place') return;
  if (presenceConfirmTimer) clearTimeout(presenceConfirmTimer);
  presenceConfirmTimer = setTimeout(() => { openSheet('sheet-presence-confirm'); }, 3000);
}

function confirmPresence() {
  closeSheet('sheet-presence-confirm');
  const bar    = document.getElementById('chat-home-actions');
  const status = document.getElementById('chat-presence-status');
  if (bar && status) {
    bar.style.display = 'block';
    status.innerHTML =
      '<div style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--success);">' +
        '<span style="width:8px;height:8px;border-radius:50%;background:var(--success);display:inline-block;flex-shrink:0;animation:pulse-dot 1.5s infinite;"></span>' +
        'Aidant confirmé — il sera bien présent' +
        '<button onclick="openSheet(\'sheet-no-show\')" style="margin-left:auto;background:none;border:none;font-size:12px;color:var(--text-muted);cursor:pointer;text-decoration:underline;padding:0;white-space:nowrap;">Absent ?</button>' +
      '</div>';
  }
  _addChatSystemMsg('<span style="background:var(--success-light);color:var(--success);font-size:12px;font-weight:700;padding:6px 14px;border-radius:999px;">🟢 Présence confirmée — la personne peut se déplacer</span>');
  showToast('✅ Présence confirmée ! La personne peut venir.', 4000);
}

function cancelPresence() {
  closeSheet('sheet-presence-confirm');
  _addChatSystemMsg('<span style="background:var(--danger-light);color:var(--danger);font-size:12px;font-weight:700;padding:6px 14px;border-radius:999px;">❌ Aide annulée — le signaleur a été prévenu</span>');
  showToast("Aide annulée. Le signaleur a été prévenu, l'alerte est re-ouverte.", 5000);
}

function reportNoShow() {
  closeSheet('sheet-no-show');
  const status = document.getElementById('chat-presence-status');
  if (status) {
    status.innerHTML =
      '<div style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--warning);">' +
        '<span>😔</span> Absence signalée — le signaleur vérifie la situation' +
      '</div>';
  }
  _addChatSystemMsg('<span style="background:var(--warning-light);color:var(--warning);font-size:12px;font-weight:700;padding:6px 14px;border-radius:999px;">😔 Personne absente — le signaleur a été notifié</span>');
  showToast('📩 Le signaleur a été notifié', 4000);
}

/* ── Liens chat ── */
function sendChatInviteSMS() {
  closeSheet('sheet-chat-invite');
  showToast('📲 SMS envoyé avec le lien du chat', 3000);
}

function copyChatLink() {
  showToast('🔗 Lien copié !', 2000);
}

function _addChatSystemMsg(html) {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.style.cssText = 'text-align:center;margin:12px 0;';
  div.innerHTML = html;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

/* ── Retard ── */
function selectLateDelay(el, minutes) {
  document.querySelectorAll('#sheet-late .chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  selectedLateMinutes = minutes;
  const btn = document.getElementById('late-confirm-btn');
  if (btn) { btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; }
}

function confirmLate() {
  if (!selectedLateMinutes) return;
  closeSheet('sheet-late');
  showToast(`⏰ Retard signalé — vous arriverez dans ${selectedLateMinutes} min`);
  if (deliveryReminderTimer) clearTimeout(deliveryReminderTimer);
  deliveryReminderTimer = setTimeout(() => {
    if (alertTakenBy === 'me') showToast("⏰ C'est l'heure — avez-vous remis l'aide ?", 6000);
  }, selectedLateMinutes * 60 * 1000);
  selectedLateMinutes = null;
}

/* ── Mode aide ── */
function setCreatorMode(mode) {
  creatorMode = mode;
  document.getElementById('creator-helper').classList.toggle('selected', mode === 'helper');
  document.getElementById('creator-self').classList.toggle('selected', mode === 'self');
}

function selectMeetMode(mode) {
  selectedMeetMode = mode;
  ['move','place'].forEach(m => { const el = document.getElementById('mode-'+m); if (el) el.classList.toggle('selected', m === mode); });
  const btn = document.getElementById('help-mode-next-btn');
  if (btn) { btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; }
}

function goToHelpStep2() {
  if (!selectedMeetMode) return;
  document.getElementById('help-step-1').style.display = 'none';
  document.getElementById('help-step-2').style.display = 'block';
  initDeadlineInput();
  const titles = { move:'🚶 Je me déplace sur place', place:'📍 Je propose un lieu' };
  document.getElementById('help-step2-title').textContent = titles[selectedMeetMode] || '';
  const addrSec = document.getElementById('help-address-section');
  const bizSec  = document.getElementById('help-biz-section');
  if (addrSec) addrSec.style.display = 'none';
  if (bizSec)  bizSec.style.display  = 'none';
  if (selectedMeetMode === 'place' && addrSec) {
    addrSec.style.display = 'block';
    document.getElementById('help-address-label').textContent = 'Adresse du lieu proposé';
    document.getElementById('help-address-input').placeholder = 'ex : 12 rue des Lilas, Paris… café, local associatif…';
    document.getElementById('help-address-note').textContent = 'Partagée uniquement avec la personne aidée.';
  }
}

function backToHelpStep1() {
  document.getElementById('help-step-1').style.display = 'block';
  document.getElementById('help-step-2').style.display = 'none';
}

function useCurrentLocationUpdate() {
  document.getElementById('update-position-input').value = 'Position GPS détectée — Paris';
  showToast('📡 Position GPS détectée');
}

function confirmPositionUpdate() {
  const val = document.getElementById('update-position-input').value.trim();
  if (!val) { showToast('⚠️ Veuillez indiquer un lieu'); return; }
  closeSheet('sheet-update-position');
  showToast('📍 Position mise à jour — les aidants verront votre nouvelle adresse');
}

function toggleHelpCommit() {
  const cb  = document.getElementById('help-commit');
  const btn = document.getElementById('help-submit-btn');
  if (!cb || !btn) return;
  if (cb.checked) { btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; }
  else { btn.style.opacity = '.4'; btn.style.pointerEvents = 'none'; }
}

function submitHelp() {
  const msgEl   = document.getElementById('help-message');
  const message = msgEl ? msgEl.value.trim() : '';
  scheduleDeliveryReminder();
  closeSheet('sheet-help');
  alertTakenBy = 'me';
  if (currentAlertId && alertsData[currentAlertId]) {
    const a = alertsData[currentAlertId];
    a.initialState   = 'me';
    a.myHelpMessage  = message;
    delete a.takenByOther;
    if (!a.participants) a.participants = [];
    const status   = 'Disponible pour aider';
    const existing = a.participants.find(p => p.name === currentUser.name);
    if (existing) {
      existing.status  = status;
      existing.message = message;
    } else {
      a.participants.unshift({ name: currentUser.name, avatar: currentUser.avatar, color: 'av-orange', status, message, meetMode: selectedMeetMode });
    }
    renderParticipants();
  }
  renderHelpBar();
  if (msgEl) msgEl.value = '';
  updateFeedCard(currentAlertId, 'me');
  updateAidesBadge();
  const _aid = currentAlertId, _msg = message, _mode = selectedMeetMode;
  setTimeout(() => openHelpChat(_aid, currentUser.name, currentUser.avatar, 'av-orange', _msg, _mode), 350);
  const fiche = document.getElementById('alert-fiche');
  if (fiche) {
    const a = alertsData[currentAlertId];
    if (a) {
      const badges = fiche.querySelectorAll('.badge');
      badges.forEach(b => {
        if (b.textContent.includes('Ouvert') || b.textContent.includes('cours'))
          b.outerHTML = `<span class="badge" style="background:#E3F2FD;color:var(--secondary);">En cours — vous</span>`;
      });
    }
  }
  updateActiveHelpsBar();
}

function cancelTaken() {
  alertTakenBy = null;
  if (currentAlertId && alertsData[currentAlertId]) {
    alertsData[currentAlertId].initialState = 'open';
  }
  updateFeedCard(currentAlertId, 'cancelled');
  renderHelpBar();
}

/* ── Confirmation remise GPS ── */
function simulateGpsCheck() {
  const icon  = document.getElementById('deliver-gps-icon');
  const title = document.getElementById('deliver-gps-title');
  const sub   = document.getElementById('deliver-gps-sub');
  const btn   = document.getElementById('deliver-gps-btn');
  const box   = document.getElementById('deliver-gps-check');
  if (!btn) return;
  btn.textContent = '⏳';
  btn.disabled = true;
  setTimeout(() => {
    gpsVerified = true;
    if (icon)  icon.textContent = '✅';
    if (title) { title.textContent = 'Position vérifiée — sur place'; title.style.color = 'var(--success)'; }
    if (sub)   sub.textContent = 'À environ 85 m du lieu signalé';
    if (box)   { box.style.background = 'var(--success-light)'; box.style.border = '1.5px solid var(--success)'; box.style.borderStyle = 'solid'; }
    if (btn)   btn.style.display = 'none';
    const gi = document.getElementById('check-gps-icon');
    const gl = document.getElementById('check-gps-label');
    if (gi) gi.textContent = '✅';
    if (gl) gl.style.color = 'var(--success)';
    checkDeliverReady();
  }, 1400);
}

function takeDeliverPhoto() {
  deliverPhotoTaken = true;
  const names = ['photo_remise_001.jpg','img_colis.jpg','preuve_remise.jpg','aide_remise.jpg'];
  const name = names[Math.floor(Math.random() * names.length)];
  document.getElementById('deliver-photo-idle').style.display = 'none';
  document.getElementById('deliver-photo-preview').style.display = 'block';
  document.getElementById('deliver-photo-label').textContent = name;
  const box = document.getElementById('deliver-photo-check');
  if (box) { box.style.background = 'var(--success-light)'; box.style.borderColor = 'var(--success)'; box.style.borderStyle = 'solid'; }
  const pi = document.getElementById('check-photo-icon');
  const pl = document.getElementById('check-photo-label');
  if (pi) pi.textContent = '✅';
  if (pl) pl.style.color = 'var(--success)';
  checkDeliverReady();
}

function removeDeliverPhoto() {
  deliverPhotoTaken = false;
  document.getElementById('deliver-photo-idle').style.display = 'flex';
  document.getElementById('deliver-photo-preview').style.display = 'none';
  const box = document.getElementById('deliver-photo-check');
  if (box) { box.style.background = 'var(--bg)'; box.style.borderColor = 'var(--border)'; box.style.borderStyle = 'dashed'; }
  const pi = document.getElementById('check-photo-icon');
  const pl = document.getElementById('check-photo-label');
  if (pi) pi.textContent = '⭕';
  if (pl) pl.style.color = 'var(--text-muted)';
  checkDeliverReady();
}

function checkDeliverReady() {
  const btn = document.getElementById('deliver-confirm-btn');
  if (!btn) return;
  btn.style.opacity      = (gpsVerified && deliverPhotoTaken) ? '1' : '.4';
  btn.style.pointerEvents = (gpsVerified && deliverPhotoTaken) ? 'auto' : 'none';
}

function confirmDelivery() {
  closeSheet('sheet-deliver');
  gpsVerified = false; deliverPhotoTaken = false;
  setTimeout(() => {
    const icon       = document.getElementById('deliver-gps-icon');
    const title      = document.getElementById('deliver-gps-title');
    const sub        = document.getElementById('deliver-gps-sub');
    const btn        = document.getElementById('deliver-gps-btn');
    const box        = document.getElementById('deliver-gps-check');
    const confirmBtn = document.getElementById('deliver-confirm-btn');
    if (icon)       icon.textContent  = '📍';
    if (title)    { title.textContent = 'Position GPS'; title.style.color = 'var(--primary)'; }
    if (sub)        sub.textContent   = 'Confirmez que vous êtes bien sur place';
    if (box)      { box.style.background = 'var(--primary-light)'; box.style.border = ''; }
    if (btn)      { btn.textContent = 'Vérifier'; btn.disabled = false; btn.style.display = ''; }
    if (confirmBtn) { confirmBtn.style.opacity = '.4'; confirmBtn.style.pointerEvents = 'none'; }
    const photoBox = document.getElementById('deliver-photo-check');
    if (photoBox) { photoBox.style.background = 'var(--bg)'; photoBox.style.borderColor = 'var(--border)'; photoBox.style.borderStyle = 'dashed'; }
    const idle = document.getElementById('deliver-photo-idle');
    const prev = document.getElementById('deliver-photo-preview');
    if (idle) idle.style.display = 'flex';
    if (prev) prev.style.display = 'none';
    ['check-gps-icon','check-photo-icon'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '⭕'; });
    ['check-gps-label','check-photo-label'].forEach(id => { const el = document.getElementById(id); if (el) el.style.color = 'var(--text-muted)'; });
  }, 400);
  _addChatSystemMsg('📦 <strong>L\'aidant confirme avoir remis l\'aide.</strong><br><span style="color:var(--text-muted);font-size:13px;">En attente de validation GPS du contact…</span>');
  const a = currentAlertId ? alertsData[currentAlertId] : null;
  document.getElementById('geo-validate-address').textContent = (a && a.address) ? a.address : 'Lieu de remise';
  document.getElementById('geo-state-idle').style.display    = 'block';
  document.getElementById('geo-state-loading').style.display = 'none';
  document.getElementById('geo-state-ok').style.display      = 'none';
  document.getElementById('geo-state-far').style.display     = 'none';
  document.getElementById('geo-cancel-btn').style.display    = 'block';
  openSheet('sheet-geo-validate');
}

function startRecipientGeoValidation() {
  document.getElementById('geo-state-idle').style.display    = 'none';
  document.getElementById('geo-state-loading').style.display = 'block';
  document.getElementById('geo-cancel-btn').style.display    = 'none';
  setTimeout(() => { const bar = document.getElementById('geo-progress-bar'); if (bar) bar.style.width = '95%'; }, 50);
  setTimeout(() => {
    document.getElementById('geo-state-loading').style.display = 'none';
    const isClose = Math.random() > 0.2;
    if (isClose) {
      const m = Math.floor(Math.random() * 280) + 40;
      document.getElementById('geo-distance-ok').textContent = `À environ ${m} m du lieu de remise — position validée`;
      document.getElementById('geo-state-ok').style.display = 'block';
    } else {
      const km = (Math.random() * 1.5 + 0.6).toFixed(1);
      document.getElementById('geo-distance-far').textContent = `Position à ${km} km du lieu de remise`;
      document.getElementById('geo-state-far').style.display = 'block';
    }
    document.getElementById('geo-cancel-btn').style.display = 'block';
  }, 2000);
}

function validateDeliveryGeo() {
  closeSheet('sheet-geo-validate');
  if (currentAlertId && alertsData[currentAlertId]) alertsData[currentAlertId].status = 'done';
  _addChatSystemMsg(
    '<div style="background:var(--success-light);border-radius:10px;padding:12px;">' +
    '✅ <strong style="color:var(--success);">Remise validée par GPS</strong><br>' +
    '<span style="font-size:13px;color:var(--success);">La position du contact correspond au lieu de remise.<br>L\'aide est marquée comme effectuée. Merci 🙏</span>' +
    '</div>'
  );
  showToast('🎉 Remise validée ! Merci pour votre aide.', 3000);
  alertTakenBy = 'delivered';
  renderHelpBar();
  const aRate = currentAlertId ? alertsData[currentAlertId] : null;
  if (aRate) {
    const nameEl   = document.getElementById('rating-name');
    const avatarEl = document.getElementById('rating-avatar');
    if (nameEl)   nameEl.textContent = aRate.signaler;
    if (avatarEl) {
      avatarEl.textContent = aRate.signalerAvatar;
      avatarEl.className   = 'avatar ' + (aRate.signalerColor || 'av-orange');
      avatarEl.style.cssText = 'width:52px;height:52px;font-size:22px;';
    }
  }
  selectedRating = 0;
  document.querySelectorAll('.star-btn').forEach(s => s.style.filter = 'grayscale(1)');
  const lbl = document.getElementById('rating-label');
  if (lbl) lbl.textContent = '';
  const submitBtn = document.getElementById('rating-submit-btn');
  if (submitBtn) submitBtn.disabled = true;
  goTo('screen-rating');
}
