/* ── Carte principale ── */
function initMap() {
  if (mapInit) return; mapInit = true;
  const map = L.map('map-leaflet', { zoomControl: false, attributionControl: false })
    .setView([48.8566, 2.3522], 14);
  window._leafletMap = map;
  setTimeout(() => map.invalidateSize(), 300);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OSM', maxZoom:19 }).addTo(map);

  const mapAlerts = [
    { pos:[48.8596,2.3477], color:'#C62828', alertId:'alert-1',  emoji:'👕', label:'Manteau homme — Urgent' },
    { pos:[48.8546,2.3572], color:'#C62828', alertId:'alert-2',  emoji:'🍞', label:'Nourriture famille — Urgent' },
    { pos:[48.8576,2.3422], color:'#F57F17', alertId:'alert-3',  emoji:'🧴', label:'Kit hygiène — Modéré' },
    { pos:[48.8516,2.3622], color:'#2E7D32', alertId:null,       emoji:'✓',  label:'Chaussures — Résolu' },
    { pos:[48.8606,2.3502], color:'#C62828', alertId:'alert-6',  emoji:'💊', label:'Médicaments — Urgent' },
    { pos:[48.8536,2.3542], color:'#C62828', alertId:'alert-8',  emoji:'🍼', label:'Lait infantile — Urgent' },
    { pos:[48.8556,2.3462], color:'#F57F17', alertId:'alert-4',  emoji:'🏠', label:'Couverture — Modéré' },
    { pos:[48.8586,2.3562], color:'#C62828', alertId:'alert-10', emoji:'🧥', label:'Manteau femme — Urgent' },
    { pos:[48.8526,2.3482], color:'#F57F17', alertId:'alert-12', emoji:'🩹', label:'Soins urgents — Modéré' },
    { pos:[48.8566,2.3612], color:'#F57F17', alertId:'alert-7',  emoji:'🥣', label:'Soupe chaude — Modéré' },
    { pos:[48.8506,2.3502], color:'#C62828', alertId:'alert-9',  emoji:'👟', label:'Chaussures taille 43' },
    { pos:[48.8616,2.3442], color:'#F57F17', alertId:'alert-13', emoji:'🏕', label:'Hébergement urgence' },
    { pos:[48.8636,2.3532], color:'#C62828', alertId:'alert-14', emoji:'⚖️', label:'Conseil juridique — Urgent' },
    { pos:[48.8576,2.3652], color:'#C62828', alertId:'alert-15', emoji:'🩺', label:'Consultation médicale — Urgent' },
    { pos:[48.8546,2.3592], color:'#C62828', alertId:'alert-16', emoji:'🧠', label:'Soutien psychologique — Urgent' },
    { pos:[48.8558,2.3498], color:'#F57F17', alertId:'alert-17', emoji:'🚌', label:'Transport — Modéré' },
    { pos:[48.8572,2.3648], color:'#F57F17', alertId:'alert-18', emoji:'🤝', label:'Accompagnement — Modéré' },
  ];

  mapAlerts.forEach(m => {
    const icon = L.divIcon({
      className: '',
      html: `<div style="background:${m.color};color:white;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:18px;border:2.5px solid white;box-shadow:0 3px 10px rgba(0,0,0,.35);cursor:pointer;transition:transform .15s;">${m.emoji}</div>`,
      iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -24],
    });
    const marker = L.marker(m.pos, { icon }).addTo(map);
    if (m.alertId) {
      marker.bindPopup(
        `<div style="font-size:13px;font-weight:700;margin-bottom:6px;min-width:150px;">${m.emoji} ${m.label}</div>
         <button onclick="openAlert('${m.alertId}');setNav('nav-home');"
           style="background:#E85D04;color:white;border:none;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;width:100%;">
           Voir le signalement →
         </button>`, { maxWidth: 220, closeButton: false });
      marker.on('click', function(e) {
        L.DomEvent.stopPropagation(e);
        openAlert(m.alertId);
        setNav('nav-home');
      });
    } else {
      marker.bindPopup(`<div style="font-size:13px;color:#2E7D32;font-weight:700;">✓ ${m.label}</div>`, { closeButton: false });
    }
  });

  window._userMarker = L.divIcon({
    className: '',
    html: `<div style="background:#1565C0;border-radius:50%;width:18px;height:18px;border:3px solid white;box-shadow:0 0 0 4px rgba(21,101,192,.25);"></div>`,
    iconSize: [18, 18], iconAnchor: [9, 9],
  });
  window._userMarker = L.marker([48.8566, 2.3522], { icon: window._userMarker, zIndexOffset: 1000 })
    .addTo(map).bindPopup('📍 Votre position');
  window._mapCircle = L.circle([48.8566,2.3522], {
    radius:3000, color:'#E85D04', fillColor:'#E85D04', fillOpacity:.07, weight:2, dashArray:'6'
  }).addTo(map);
}

