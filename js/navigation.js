/* ── Navigation ── */
function goTo(id) {
  if (isGuest && guestBlockedScreens.includes(id)) {
    requireAccount('accéder à cette section');
    return;
  }
  closeAllSheets();
  const prev = document.querySelector('.screen.active');
  if (prev) { prev.classList.remove('active'); navHistory.push(prev.id); }
  const next = document.getElementById(id);
  if (next) next.classList.add('active');
  const noNavScreens = [
    'screen-splash','screen-ob','screen-login','screen-register',
    'screen-create-1','screen-create-2','screen-create-success',
    'screen-chat','screen-rating'
  ];
  document.getElementById('bottom-nav').classList.toggle('visible', !noNavScreens.includes(id));
  if (id === 'screen-map')          initMap();
  if (id === 'screen-create-1')     initMapMini();
  if (id === 'screen-alert-detail') resetHelpBar();
  if (id === 'screen-mes-aides')    renderMesAides();
  if (id === 'screen-my-alerts')    renderMyAlerts();
}

function goBack() {
  if (!navHistory.length) return;
  const target = navHistory.pop();
  goTo(target);
  if (target === 'screen-home') switchFeedView(window._feedView || 'list');
}

function goToApp() {
  localStorage.setItem('humeo_onboarded', '1');
  navHistory = [];
  goTo('screen-home');
  setNav('nav-home');
  switchFeedView('list');
  updateAidesBadge();
}

function goToMap() { goTo('screen-map'); setNav('nav-map'); }

function setNav(activeId) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const el = document.getElementById(activeId);
  if (el) el.classList.add('active');
}

/* ── Mode invité ── */
function enterAsGuest() {
  isGuest = true;
  localStorage.setItem('humeo_onboarded', '1');
  goToApp();
  setTimeout(showGuestBanner, 200);
}

function showGuestBanner() {
  if (!isGuest) return;
  let b = document.getElementById('guest-banner');
  if (b) return;
  b = document.createElement('div');
  b.id = 'guest-banner';
  b.style.cssText = 'position:absolute;top:0;left:0;right:0;z-index:300;background:var(--primary-light);color:var(--primary-dark);padding:8px 16px;font-size:13px;font-weight:600;text-align:center;border-bottom:1px solid var(--primary-mid);cursor:pointer;';
  b.innerHTML = '👁️ Mode visiteur — <u>Créer un compte</u> pour signaler ou aider';
  b.onclick = () => goTo('screen-register');
  document.getElementById('phone').appendChild(b);
}

function requireAccount(action) {
  if (!isGuest) return false;
  showToast('👁️ Créez un compte pour ' + action);
  return true;
}
