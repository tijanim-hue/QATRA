"use strict";

const STORE_KEY = "qatra_pro_v7";
const QUOTES_DB = {
  dhikr: { title: "أذكار وأدعية", emoji: "🤲", img: "linear-gradient(135deg, #00e5ff, #0066ff)", items: ["سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين."] },
  motivation: { title: "تحفيز وإيجابية", emoji: "💡", img: "linear-gradient(135deg, #a900ff, #0066ff)", items: ["الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات.", "لا يلزم أن تكون كل خطواتك كبيرة؛ المهم أن تواصل السير."] },
  quran: { title: "آيات قرآنية", emoji: "📖", img: "linear-gradient(135deg, #00e5ff, #a900ff)", items: ["وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", "إِنَّ مَعَ الْعُسْرِ يُسْرًا"] }
};

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  lang: 'ar', dark: true, glass: true, mode: 'both', duration: 10000, interval: '0',
  selectedQuotes: [...QUOTES_DB.dhikr.items, ...QUOTES_DB.motivation.items],
  schedules: [], stats: { drops: 0, notifs: 0, days: 1 }
};
const QatraNative = window.Capacitor?.Plugins?.QatraNative;

const dict = {
  ar: { app_title: "قطرة", home: "الرئيسية", meditation: "تأمل", qatra_settings: "القطرة", quotes: "اقتباسات", focus_session: "جلسة تركيز وهدوء", quote_of_day: "اقتباس اليوم", activity_week: "نشاط هذا الأسبوع", upcoming_reminders: "تذكيراتك القادمة", glass_mode: "تأثير الزجاج 💎", dark_mode: "الوضع الداكن 🌙", language: "لغة التطبيق:", share: "مشاركة التطبيق", about: "حول قطرة", stats: "إحصائيات" },
  en: { app_title: "Qatra", home: "Home", meditation: "Meditate", qatra_settings: "Drop", quotes: "Quotes", focus_session: "Focus & Calm", quote_of_day: "Daily Quote", activity_week: "Activity", upcoming_reminders: "Upcoming", glass_mode: "Glass Effect 💎", dark_mode: "Dark Mode 🌙", language: "Language:", share: "Share App", about: "About", stats: "Stats" }
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

// --- التنقل والقوائم ---
document.getElementById('openSidebar').onclick = () => { document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebarOverlay').classList.add('show'); };
document.getElementById('closeSidebar').onclick = document.getElementById('sidebarOverlay').onclick = () => { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebarOverlay').classList.remove('show'); };
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
  document.getElementById('categoriesContainer').innerHTML = Object.keys(QUOTES_DB).map(key => {
    const cat = QUOTES_DB[key];
    return `<div class="category-card" onclick="openCategory('${key}')" style="background:${cat.img}">
      <div class="cat-emoji" style="font-size:40px;">${cat.emoji}</div>
      <div style="flex:1; color:#fff;"><div style="font-size:20px; font-weight:800;">${cat.title}</div><div style="font-size:12px;">${cat.items.length} عبارات</div></div>
    </div>`;
  }).join('');
}
window.openCategory = (id) => {
  const cat = QUOTES_DB[id];
  document.getElementById('catModalTitle').innerText = cat.title;
  document.getElementById('catModalContent').innerHTML = cat.items.map(q => {
    const checked = state.selectedQuotes.includes(q) ? "checked" : "";
    return `<div style="display:flex; align-items:flex-start; gap:12px; padding:15px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
      <input type="checkbox" style="width:22px; height:22px; accent-color:var(--cyan); margin-top:2px; flex-shrink:0;" value="${q}" ${checked} 
        onchange="if(this.checked) state.selectedQuotes.push(this.value); else state.selectedQuotes = state.selectedQuotes.filter(x=>x!==this.value); applyState(); syncNativeAlarms();">
      <div style="font-size:15px; color:#fff;">${q}</div>
    </div>`;
  }).join('');
  document.getElementById('quotesCategoryModal').classList.add('show');
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
  document.getElementById('savedSchedulesList').innerHTML = state.schedules.map((s, i) => 
    `<div class="glass-panel" style="padding:15px; display:flex; justify-content:space-between; margin-bottom:10px;">
      <strong>${s.time}</strong>
      <button onclick="deleteSchedule(${i})" style="background:none;border:none;color:#ff4d4d;font-weight:bold;cursor:pointer;">حذف</button>
    </div>`
  ).join('');
  
  const nextTxt = document.getElementById('nextReminderText');
  if(state.interval !== '0') nextTxt.innerText = `تكرار مفعل (كل ${state.interval} دقيقة)`;
  else if(state.schedules.length > 0) nextTxt.innerText = `لديك ${state.schedules.length} مواعيد مبرمجة`;
  else nextTxt.innerText = "لم يتم تحديد مواعيد";
}
document.getElementById('saveScheduleBtn').onclick = () => {
  const t = document.getElementById('customTime').value;
  if(t) { state.schedules.push({id: Math.floor(Math.random()*10000), time: t}); applyState(); renderSchedules(); syncNativeAlarms(); }
};
window.deleteSchedule = (i) => { state.schedules.splice(i,1); applyState(); renderSchedules(); syncNativeAlarms(); };

function syncNativeAlarms() {
  if(!QatraNative) return;
  // إرسال المواعيد لتعمل في الثانية 00 بدقة
  state.schedules.forEach(s => QatraNative.schedule({id: s.id, time: s.time, mode: state.mode, duration: state.duration, quote: getRandomQuote()}));
}

// --- البومودورو و التأمل (أصوات عشوائية) ---
document.getElementById('startPomodoroBtn').onclick = () => {
  const mins = parseInt(document.getElementById('pomoTime').value);
  const audio = document.getElementById('pomoAudio').value;
  document.getElementById('pomodoroModal').classList.remove('show');
  if (QatraNative) {
    QatraNative.startPomodoro({ minutes: mins, audioUrl: audio }); // تشغيل في خلفية النظام
    document.getElementById('mainTimeDisplay').textContent = `${mins}:00`;
  }
};

const randomAudios = ["https://actions.google.com/sounds/v1/water/rain_on_roof.ogg", "https://server8.mp3quran.net/afs/001.mp3"];
let randPlayer = new Audio(); let isRandPlaying = false;
document.getElementById('playRandomAudioBtn').onclick = () => {
  if (isRandPlaying) { randPlayer.pause(); isRandPlaying = false; document.getElementById('playRandomAudioBtn').textContent = "▶ تشغيل محتوى عشوائي"; document.getElementById('audioStatus').textContent = "تم الإيقاف"; }
  else {
    randPlayer.src = randomAudios[Math.floor(Math.random() * randomAudios.length)];
    randPlayer.play(); isRandPlaying = true; document.getElementById('playRandomAudioBtn').textContent = "⏸ إيقاف"; document.getElementById('audioStatus').textContent = "جارٍ الاسترخاء...";
  }
};

// --- البداية: الأذونات قبل الإقلاع ---
window.onload = () => {
  applyState(); renderCategories(); renderSchedules();
  document.getElementById('dailyQuoteText').textContent = `"${getRandomQuote()}"`;
  
  if (QatraNative) {
    QatraNative.askPermissions().then(() => {
      // إخفاء الإقلاع بعد أخذ الأذونات
      document.getElementById('splash').style.opacity = '0';
      setTimeout(()=> document.getElementById('splash').remove(), 600);
    });
  } else {
    setTimeout(() => { document.getElementById('splash').style.opacity = '0'; setTimeout(()=> document.getElementById('splash').remove(), 600); }, 2000);
  }
};