function _moveUserMarker(lat, lng) {
  if (window._userMarker) window._userMarker.setLatLng([lat, lng]);
  if (window._mapCircle)  window._mapCircle.setLatLng([lat, lng]);
}

/* ── Mini carte (formulaire création) ── */
function initMapMini() {
  if (mapMiniInit) return; mapMiniInit = true;
  const map = L.map('map-mini', { zoomControl:false, attributionControl:false, dragging:false, scrollWheelZoom:false }).setView([48.8566,2.3522],15);
  window._miniMap = map;
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  window._miniMarker = L.marker([48.8566,2.3522]).addTo(map);
}

/* ── Géolocalisation ── */
function geolocateMap() {
  const btn = document.getElementById('map-geolocate-btn');
  btn.textContent = '⏳';
  btn.style.opacity = '.7';
  if (!navigator.geolocation) {
    btn.textContent = '📍'; btn.style.opacity = '1';
    centerMapOnPos(48.8566, 2.3522); return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      btn.textContent = '📍'; btn.style.opacity = '1';
      centerMapOnPos(lat, lng);
      showGeoToast();
    },
    () => {
      btn.textContent = '📍'; btn.style.opacity = '1';
      centerMapOnPos(48.8566, 2.3522);
      showGeoToast('Position par défaut : Paris');
    }
  );
}

function centerMapOnPos(lat, lng) {
  if (!mapInit || !window._leafletMap) return;
  window._leafletMap.setView([lat, lng], 15);
  if (window._userMarker) window._userMarker.setLatLng([lat, lng]);
  if (window._mapCircle)  window._mapCircle.setLatLng([lat, lng]);
}

function showGeoToast(msg) {
  const toast = document.getElementById('geo-toast');
  if (!toast) return;
  toast.textContent = msg || 'Position trouvée ✓';
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 2500);
}

function geolocateHome() {
  const btn = document.getElementById('home-geolocate-btn');
  btn.textContent = '⏳ Localisation…';
  btn.style.opacity = '.7';
  const done = (label) => { btn.innerHTML = `📍 ${label}`; btn.style.opacity = '1'; };
  if (!navigator.geolocation) { done('Paris (défaut)'); return; }
  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude.toFixed(4);
      const lng = pos.coords.longitude.toFixed(4);
      done(`${lat}, ${lng}`);
      if (mapInit && window._leafletMap) {
        window._leafletMap.setView([pos.coords.latitude, pos.coords.longitude], 14);
        if (window._userMarker) window._userMarker.setLatLng([pos.coords.latitude, pos.coords.longitude]);
        if (window._mapCircle)  window._mapCircle.setLatLng([pos.coords.latitude, pos.coords.longitude]);
      }
    },
    () => done('Position indisponible')
  );
}

/* ── Carte accueil (vue liste/carte) ── */
function switchFeedView(view) {
  const listView = document.getElementById('home-list-view');
  const mapView  = document.getElementById('home-map-view');
  window._feedView = view;
  const btnList = document.getElementById('view-btn-list');
  const btnMap  = document.getElementById('view-btn-map');
  if (view === 'map') {
    listView.style.display = 'none';
    mapView.style.display  = 'flex';
    if (btnList) { btnList.style.background = 'transparent'; btnList.style.color = '#999'; btnList.style.boxShadow = 'none'; }
    if (btnMap)  { btnMap.style.background  = '#F05A1A';     btnMap.style.color  = 'white'; btnMap.style.boxShadow = '0 2px 8px rgba(240,90,26,.3)'; }
    initHomeMap();
  } else {
    listView.style.display = '';
    mapView.style.display  = 'none';
    if (btnList) { btnList.style.background = '#F05A1A';     btnList.style.color = 'white'; btnList.style.boxShadow = '0 2px 8px rgba(240,90,26,.3)'; }
    if (btnMap)  { btnMap.style.background  = 'transparent'; btnMap.style.color  = '#999';  btnMap.style.boxShadow = 'none'; }
  }
}

