"use strict";

const STORE_KEY = "qatra_pro_final";
let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  lang: 'ar', dark: true, glass: true, notif: true, interval: '0', schedules: []
};

// --- نظام اللغات (يحفظ تلقائياً) ---
const dict = {
  ar: { app_title: "قطرة", quote_of_day: "اقتباس اليوم", send_drop: "أرسل لي قطرة الآن ✦", activity_week: "نشاط هذا الأسبوع", meditation: "تأمل", settings: "إعدادات", library: "اقتباسات", home: "الرئيسية", qatra: "قطرة", quotes: "اقتباسات", glass_mode: "تأثير الزجاج", dark_mode: "الوضع الداكن", language: "لغة التطبيق", enable_notifications: "تفعيل الإشعارات" },
  en: { app_title: "Qatra", quote_of_day: "Quote of the Day", send_drop: "Send Drop Now ✦", activity_week: "This Week's Activity", meditation: "Meditate", settings: "Settings", library: "Library", home: "Home", qatra: "Qatra", quotes: "Quotes", glass_mode: "Glass Effect", dark_mode: "Dark Mode", language: "Language", enable_notifications: "Enable Notifications" },
  fr: { app_title: "Qatra", quote_of_day: "Citation du Jour", send_drop: "Envoyer une Goutte ✦", activity_week: "Activité de la Semaine", meditation: "Méditer", settings: "Paramètres", library: "Bibliothèque", home: "Accueil", qatra: "Qatra", quotes: "Citations", glass_mode: "Effet Verre", dark_mode: "Mode Sombre", language: "Langue", enable_notifications: "Activer les Notifications" },
  es: { app_title: "Qatra", quote_of_day: "Frase del Día", send_drop: "Enviar Gota Ahora ✦", activity_week: "Actividad de la Semana", meditation: "Meditar", settings: "Ajustes", library: "Biblioteca", home: "Inicio", qatra: "Qatra", quotes: "Frases", glass_mode: "Efecto Cristal", dark_mode: "Modo Oscuro", language: "Idioma", enable_notifications: "Activar Notificaciones" },
  de: { app_title: "Qatra", quote_of_day: "Zitat des Tages", send_drop: "Tropfen Senden ✦", activity_week: "Aktivität der Woche", meditation: "Meditieren", settings: "Einstellungen", library: "Bibliothek", home: "Start", qatra: "Qatra", quotes: "Zitate", glass_mode: "Glaseffekt", dark_mode: "Dunkelmodus", language: "Sprache", enable_notifications: "Benachrichtigungen Aktivieren" }
};

function applyLang() {
  document.documentElement.dir = (state.lang === 'ar') ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = dict[state.lang][el.getAttribute('data-i18n')] || el.textContent;
  });
}

// --- مكتبة ضخمة للأذكار والعبارات ---
const libraryContent = [
  "سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين.", "اللهم إنك عفو تحب العفو فاعف عني.",
  "حسبي الله لا إله إلا هو، عليه توكلت وهو رب العرش العظيم.", "لا حول ولا قوة إلا بالله.", "اللهم صل وسلم وبارك على نبينا محمد.",
  "استغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه.", "يا حي يا قيوم برحمتك أستغيث.", "اللهم إني أسألك الجنة وأعوذ بك من النار.",
  "لا يلزم أن تكون كل خطواتك كبيرة؛ المهم أن تواصل السير.", "تمهّل، فلكل مرحلة حكمتها.", "القليل المستمر يصنع أثرًا عميقًا.",
  "كل يوم هو فرصة جديدة لتكون أفضل.", "الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات.", "ابتسم، فخلف الغيوم شمس ساطعة."
  // ... يمكنك إضافة المئات هنا بسهولة
];

function getRandomQuote() { return libraryContent[Math.floor(Math.random() * libraryContent.length)]; }

// --- تهيئة الواجهة ---
function saveAndApply() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  document.body.classList.toggle('light-mode', !state.dark);
  document.body.classList.toggle('glass-effect', state.glass);
  document.getElementById('darkToggle').checked = state.dark;
  document.getElementById('glassToggle').checked = state.glass;
  document.getElementById('notifToggle').checked = state.notif;
  document.getElementById('intervalSelect').value = state.interval;
  applyLang();
  renderSchedules();
}

