"use strict";

const STORE_KEY = "qatra_pro_final_v4";

// محتوى المكتبة
const DHIKR_DB = [
  "سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين.",
  "اللهم إنك عفو تحب العفو فاعف عني.", "حسبي الله لا إله إلا هو، عليه توكلت وهو رب العرش العظيم.",
  "لا حول ولا قوة إلا بالله.", "اللهم صل وسلم وبارك على نبينا محمد."
];
const QUOTES_DB = [
  "الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات.", "لا يلزم أن تكون كل خطواتك كبيرة؛ المهم أن تواصل السير.",
  "تمهّل، فلكل مرحلة حكمتها.", "القليل المستمر يصنع أثرًا عميقًا.", "ابتسم، فخلف الغيوم شمس ساطعة."
];

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  lang: 'ar', dark: true, glass: false, notif: true, 
  selectedQuotes: [...DHIKR_DB, ...QUOTES_DB] // تحديد الكل افتراضياً
};

const QatraNative = window.Capacitor?.Plugins?.QatraNative;

// --- اللغات ---
const dict = {
  ar: { app_title: "قطرة", home: "الرئيسية", meditation: "تأمل", settings: "قطرة", quotes: "اقتباسات" },
  en: { app_title: "Qatra", home: "Home", meditation: "Meditate", settings: "Settings", quotes: "Quotes" },
  fr: { app_title: "Qatra", home: "Accueil", meditation: "Méditer", settings: "Paramètres", quotes: "Citations" }
};
function applyState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  document.body.classList.toggle('light-mode', !state.dark);
  document.body.classList.toggle('glass-active', state.glass);
  document.getElementById('darkToggle').checked = state.dark;
  document.getElementById('glassToggle').checked = state.glass;
  document.getElementById('notifToggle').checked = state.notif;
  document.getElementById('langSelect').value = state.lang;
  
  document.documentElement.dir = (state.lang === 'ar') ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if(dict[state.lang] && dict[state.lang][el.getAttribute('data-i18n')]) {
      el.textContent = dict[state.lang][el.getAttribute('data-i18n')];
    }
  });
}

// --- أحداث الإعدادات ---
document.getElementById('darkToggle').onchange = e => { state.dark = e.target.checked; applyState(); };
document.getElementById('glassToggle').onchange = e => { state.glass = e.target.checked; applyState(); };
document.getElementById('notifToggle').onchange = e => { state.notif = e.target.checked; applyState(); };
document.getElementById('langSelect').onchange = e => { state.lang = e.target.value; applyState(); };

// --- التنقل ---
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(btn.dataset.view).classList.add('active');
    btn.classList.add('active');
    window.scrollTo({top:0, behavior:'smooth'});
  };
});

// --- المكتبة وتحديد الاقتباسات ---
function toggleQuote(quote, isChecked) {
  if(isChecked) { if(!state.selectedQuotes.includes(quote)) state.selectedQuotes.push(quote); }
  else { state.selectedQuotes = state.selectedQuotes.filter(q => q !== quote); }
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function renderLibrary() {
  const buildList = (list, containerId) => {
    document.getElementById(containerId).innerHTML = list.map(q => {
      const checked = state.selectedQuotes.includes(q) ? "checked" : "";
      return `<div class="quote-item">
        <input type="checkbox" class="quote-checkbox" value="${q}" ${checked} onchange="toggleQuote(this.value, this.checked)">
        <div class="quote-text">${q}</div>
      </div>`;
    }).join('');
  };
  buildList(DHIKR_DB, 'dhikrList');
  buildList(QUOTES_DB, 'quotesList');
}

// --- القطرة السينمائية ---
function getRandomQuote() {
  const pool = state.selectedQuotes.length > 0 ? state.selectedQuotes : [...DHIKR_DB];
  return pool[Math.floor(Math.random() * pool.length)];
}

async function fireCinematic() {
  const quote = getRandomQuote();
  document.getElementById('dailyQuoteText').textContent = quote;
  if (QatraNative) {
    await QatraNative.showDrop({ quote: quote });
    // Update basic stats locally
    let drops = parseInt(document.getElementById('statDrops').innerText) || 0;
    document.getElementById('statDrops').innerText = drops + 1;
  } else {
    alert("سيتم عرض القطرة الزجاجية في الأندرويد.");
  }
}
document.getElementById('triggerCinematic').onclick = fireCinematic;
document.getElementById('previewFloatingBtn').onclick = fireCinematic;

// --- مؤقت التأمل والقرآن ---
let timerInterval; let timeLeft = 25 * 60; let isTimerRunning = false;
document.getElementById('timerPlayBtn').onclick = () => {
  if (isTimerRunning) { clearInterval(timerInterval); document.getElementById('timerPlayBtn').innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`; } 
  else {
    timerInterval = setInterval(() => {
      if (timeLeft > 0) { timeLeft--; const m = Math.floor(timeLeft/60).toString().padStart(2,'0'); const s = (timeLeft%60).toString().padStart(2,'0'); document.getElementById('timerDisplay').textContent = `${m}:${s}`; }
      else { clearInterval(timerInterval); alert("انتهت الجلسة!"); }
    }, 1000);
    document.getElementById('timerPlayBtn').innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
  }
  isTimerRunning = !isTimerRunning;
};

// أصوات القرآن والطبيعة
const audioTracks = [
  "https://server8.mp3quran.net/afs/001.mp3", // الفاتحة (مشاري العفاسي كمثال)
  "https://actions.google.com/sounds/v1/water/rain_on_roof.ogg",
  "https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg"
];
let player = new Audio(); let isPlaying = false;
document.getElementById('playAudioBtn').onclick = () => {
  if (isPlaying) { player.pause(); isPlaying = false; document.getElementById('playAudioBtn').textContent = "▶ تشغيل محتوى عشوائي"; document.getElementById('audioStatus').textContent = "متوقف"; }
  else {
    player.src = audioTracks[Math.floor(Math.random() * audioTracks.length)];
    player.play(); isPlaying = true; document.getElementById('playAudioBtn').textContent = "⏸ إيقاف"; document.getElementById('audioStatus').textContent = "جارٍ الاستماع...";
  }
};

// --- البداية والأذونات ---
window.onload = () => {
  applyState();
  renderLibrary();
  document.getElementById('dailyQuoteText').textContent = getRandomQuote();
  
  // طلب الأذونات فوراً عند الفتح
  if (QatraNative) {
    QatraNative.askPermissions().catch(e => console.log(e));
  }
};
