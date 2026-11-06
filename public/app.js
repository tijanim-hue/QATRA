"use strict";

const STORE_KEY = "qatra_premium_v11"; // مفتاح جديد لضمان تحديث الإعدادات
const QUOTES_DB = {
  dhikr: { titleAr: "أذكار وأدعية", titleEn: "Dhikr & Dua", icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', items: ["سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين."] },
  motivation: { titleAr: "تحفيز وإيجابية", titleEn: "Motivation", icon: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>', items: ["الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات.", "لا يلزم أن تكون كل خطواتك كبيرة؛ المهم أن تواصل السير."] },
  quran: { titleAr: "آيات قرآنية", titleEn: "Quran Verses", icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>', items: ["وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", "إِنَّ مَعَ الْعُسْرِ يُسْرًا"] }
};

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  lang: 'ar', dark: true, glass: true, mode: 'both', duration: 10000, interval: '0',
  selectedQuotes: [...QUOTES_DB.dhikr.items, ...QUOTES_DB.motivation.items],
  schedules: [], stats: { drops: 0, notifs: 0, days: 1 }
};
const QatraNative = window.Capacitor?.Plugins?.QatraNative;

// --- اللغات والترجمة ---
const dict = {
  ar: { app_title: "قطرة", focus_session: "جلسة تركيز", quote_of_day: "اقتباس اليوم", upcoming: "مواعيدك", activity: "النشاط", meditation: "تأمل واسترخاء", qatra_settings: "القطرة السينمائية", quotes: "المكتبة" },
  en: { app_title: "Qatra", focus_session: "Focus Session", quote_of_day: "Daily Inspiration", upcoming: "Upcoming", activity: "Activity", meditation: "Meditate", qatra_settings: "Cinematic Drop", quotes: "Quotes Library" }
};

function applyState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  document.body.classList.toggle('light-mode', !state.dark);
  document.body.classList.toggle('glass-active', state.glass);
  
  // حماية التحديثات باستخدام دالة تأكد من وجود العنصر
  const safeSetChecked = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
  const safeSetValue = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  const safeSetText = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };

  safeSetChecked('darkToggle', state.dark);
  safeSetChecked('glassToggle', state.glass);
  safeSetValue('langSelect', state.lang);
  safeSetValue('notifModeSetting', state.mode);
  safeSetValue('dropDurationSetting', state.duration);
  safeSetValue('intervalSelect', state.interval);

  document.documentElement.dir = (state.lang === 'ar') ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if(dict[state.lang] && dict[state.lang][el.getAttribute('data-i18n')]) el.textContent = dict[state.lang][el.getAttribute('data-i18n')];
  });
  
  safeSetText('statDrops', state.stats.drops);
  safeSetText('statNotifs', state.stats.notifs);
  safeSetText('statDays', state.stats.days);
  renderCategories();
}

// --- التنقل ---
document.getElementById('openSettingsSheet').onclick = () => document.getElementById('settingsSheet').classList.add('show');
document.getElementById('darkToggle').onchange = e => { state.dark = e.target.checked; applyState(); };
document.getElementById('glassToggle').onchange = e => { state.glass = e.target.checked; applyState(); };
document.getElementById('langSelect').onchange = e => { state.lang = e.target.value; applyState(); };

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(n => n.classList.remove('active'));
    document.getElementById(btn.dataset.view).classList.add('active');
    btn.classList.add('active');
  };
});

// --- الأقسام والاقتباسات ---
function renderCategories() {
  const container = document.getElementById('categoriesContainer');
  if(!container) return;
  container.innerHTML = Object.keys(QUOTES_DB).map(key => {
    const cat = QUOTES_DB[key];
    const title = state.lang === 'ar' ? cat.titleAr : cat.titleEn;
    return `<div class="cat-item" onclick="openCategory('${key}')">
      <div style="width:40px; height:40px; border-radius:12px; background:rgba(0,240,255,0.1); color:var(--primary); display:grid; place-items:center;">
        <svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;">${cat.icon}</svg>
      </div>
      <div style="flex:1;">
        <div style="font-weight:700; font-size:16px;">${title}</div>
        <div style="font-size:12px; color:var(--text-dim);">${cat.items.length} ${state.lang==='ar'?'عبارة':'items'}</div>
      </div>
      <div style="color:var(--text-dim); font-size:20px;">›</div>
    </div>`;
  }).join('');
}

window.openCategory = (id) => {
  const cat = QUOTES_DB[id];
  document.getElementById('catSheetTitle').innerText = state.lang === 'ar' ? cat.titleAr : cat.titleEn;
  document.getElementById('catSheetContent').innerHTML = cat.items.map(q => {
    const checked = state.selectedQuotes.includes(q) ? "checked" : "";
    return `<div class="checkbox-row">
      <input type="checkbox" value="${q}" ${checked} onchange="if(this.checked) state.selectedQuotes.push(this.value); else state.selectedQuotes = state.selectedQuotes.filter(x=>x!==this.value); applyState(); syncNativeAlarms();">
      <div style="font-size:15px; font-weight:600;">${q}</div>
    </div>`;
  }).join('');
  document.getElementById('categorySheet').classList.add('show');
};