// --- التفاعل مع الأزرار القائمة الجانبية والسفلية ---
document.getElementById('openSidebar').onclick = () => { document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebarOverlay').classList.add('show'); };
document.getElementById('closeSidebar').onclick = document.getElementById('sidebarOverlay').onclick = () => { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebarOverlay').classList.remove('show'); };

document.getElementById('darkToggle').onchange = e => { state.dark = e.target.checked; saveAndApply(); };
document.getElementById('glassToggle').onchange = e => { state.glass = e.target.checked; saveAndApply(); };
document.getElementById('notifToggle').onchange = e => { state.notif = e.target.checked; saveAndApply(); };
document.getElementById('intervalSelect').onchange = e => { state.interval = e.target.value; saveAndApply(); };

document.getElementById('btnLang').onclick = () => {
  const langs = ['ar', 'en', 'fr', 'es', 'de'];
  let currentIdx = langs.indexOf(state.lang);
  state.lang = langs[(currentIdx + 1) % langs.length];
  saveAndApply();
};

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(btn.dataset.view).classList.add('active');
    btn.classList.add('active');
  };
});

// --- طلب الأذونات والتشغيل السينمائي ---
const QatraNative = window.Capacitor?.Plugins?.QatraNative;
async function fireCinematic() {
  const quote = getRandomQuote();
  document.getElementById('dailyQuoteText').textContent = quote;
  if (QatraNative) await QatraNative.showDrop({ quote: quote });
}
document.getElementById('triggerCinematic').onclick = fireCinematic;
document.getElementById('previewFloatingBtn').onclick = fireCinematic;

// --- الصوتيات العشوائية للاسترخاء ---
const audioTracks = [
  "https://actions.google.com/sounds/v1/water/rain_on_roof.ogg",
  "https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg",
  "https://actions.google.com/sounds/v1/ambiences/birds_in_forest.ogg"
];
let player = new Audio();
let isPlaying = false;
document.getElementById('playAudioBtn').onclick = () => {
  if (isPlaying) { player.pause(); isPlaying = false; document.getElementById('playAudioBtn').textContent = "▶ تشغيل"; document.getElementById('audioStatus').textContent = "متوقف"; }
  else {
    player.src = audioTracks[Math.floor(Math.random() * audioTracks.length)];
    player.play(); isPlaying = true; document.getElementById('playAudioBtn').textContent = "⏸ إيقاف"; document.getElementById('audioStatus').textContent = "جارٍ التشغيل...";
  }
};

// --- المواعيد والمكتبة ---
function renderSchedules() {
  document.getElementById('schedulesList').innerHTML = state.schedules.map((time, i) => 
    `<div class="glass-card" style="padding:10px; display:flex; justify-content:space-between; margin-bottom:5px;">
      <span>${time}</span><button onclick="deleteTime(${i})" style="color:#ff4d4d; background:none; border:none; font-weight:bold;">X</button>
    </div>`
  ).join('');
}
document.getElementById('addScheduleBtn').onclick = () => {
  const t = document.getElementById('customTime').value;
  if(t) { state.schedules.push(t); saveAndApply(); document.getElementById('customTime').value = ""; }
};
window.deleteTime = (i) => { state.schedules.splice(i, 1); saveAndApply(); };

function renderLibrary() {
  document.getElementById('libraryContent').innerHTML = libraryContent.map(q => 
    `<div class="glass-card" style="padding:15px; cursor:pointer;" onclick="selectQuote('${q}')">${q}</div>`
  ).join('');
}
window.selectQuote = (q) => { document.getElementById('dailyQuoteText').textContent = q; alert("تم تحديد العبارة!"); };

// --- البداية ---
window.onload = () => {
  if (QatraNative) QatraNative.askPermissions();
  saveAndApply();
  renderLibrary();
  document.getElementById('dailyQuoteText').textContent = getRandomQuote();
  setTimeout(() => { document.getElementById('splash').style.opacity = '0'; setTimeout(()=> document.getElementById('splash').remove(), 800); }, 2500);
};
