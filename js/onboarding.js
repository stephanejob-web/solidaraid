/* ── Sélection de rôle (ancienne route) ── */
function selectRole(role) {
  userRole = role;
  goTo('screen-login');
}

/* ── Parcours "Demander de l'aide pour moi" ── */
function selectNeedCat(el) {
  document.querySelectorAll('#need-cats .cat-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  needCat = el.dataset.need;
}

function useMyLocationNeed() {
  showToast('📍 Position détectée');
  const input = document.getElementById('need-address');
  if (input) input.value = 'Ma position actuelle';
}

function submitNeedHelp() {
  if (!needCat) { showToast("Choisissez un type d'aide"); return; }
  showToast("💚 Votre demande est publiée. Vous serez notifié·e dès qu'une réponse arrive.");
  setTimeout(() => { goToApp(); }, 900);
}

/* ── Onboarding slides ── */
function obNext() {
  if (_obSlide === 3) {
    if (!_obRoleSelected) { showToast('Choisis ton rôle pour continuer 👆'); return; }
    userRole = _obRoleSelected;
    goTo('screen-register');
    return;
  }
  document.getElementById('ob-slide-' + _obSlide).classList.remove('active');
  _obSlide++;
  document.getElementById('ob-slide-' + _obSlide).classList.add('active');
  document.querySelectorAll('.ob-dot').forEach((d, i) => d.classList.toggle('active', i === _obSlide - 1));
  if (_obSlide === 3) document.getElementById('ob-next-btn').textContent = 'Commencer →';
}

function selectObRole(role, el) {
  _obRoleSelected = role;
  document.querySelectorAll('.ob-role-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  const icons  = { helper:'🙋', need:'🆘', witness:'👁️' };
  const labels = { helper:'Aidant', need:"Demande d'aide", witness:'Signaleur' };
  const iconEl  = document.getElementById('register-role-icon');
  const labelEl = document.getElementById('register-role-label');
  if (iconEl)  iconEl.textContent  = icons[role]  || '🙋';
  if (labelEl) labelEl.textContent = labels[role] || 'Aidant';
}

/* ── Routage après authentification ── */
function routeAfterAuth() {
  localStorage.setItem('humeo_onboarded', '1');
  if (userRole === 'need') {
    navHistory = []; goTo('screen-need-help'); return;
  }
  if (userRole === 'witness') {
    navHistory = []; goTo('screen-home'); setNav('nav-home');
    setTimeout(() => showToast('👀 Appuie sur ＋ pour signaler une personne'), 600); return;
  }
  goToApp();
}

function forgotPassword() {
  showToast('📧 Un lien de réinitialisation a été envoyé');
}
