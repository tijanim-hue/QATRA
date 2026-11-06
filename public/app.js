"use strict";

const STORE_KEY = "qatra_pro_v6";

// أقسام الاقتباسات
const QUOTES_DB = {
  dhikr: { title: "أذكار وأدعية 🤲", items: ["سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين.", "اللهم إنك عفو تحب العفو فاعف عني.", "حسبي الله لا إله إلا هو، عليه توكلت وهو رب العرش العظيم."] },
  motivation: { title: "تحفيز وإيجابية 💡", items: ["الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات.", "لا يلزم أن تكون كل خطواتك كبيرة؛ المهم أن تواصل السير.", "تمهّل، فلكل مرحلة حكمتها.", "القليل المستمر يصنع أثرًا عميقًا."] },
  quran: { title: "آيات قرآنية 📖", items: ["وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", "إِنَّ مَعَ الْعُسْرِ يُسْرًا", "فَاصْبِرْ صَبْرًا جَمِيلًا"] }
};

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  lang: 'ar', dark: true, glass: true, mode: 'both', duration: 10000, interval: '0',
  selectedQuotes: [...QUOTES_DB.dhikr.items, ...QUOTES_DB.motivation.items],
  schedules: [], stats: { drops: 0, notifs: 0, days: 1 }
};

const QatraNative = window.Capacitor?.Plugins?.QatraNative;

// --- اللغات ---
const dict = {
  ar: { app_title: "قطرة", home: "الرئيسية", meditation: "تأمل", qatra_settings: "قطرة", quotes: "اقتباسات", focus_session: "جلسة تركيز وهدوء", quote_of_day: "اقتباس اليوم", activity_week: "نشاط هذا الأسبوع", upcoming_reminders: "تذكيراتك القادمة", glass_mode: "تأثير الزجاج 💎", dark_mode: "الوضع الداكن 🌙", language: "لغة التطبيق:", share: "مشاركة التطبيق", about: "حول قطرة", stats: "إحصائيات التقدم 📈" },
  en: { app_title: "Qatra", home: "Home", meditation: "Meditate", qatra_settings: "Drop", quotes: "Quotes", focus_session: "Focus & Calm", quote_of_day: "Daily Quote", activity_week: "Weekly Activity", upcoming_reminders: "Upcoming", glass_mode: "Glass Effect 💎", dark_mode: "Dark Mode 🌙", language: "Language:", share: "Share App", about: "About", stats: "Statistics 📈" },
  fr: { app_title: "Qatra", home: "Accueil", meditation: "Méditer", qatra_settings: "Goutte", quotes: "Citations", focus_session: "Concentration", quote_of_day: "Citation du Jour", activity_week: "Activité", upcoming_reminders: "À venir", glass_mode: "Effet Verre 💎", dark_mode: "Mode Sombre 🌙", language: "Langue:", share: "Partager", about: "À propos", stats: "Statistiques 📈" }
};

function applyState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  document.body.classList.toggle('light-mode', !state.dark);
  document.body.classList.toggle('glass-active', state.glass);
  
  document.getElementById('darkToggle').checked = state.dark;
  document.getElementById('glassToggle').checked = state.glass;
  document.getElementById('langSelect').value = state.lang;
  document.getElementById('notifModeSetting').value = state.mode;
  document.getElementById('dropDurationSetting').value = state.duration;
  document.getElementById('intervalSelect').value = state.interval;

  document.documentElement.dir = (state.lang === 'ar') ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if(dict[state.lang] && dict[state.lang][el.getAttribute('data-i18n')]) el.textContent = dict[state.lang][el.getAttribute('data-i18n')];
  });

  document.getElementById('statDrops').innerText = state.stats.drops;
  document.getElementById('statNotifs').innerText = state.stats.notifs;
  document.getElementById('statDays').innerText = state.stats.days;
}

