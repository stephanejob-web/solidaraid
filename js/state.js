/* ── État global de l'application ── */
let navHistory = [];
let mapInit = false;
let mapMiniInit = false;
let obStep = 0;

let userRole = null;  // 'helper' | 'witness' | 'need'
let needCat = null;

let isGuest = false;
const guestBlockedScreens = [
  'screen-create-1','screen-create-2','screen-messages',
  'screen-chat','screen-profile','screen-mes-aides','screen-donate-form'
];

let _obSlide = 1;
let _obRoleSelected = null;

let currentAlertId = null;
let alertTakenBy = null;

let selectedMeetMode = null;
let creatorMode = 'helper';

let deliveryReminderTimer = null;
let presenceConfirmTimer  = null;

let selectedLateMinutes = null;

let recognition = null;
let isListening  = false;
let descMode     = 'text';

let audioRecorder = null, audioChunks = [], audioBlob = null;
let isAudioRecording = false, audioTimerInterval = null, audioSeconds = 0;

let gpsVerified       = false;
let deliverPhotoTaken = false;

let _chatAlertId         = null;
let _chatPrivateUnlocked = false;
let _groupMsgsCache      = [];
let _privateMsgsCache    = [];

let selectedRating = 0;
const ratingLabels = ['', 'Pas terrible…', 'Peut mieux faire', 'Bien', 'Très bien !', 'Excellent — merci 🙏'];

let homeMapInit = false;
let _homeMap = null;

let _personHasPhone = null;

const newAlertDraft = { categories: [], urgency: 'high', personHasPhone: null };

const locationPhotos = { 1: null, 2: null, 3: null };
const fakePhotoUrls = [
  'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=200&q=60',
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200&q=60',
  'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=200&q=60',
];

const currentUser = { name: 'Stéphane B.', avatar: 'S', color: '#E85D04' };

const radiusLabels    = ['500 m', '1 km', '3 km', '5 km', '10 km'];
const radiusCounts    = [0, 1, 4, 6, 9];
const radiusSubtexts  = ['500 mètres', '1 kilomètre', '3 km', '5 km', '10 km'];
