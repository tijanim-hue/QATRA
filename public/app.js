"use strict";

const STORE_KEY = "qatra_premium_v12"; // التحديث الأخير
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
  ar: { app_title: "قطرة", focus_session: "جلسة تركيز", quote_of_day: "اقتباس اليوم", upcoming: "مواعيدك", activity: "النشاط", meditation: "تأمل واسترخاء", qatra_settings: "القطرة السينمائية", quotes: "المكتبة", glass_mode: "تأثير الزجاج 💎", dark_mode: "الوضع الداكن 🌙", language: "لغة التطبيق:", stats: "الإحصائيات 📈", drop_mode: "طريقة الظهور:", mode_both: "قطرة مائية + إشعار", mode_floating: "القطرة المائية فقط", mode_notif: "إشعار فقط", drop_duration: "مدة بقاء القطرة:", drop_interval: "التكرار التلقائي للقطرة:", no_repeat: "بدون تكرار", custom_time: "إضافة موعد محدد:", save_time: "حفظ الموعد", preview_drop: "معاينة القطرة الآن 🎬", stat_days: "أيام الاستخدام:", stat_notifs: "الإشعارات المستلمة:", stat_drops: "القطرات السينمائية:" },
  en: { app_title: "Qatra", home: "Home", meditation: "Meditate", qatra_settings: "Drop", quotes: "Quotes", focus_session: "Focus & Calm", quote_of_day: "Daily Quote", upcoming: "Upcoming", activity: "Activity", glass_mode: "Glass Effect 💎", dark_mode: "Dark Mode 🌙", language: "Language:", stats: "Stats 📈", drop_mode: "Notification Mode:", mode_both: "Cinematic Drop + Notif", mode_floating: "Cinematic Drop Only", mode_notif: "Notification Only", drop_duration: "Drop Duration:", drop_interval: "Auto Repeat Interval:", no_repeat: "No Repeat", custom_time: "Set Custom Time:", save_time: "Save Schedule", preview_drop: "Preview Drop Now 🎬", stat_days: "Active Days:", stat_notifs: "Notifications Received:", stat_drops: "Cinematic Drops:" }
};

function applyState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  document.body.classList.toggle('light-mode', !state.dark);
  document.body.classList.toggle('glass-active', state.glass);
  
  const setEl = (id, prop, val) => { const el = document.getElementById(id); if (el) el[prop] = val; };
  setEl('darkToggle', 'checked', state.dark);
  setEl('glassToggle', 'checked', state.glass);
  setEl('langSelect', 'value', state.lang);
  setEl('notifModeSetting', 'value', state.mode);
  setEl('dropDurationSetting', 'value', state.duration);
  setEl('intervalSelect', 'value', state.interval);

  document.documentElement.dir = (state.lang === 'ar') ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if(dict[state.lang] && dict[state.lang][el.getAttribute('data-i18n')]) el.textContent = dict[state.lang][el.getAttribute('data-i18n')];
  });
  
  setEl('statDrops', 'innerText', state.stats.drops);
  setEl('statNotifs', 'innerText', state.stats.notifs);
  setEl('statDays', 'innerText', state.stats.days);
  renderCategories();
}

// --- التنقل ---
document.getElementById('darkToggle').onchange = e => { state.dark = e.target.checked; applyState(); };
document.getElementById('glassToggle').onchange = e => { state.glass = e.target.checked; applyState(); };
document.getElementById('langSelect').onchange = e => { state.lang = e.target.value; applyState(); };

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
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
    return `<div class="card action-row" onclick="openCategory('${key}')" style="margin-bottom:12px;">
      <div class="action-icon" style="background:rgba(0,240,255,0.1); color:var(--cyan);">
        <svg viewBox="0 0 24 24">${cat.icon}</svg>
      </div>
      <div class="action-info">
        <div class="action-title">${title}</div>
        <div class="action-sub">${cat.items.length} ${state.lang==='ar'?'عبارة':'items'}</div>
      </div>
      <div style="color:var(--muted); font-size:24px;">›</div>
    </div>`;
  }).join('');
}

window.openCategory = (id) => {
  const cat = QUOTES_DB[id];
  document.getElementById('catSheetTitle').innerText = state.lang === 'ar' ? cat.titleAr : cat.titleEn;
  document.getElementById('catSheetContent').innerHTML = cat.items.map(q => {
    const checked = state.selectedQuotes.includes(q) ? "checked" : "";
    return `<div class="check-row">
      <input type="checkbox" value="${q}" ${checked} onchange="if(this.checked) state.selectedQuotes.push(this.value); else state.selectedQuotes = state.selectedQuotes.filter(x=>x!==this.value); applyState(); syncNativeAlarms();">
      <div style="font-size:15px; font-weight:700;">${q}</div>
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
document.getElementById('previewFloatingBtn').onclick = fireCinematic;

document.getElementById('notifModeSetting').onchange = e => { state.mode = e.target.value; applyState(); syncNativeAlarms(); };
document.getElementById('dropDurationSetting').onchange = e => { state.duration = parseInt(e.target.value); applyState(); syncNativeAlarms(); };
document.getElementById('intervalSelect').onchange = e => { state.interval = e.target.value; applyState(); syncNativeAlarms(); renderSchedules(); };

function renderSchedules() {
  const list = document.getElementById('savedSchedulesList');
  if(!list) return;
  list.innerHTML = state.schedules.map((s, i) => 
    `<div class="control-row" style="background:rgba(0,0,0,0.2); padding:15px; border-radius:16px; margin-bottom:10px;">
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
  if (isRandPlaying) { randPlayer.pause(); isRandPlaying = false; document.getElementById('playRandomAudioBtn').textContent = state.lang==='ar'?"▶ تشغيل محتوى عشوائي":"▶ Play Ambient"; document.getElementById('audioStatus').textContent = state.lang==='ar'?"تم الإيقاف":"Stopped"; }
  else {
    randPlayer.src = randomAudios[Math.floor(Math.random() * randomAudios.length)];
    randPlayer.play(); isRandPlaying = true; document.getElementById('playRandomAudioBtn').textContent = "⏸ إيقاف"; document.getElementById('audioStatus').textContent = state.lang==='ar'?"جارٍ الاسترخاء...":"Relaxing...";
  }
};

// --- الإقلاع الآمن جداً (محمي من التعليق) ---
window.onload = () => {
  applyState(); 
  renderSchedules();
  const qt = document.getElementById('dailyQuoteText');
  if(qt) qt.textContent = `"${getRandomQuote()}"`;
  
  // إخفاء إجباري بعد ثانيتين مهما حدث لضمان عمل الواجهة
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) { splash.style.opacity = '0'; setTimeout(()=> splash.remove(), 600); }
  }, 2000);

  // طلب الأذونات يعمل في الخلفية ولن يعطل الشاشة
  if (QatraNative) {
    setTimeout(() => { QatraNative.askPermissions().catch(e => console.log(e)); }, 2500);
  }
};