// --- القطرة والمواعيد ---
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

document.getElementById('notifModeSetting').onchange = e => { state.mode = e.target.value; applyState(); syncNativeAlarms(); };
document.getElementById('dropDurationSetting').onchange = e => { state.duration = parseInt(e.target.value); applyState(); syncNativeAlarms(); };
document.getElementById('intervalSelect').onchange = e => { state.interval = e.target.value; applyState(); syncNativeAlarms(); renderSchedules(); };

function renderSchedules() {
  const list = document.getElementById('savedSchedulesList');
  if(!list) return;
  list.innerHTML = state.schedules.map((s, i) => 
    `<div class="modern-row" style="background:rgba(0,0,0,0.2); padding:15px; border-radius:16px; margin-bottom:10px;">
      <strong style="font-size:18px;">${s.time}</strong>
      <button onclick="deleteSchedule(${i})" style="background:none;border:none;color:#ff4d4d;font-weight:bold;cursor:pointer;">X</button>
    </div>`
  ).join('');
  
  const nextTxt = document.getElementById('nextReminderText');
  if(state.interval !== '0') nextTxt.innerText = state.lang === 'ar' ? `تكرار (كل ${state.interval} دقيقة)` : `Repeat (${state.interval}m)`;
  else if(state.schedules.length > 0) nextTxt.innerText = state.lang === 'ar' ? `لديك ${state.schedules.length} مواعيد` : `${state.schedules.length} Schedules`;
  else nextTxt.innerText = state.lang === 'ar' ? "لا يوجد مواعيد" : "No schedule";
}

document.getElementById('saveScheduleBtn').onclick = () => {
  const t = document.getElementById('customTime').value;
  if(t) { state.schedules.push({id: Math.floor(Math.random()*10000), time: t}); applyState(); renderSchedules(); syncNativeAlarms(); }
};
window.deleteSchedule = (i) => { state.schedules.splice(i,1); applyState(); renderSchedules(); syncNativeAlarms(); };

function syncNativeAlarms() {
  if(!QatraNative) return;
  QatraNative.scheduleInterval({ intervalMinutes: parseInt(state.interval), mode: state.mode, duration: state.duration, quote: getRandomQuote() }).catch(e=>console.log(e));
  state.schedules.forEach(s => QatraNative.schedule({id: s.id, time: s.time, mode: state.mode, duration: state.duration, quote: getRandomQuote()}).catch(e=>console.log(e)));
}

// --- البومودورو و التأمل ---
document.getElementById('startPomodoroBtn').onclick = () => {
  const mins = parseInt(document.getElementById('pomoTime').value);
  const audio = document.getElementById('pomoAudio').value;
  document.getElementById('pomodoroSheet').classList.remove('show');
  if (QatraNative) {
    QatraNative.startPomodoro({ minutes: mins, audioUrl: audio }); 
    document.getElementById('mainTimeDisplay').textContent = `${mins}:00`;
  }
};

const randomAudios = ["https://actions.google.com/sounds/v1/water/rain_on_roof.ogg", "https://server8.mp3quran.net/afs/001.mp3"];
let randPlayer = new Audio(); let isRandPlaying = false;
document.getElementById('playRandomAudioBtn').onclick = () => {
  if (isRandPlaying) { randPlayer.pause(); isRandPlaying = false; document.getElementById('playRandomAudioBtn').textContent = state.lang==='ar'?"▶ تشغيل محتوى عشوائي":"▶ Play Ambient"; document.getElementById('audioStatus').textContent = state.lang==='ar'?"متوقف":"Stopped"; }
  else {
    randPlayer.src = randomAudios[Math.floor(Math.random() * randomAudios.length)];
    randPlayer.play(); isRandPlaying = true; document.getElementById('playRandomAudioBtn').textContent = "⏸"; document.getElementById('audioStatus').textContent = state.lang==='ar'?"جارٍ الاسترخاء...":"Relaxing...";
  }
};

// --- الإقلاع الآمن ---
window.onload = () => {
  applyState(); 
  renderSchedules();
  const qt = document.getElementById('dailyQuoteText');
  if(qt) qt.textContent = `"${getRandomQuote()}"`;
  
  // 1. إخفاء شاشة الإقلاع بشكل مستقل لتفادي أي تجميد
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) {
      splash.style.opacity = '0';
      setTimeout(()=> splash.remove(), 600);
    }
  }, 1500);

  // 2. طلب الأذونات بدون أن تؤثر على إخفاء شاشة الإقلاع
  if (QatraNative) {
    setTimeout(() => {
      QatraNative.askPermissions().catch(e => console.log("Permissions prompt dismissed/failed", e));
    }, 1800);
  }
};
