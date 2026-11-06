"use strict";

const STORAGE_KEY = "qatra_pro_v3";

const CATEGORIES = [
  { id: "hope", name: "الأمل", emoji: "🌱", type: "quote", quotes: ["لا يلزم أن تكون كل خطواتك كبيرة؛ المهم أن تواصل السير.", "قد يحمل الغد بابًا لم تره اليوم."] },
  { id: "calm", name: "الهدوء", emoji: "🌊", type: "quote", quotes: ["ليس عليك أن تحمل كل شيء في هذه اللحظة.", "تمهّل، فلكل مرحلة حكمتها."] },
  { id: "dhikr", name: "الأذكار والأدعية", emoji: "🤲", type: "dhikr", quotes: ["سبحان الله وبحمده، سبحان الله العظيم.", "اللهم إني أسألك العفو والعافية.", "لا إله إلا أنت سبحانك إني كنت من الظالمين."] }
];

let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  isDarkMode: true, isGlassmorphism: false, contentType: 'all', notificationEnabled: true
};

const QatraNative = window.Capacitor?.Plugins?.QatraNative;

/* --- دوال الواجهة والثيم --- */
function applyTheme() {
  document.body.classList.toggle('dark-mode', state.isDarkMode);
  document.body.classList.toggle('glass-effect', state.isGlassmorphism);
  document.getElementById('glassmorphismToggle').checked = state.isGlassmorphism;
  document.getElementById('contentTypeSetting').value = state.contentType;
  document.getElementById('notificationSetting').checked = state.notificationEnabled;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  applyTheme();
}

function getRandomQuote() {
  let contentList = CATEGORIES.flatMap(c => c.quotes);
  if (state.contentType === 'quotes') contentList = CATEGORIES.filter(c => c.type === 'quote').flatMap(c => c.quotes);
  if (state.contentType === 'dhikr') contentList = CATEGORIES.find(c => c.type === 'dhikr').quotes;
  return contentList[Math.floor(Math.random() * contentList.length)] || "الحمد لله";
}

/* --- القائمة الجانبية (Hamburger) والزجاج والداكن --- */
document.getElementById('openSidebar').onclick = () => {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('show');
};
document.getElementById('closeSidebar').onclick = document.getElementById('sidebarOverlay').onclick = () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
};

document.getElementById('darkModeBtn').onclick = () => {
  state.isDarkMode = !state.isDarkMode;
  saveState();
};
document.getElementById('glassmorphismToggle').onchange = (e) => {
  state.isGlassmorphism = e.target.checked;
  saveState();
};

/* --- أزرار القائمة الجانبية --- */
document.getElementById('btnShare').onclick = () => navigator.share && navigator.share({ title: 'قطرة', text: 'تطبيق قطرة للوعي والأذكار' });
document.getElementById('btnAbout').onclick = () => alert("تطبيق قطرة: مصمم لمنحك لحظة هدوء وسط ضجيج الحياة.");
document.getElementById('btnPrivacy').onclick = () => alert("لا يتم جمع أي بيانات شخصية.");
document.getElementById('btnLang').onclick = () => alert("اللغة العربية مدعومة حالياً.");

/* --- التنقل السفلي (Bottom Nav) --- */
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(btn.dataset.view).classList.add('active');
    btn.classList.add('active');
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
});

/* --- مؤقت التركيز (Timer) --- */
let timerInterval;
let timeLeft = 25 * 60;
let isTimerRunning = false;
const display = document.getElementById('timerDisplay');
const playBtn = document.getElementById('timerPlayBtn');

function updateTimerDisplay() {
  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');
  display.textContent = `${m}:${s}`;
}
playBtn.onclick = () => {
  if (isTimerRunning) {
    clearInterval(timerInterval);
    playBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
  } else {
    timerInterval = setInterval(() => {
      if (timeLeft > 0) { timeLeft--; updateTimerDisplay(); }
      else { clearInterval(timerInterval); alert("انتهت جلسة التركيز!"); }
    }, 1000);
    playBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
  }
  isTimerRunning = !isTimerRunning;
};

/* --- السحر السينمائي (القطرة) --- */
async function fireCinematicDrop() {
  const quote = getRandomQuote();
  if (QatraNative && QatraNative.showDrop) {
    await QatraNative.showDrop({ quote: quote });
  } else {
    alert("سيتم عرض التأثير السينمائي المذهل في تطبيق الأندرويد.");
  }
}

// تشغيل التأثير عند الضغط على "اقتباس اليوم" أو زر المعاينة
document.getElementById('triggerCinematicDrop').onclick = fireCinematicDrop;
document.getElementById('previewFloatingSetting').onclick = fireCinematicDrop;

/* --- إعدادات المحتوى والإشعارات --- */
document.getElementById('contentTypeSetting').onchange = (e) => { state.contentType = e.target.value; saveState(); };
document.getElementById('notificationSetting').onchange = (e) => { state.notificationEnabled = e.target.checked; saveState(); };

// تحميل مكتبة الاقتباسات
const libContainer = document.getElementById('libraryGrid');
CATEGORIES.forEach(cat => {
  libContainer.innerHTML += `
    <div class="category-card glass-panel">
      <div class="category-emoji">${cat.emoji}</div>
      <div style="font-weight:700; font-size:14px;">${cat.name}</div>
      <div style="font-size:10px; color:var(--muted);">${cat.quotes.length} عبارات</div>
    </div>`;
});

/* --- تهيئة التطبيق --- */
document.getElementById('dailyQuoteText').textContent = getRandomQuote();
applyTheme();
updateTimerDisplay();