// --- أحداث القوائم ---
document.getElementById('openSidebar').onclick = () => { document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebarOverlay').classList.add('show'); };
document.getElementById('closeSidebar').onclick = document.getElementById('sidebarOverlay').onclick = () => { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebarOverlay').classList.remove('show'); };

document.getElementById('darkToggle').onchange = e => { state.dark = e.target.checked; applyState(); };
document.getElementById('glassToggle').onchange = e => { state.glass = e.target.checked; applyState(); };
document.getElementById('langSelect').onchange = e => { state.lang = e.target.value; applyState(); };
document.getElementById('notifModeSetting').onchange = e => { state.mode = e.target.value; applyState(); syncNativeAlarms();};
document.getElementById('dropDurationSetting').onchange = e => { state.duration = parseInt(e.target.value); applyState(); };
document.getElementById('intervalSelect').onchange = e => { state.interval = e.target.value; applyState(); syncNativeAlarms();};

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(btn.dataset.view).classList.add('active');
    btn.classList.add('active');
  };
});

// --- بناء أقسام الاقتباسات ---
function renderLibrary() {
  let html = "";
  for (const [key, category] of Object.entries(QUOTES_DB)) {
    html += `<div class="category-title">${category.title}</div>`;
    category.items.forEach(q => {
      const checked = state.selectedQuotes.includes(q) ? "checked" : "";
      html += `<div class="quote-item">
        <input type="checkbox" class="quote-checkbox" value="${q}" ${checked} 
          onchange="if(this.checked) state.selectedQuotes.push(this.value); else state.selectedQuotes = state.selectedQuotes.filter(x => x !== this.value); applyState();">
        <div style="font-size:14px; line-height:1.6;">${q}</div>
      </div>`;
    });
  }
  document.getElementById('libraryContainer').innerHTML = html;
}

// --- الأيام والمواعيد ---
const WEEK_DAYS = [{ id: 0, name: "أحد" }, { id: 1, name: "إثن" }, { id: 2, name: "ثلا" }, { id: 3, name: "أرب" }, { id: 4, name: "خمي" }, { id: 5, name: "جمع" }, { id: 6, name: "سبت" }];
let currentSelectedDays = new Set([0,1,2,3,4,5,6]);

function renderDaysGrid() {
  document.getElementById('daysGrid').innerHTML = WEEK_DAYS.map(d => 
    `<div class="day-chip ${currentSelectedDays.has(d.id)?'active':''}" onclick="toggleDay(${d.id})">${d.name}</div>`
  ).join('');
}
window.toggleDay = (id) => { currentSelectedDays.has(id) ? currentSelectedDays.delete(id) : currentSelectedDays.add(id); renderDaysGrid(); };

function renderSchedules() {
  document.getElementById('savedSchedulesList').innerHTML = state.schedules.map((s, i) => 
    `<div class="glass-panel" style="padding:15px; display:flex; justify-content:space-between; margin-bottom:10px;">
      <div><strong>${s.time}</strong> <span style="font-size:11px;color:var(--muted)">(${s.days.length} أيام)</span></div>
      <button onclick="deleteSchedule(${i})" style="background:none;border:none;color:#ff4d4d;font-weight:bold;cursor:pointer;">حذف</button>
    </div>`
  ).join('');
  
  // تحديث نص "تذكيراتك القادمة" في الرئيسية
  const nextTxt = document.getElementById('nextReminderText');
  if(state.interval !== '0') nextTxt.innerText = `تكرار تلقائي مفعل (كل ${state.interval} دقيقة)`;
  else if(state.schedules.length > 0) nextTxt.innerText = `لديك ${state.schedules.length} مواعيد مبرمجة`;
  else nextTxt.innerText = "لم يتم تحديد مواعيد";
}

document.getElementById('saveScheduleBtn').onclick = () => {
  const time = document.getElementById('customTime').value;
  if(!time || currentSelectedDays.size === 0) return alert("الرجاء اختيار الوقت ويوم واحد على الأقل.");
  state.schedules.push({ id: Math.floor(Math.random()*100000), time: time, days: Array.from(currentSelectedDays) });
  applyState(); renderSchedules(); syncNativeAlarms();
};
window.deleteSchedule = (i) => { 
  if(QatraNative && state.schedules[i]) QatraNative.cancel({id: state.schedules[i].id});
  state.schedules.splice(i, 1); applyState(); renderSchedules(); 
};