function initHomeMap() {
  if (homeMapInit) { if (_homeMap) setTimeout(() => _homeMap.invalidateSize(), 100); return; }
  homeMapInit = true;
  const map = L.map('map-leaflet-home', { zoomControl:false, attributionControl:false }).setView([48.8566, 2.3522], 14);
  _homeMap = map;
  setTimeout(() => map.invalidateSize(), 250);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19 }).addTo(map);
  const pins = [
    { pos:[48.8596,2.3477], color:'#C62828', id:'alert-1',  e:'👕', l:'Manteau homme' },
    { pos:[48.8546,2.3572], color:'#C62828', id:'alert-2',  e:'🍞', l:'Nourriture famille' },
    { pos:[48.8576,2.3422], color:'#F57F17', id:'alert-3',  e:'🧴', l:'Kit hygiène' },
    { pos:[48.8516,2.3622], color:'#2E7D32', id:null,        e:'✓',  l:'Résolu' },
    { pos:[48.8606,2.3502], color:'#C62828', id:'alert-6',  e:'💊', l:'Médicaments' },
    { pos:[48.8536,2.3542], color:'#C62828', id:'alert-8',  e:'🍼', l:'Lait infantile' },
    { pos:[48.8556,2.3462], color:'#F57F17', id:'alert-4',  e:'🏠', l:'Couverture' },
    { pos:[48.8586,2.3562], color:'#C62828', id:'alert-10', e:'🧥', l:'Manteau femme' },
    { pos:[48.8526,2.3482], color:'#F57F17', id:'alert-7',  e:'🥣', l:'Soupe chaude' },
    { pos:[48.8566,2.3612], color:'#C62828', id:'alert-9',  e:'👟', l:'Chaussures' },
  ];
  pins.forEach(a => {
    const icon = L.divIcon({ className:'', iconSize:[38,38], iconAnchor:[19,19],
      html:`<div style="width:38px;height:38px;border-radius:50%;background:${a.color};border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 2px 10px rgba(0,0,0,.3);cursor:pointer;">${a.e}</div>` });
    const m = L.marker(a.pos, { icon }).addTo(map);
    m.bindTooltip(a.l, { direction:'top', offset:[0,-22] });
    if (a.id) m.on('click', () => { openAlert(a.id); });
  });
}

/* ── Slider rayon ── */
function updateRadius(val) {
  val = parseInt(val);
  const label = radiusLabels[val];
  const count = radiusCounts[val];
  const sub   = radiusSubtexts[val];
  const pill = document.getElementById('radius-pill-val');
  if (pill) pill.textContent = label;
  const barCount = document.getElementById('radius-bar-count');
  if (barCount) barCount.textContent = count === 0 ? 'Aucun signalement' : `${count} personne${count > 1 ? 's' : ''} dans le besoin`;
  const sheetDisp = document.getElementById('sheet-radius-display');
  if (sheetDisp) sheetDisp.textContent = label;
  const countEl = document.getElementById('radius-count-text');
  const subEl   = document.getElementById('radius-count-sub');
  if (countEl) countEl.textContent = count === 0 ? 'Aucun signalement dans ce rayon' : `${count} personne${count > 1 ? 's' : ''} dans le besoin`;
  if (subEl)   subEl.textContent   = `dans un rayon de ${sub} autour de vous`;
  const pct = (val / 4) * 100;
  const slider = document.getElementById('radius-slider');
  if (slider) slider.style.background = `linear-gradient(to right, var(--primary) ${pct}%, var(--border) ${pct}%)`;
  const meters = [500, 1000, 3000, 5000, 10000][val];
  if (mapInit && window._mapCircle) window._mapCircle.setRadius(meters);
  const mc = document.getElementById('map-count');
  const mr = document.getElementById('map-radius-lbl');
  if (mc) mc.textContent = `${count} signalement${count > 1 ? 's' : ''}`;
  if (mr) mr.textContent = label;
}