function syncNativeAlarms() {
  if(!QatraNative) return;
  const quote = getRandomQuote();
  // إرسال طلب جدولة التكرار
  QatraNative.scheduleInterval({ intervalMinutes: parseInt(state.interval), mode: state.mode, duration: state.duration, quote: quote });
  // إرسال المواعيد المحددة
  state.schedules.forEach(s => {
    QatraNative.schedule({ id: s.id, time: s.time, days: s.days, mode: state.mode, duration: state.duration, quote: quote });
  });
}

// --- القطرة السينمائية المباشرة ---
function getRandomQuote() {
  const pool = state.selectedQuotes.length > 0 ? state.selectedQuotes : QUOTES_DB.dhikr.items;
  return pool[Math.floor(Math.random() * pool.length)];
}

async function fireCinematic() {
  const quote = getRandomQuote();
  document.getElementById('dailyQuoteText').textContent = `"${quote}"`;
  if (QatraNative) {
    state.stats.drops++; applyState();
    await QatraNative.showDrop({ quote: quote, duration: state.duration });
  }
}
document.getElementById('triggerCinematic').onclick = fireCinematic;
document.getElementById('previewFloatingBtn').onclick = fireCinematic;

// --- مؤقت التأمل وأصوات الطبيعة/القرآن ---
let timerInterval; let timeLeft = 25 * 60; let isTimerRunning = false;
let audioPlayer = new Audio(); audioPlayer.loop = true;
const audioSources = [
  "https://actions.google.com/sounds/v1/water/rain_on_roof.ogg", // مطر
  "https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg", // أمواج
  "https://server8.mp3quran.net/afs/001.mp3" // سورة الفاتحة
];

function toggleAudioTimer(btnId, displayId) {
  if (isTimerRunning) {
    clearInterval(timerInterval); audioPlayer.pause(); isTimerRunning = false;
    if(document.getElementById('timerPlayBtn')) document.getElementById('timerPlayBtn').innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    if(document.getElementById('playAudioBtn')) { document.getElementById('playAudioBtn').textContent = "▶ تشغيل محتوى عشوائي"; document.getElementById('audioStatus').textContent = "متوقف"; }
  } else {
    audioPlayer.src = audioSources[Math.floor(Math.random() * audioSources.length)];
    audioPlayer.play(); isTimerRunning = true;
    
    if(displayId) { // لو تم التشغيل من جلسة التركيز
      timerInterval = setInterval(() => {
        if (timeLeft > 0) { timeLeft--; const m = Math.floor(timeLeft/60).toString().padStart(2,'0'); const s = (timeLeft%60).toString().padStart(2,'0'); document.getElementById(displayId).textContent = `${m}:${s}`; }
        else { clearInterval(timerInterval); audioPlayer.pause(); alert("انتهت الجلسة!"); }
      }, 1000);
      document.getElementById('timerPlayBtn').innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    } else { // لو تم التشغيل من قسم تأمل
      document.getElementById('playAudioBtn').textContent = "⏸ إيقاف"; document.getElementById('audioStatus').textContent = "جارٍ الاستماع للاسترخاء...";
    }
  }
}
document.getElementById('timerPlayBtn').onclick = () => toggleAudioTimer('timerPlayBtn', 'timerDisplay');
document.getElementById('playAudioBtn').onclick = () => toggleAudioTimer('playAudioBtn', null);

// --- تهيئة التطبيق ---
window.onload = () => {
  applyState(); renderLibrary(); renderDaysGrid(); renderSchedules();
  document.getElementById('dailyQuoteText').textContent = `"${getRandomQuote()}"`;
  
  if (QatraNative) {
    QatraNative.askPermissions().then(() => {
      // إخفاء شاشة الإقلاع بعد أخذ الأذونات بنجاح
      setTimeout(() => { document.getElementById('splash').style.opacity = '0'; setTimeout(()=> document.getElementById('splash').remove(), 800); }, 1500);
    });
  } else {
    setTimeout(() => { document.getElementById('splash').style.opacity = '0'; setTimeout(()=> document.getElementById('splash').remove(), 800); }, 2000);
  }
};
